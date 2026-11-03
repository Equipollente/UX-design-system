// Génère src/design-system/styles/tokens.css et src/design-system/data/tokens.json
// depuis les exports de variables Figma (format W3C DTCG) rangés dans tokens/.
//
// La source de vérité est tokens/<collection>/*.tokens.json — jamais les fichiers
// générés. Pour mettre à jour : ré-exporter les collections depuis Figma dans
// tokens/, puis `npm run tokens`.
//
// Une collection Figma = un dossier. Un mode Figma = un fichier.
//
//   primitives/   rampes brutes (--ramp-*), que seuls les rôles de color.* lisent
//   semantic/     les rôles de couleur, en deux modes : Default (le :root) et
//                 Prof Hub (un thème, [data-theme="prof-hub"])
//   size/         l'échelle (--base-*), les traits, les rayons, les contrôles…
//   typography/   les polices, les graisses, les tailles et les rôles de texte
//   layout/       ce qui change selon l'appareil : Desktop est le :root, les trois
//                 autres sont des media queries
//   motion/       durées et courbes
//   effects/      ombres, opacité, rapports
//
// DSFR.tokens.json reste à part : la palette de l'État n'est pas chargée par défaut.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Une taille de police s'écrit en rem pour suivre le réglage du navigateur. Le rem
// vaut 16 px par défaut dans tous les navigateurs : c'est une propriété de la
// plateforme, pas une valeur de design — d'où sa place ici et pas dans Figma.
const REM = 16;

// Les media queries des modes de la collection Layout. Les largeurs de référence
// (`viewport.width`) sont 390, 768, 1200 et 1060 : tablette de 768 à 1199, mobile
// en dessous.
const MODES = [
  { name: 'Tablet', query: '(min-width: 768px) and (max-width: 1199px)' },
  { name: 'Mobile', query: '(max-width: 767px)' },
  { name: 'Paper', query: 'print' },
];

// Les modes de couleur de la collection Semantic. Le premier est le :root.
const THEME_BASE = 'Default';
const THEMES = [{ name: 'Prof Hub', selector: '[data-theme="prof-hub"]' }];

// Les collections lues, dans l'ordre d'émission. `prefix` : Figma n'écrit pas le nom
// de la collection dans le chemin d'un token, et `duration.quick` ne dit pas de quoi
// il est la durée. Le préfixe le dit (--motion-duration-quick).
const SOURCES = [
  { dir: 'primitives', mode: 'Valeur' },
  { dir: 'semantic', mode: THEME_BASE },
  { dir: 'size', mode: 'Valeur' },
  { dir: 'typography', mode: 'Valeur' },
  { dir: 'layout', mode: 'Desktop' },
  { dir: 'motion', mode: 'Valeur', prefix: 'motion' },
  { dir: 'effects', mode: 'Valeur' },
];

// Ajoutées par le build, pas par Figma : les tokens ne portent que le nom de la
// famille. Même approche que folio/Folio-claude-design-system/styles.css.
const FALLBACKS = {
  Poppins: 'system-ui, sans-serif',
  Inter: 'system-ui, -apple-system, sans-serif',
};

// Titres des blocs de tokens.css, dans l'ordre d'émission. La clé est le premier
// segment du chemin, sauf pour l'échelle de typographie (`base.text.*`), qui
// partage son premier segment avec l'échelle d'espacement.
const GROUP_TITLES = {
  ramp: 'Rampes — les couleurs brutes, que seuls les rôles de color.* lisent',
  color: 'Couleurs — les rôles',
  base: 'Échelle — les valeurs brutes, que les contrôles et les piles lisent',
  border: 'Traits — épaisseurs, rayons et anneau de focus',
  breakpoint: 'Seuils de largeur',
  viewport: 'Fenêtre — conditions de media query et largeur de référence',
  stack: 'Piles — l’écart et la marge d’un groupe d’éléments',
  section: 'Sections — l’espace entre les blocs d’une page',
  control: 'Contrôles — hauteur, marges et écarts d’un bouton ou d’un champ',
  controlStack: 'Contrôles voisins — l’écart entre deux contrôles',
  icon: 'Icônes — la taille',
  overlay: 'Surcouches — menus, popovers, modales',
  nav: 'Nav — la hauteur de la barre, lue par les pages qui se calent dessous',
  fontStack: 'Polices — les familles',
  'base-text': 'Typographie, échelle — graisses, tailles, interlignes, espacement des lettres',
  text: 'Typographie, rôles — la police, la taille et la graisse d’un type de texte',
  motion: 'Mouvement — durées et courbes',
  shadow: 'Ombres — les parties nommées, puis les ombres composées',
  opacity: 'Opacités — l’atténuation d’un objet, pas sa couleur',
  ratio: 'Rapports — les formes des images',
};

const groupOf = (path) => (path.startsWith('base.text.') ? 'base-text' : path.split('.')[0]);

// `color.background.primary.bold` → `--color-background-primary-bold`. Les noms
// Figma en camelCase (`lineHeight`, `paddingInline`, `fontStack`) deviennent des mots
// séparés par des tirets : `--base-text-line-height-snug`.
const cssName = (path) =>
  '--' +
  path
    .split('.')
    .join('-')
    .replace(/\s+/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

const read = (dir, mode) =>
  JSON.parse(readFileSync(join(ROOT, 'tokens', dir, `${mode}.tokens.json`), 'utf8'));

/**
 * Un token de l'export. Quand l'alias traverse deux collections (un rôle de
 * `semantic` qui pointe vers `primitives`), Figma n'écrit pas `{chemin}` mais la
 * valeur déjà résolue, et nomme la cible dans `com.figma.aliasData`. On rétablit
 * l'alias : sinon la chaîne meurt à l'export et le CSS ne garde qu'un hex.
 *
 * Seulement vers « Primitives », la seule collection dont les rôles dépendent : un
 * alias vers n'importe quelle autre pointerait vers un token que ce script n'a pas
 * lu, alors que la valeur résolue, elle, est exacte et suffit.
 */
function token(path, node, prefix) {
  const alias = node.$extensions?.['com.figma.aliasData'];
  const versRampe = /Primitives$/.test(alias?.targetVariableSetName ?? '');
  let value = node.$value;
  if (versRampe && typeof value !== 'string') {
    value = `{${alias.targetVariableName.split('/').join('.')}}`;
  } else if (prefix && isAlias(value)) {
    // Un alias dans une collection préfixée vise une variable de la même collection.
    value = `{${prefix}.${aliasTarget(value)}}`;
  }
  return {
    path: path.join('.'),
    type: node.$type,
    value,
    description: node.$description ?? '',
  };
}

/** Aplatit l'arbre DTCG en liste ordonnée de tokens. */
function flatten(node, path = [], out = [], prefix) {
  for (const [key, value] of Object.entries(node)) {
    // `$root` : Figma l'écrit quand une variable (`feedback/success`) a le même nom qu'un
    // groupe qui en contient d'autres (`feedback/success/bg`). C'est la variable du groupe
    // lui-même, pas une métadonnée — l'ignorer ferait disparaître `--color-feedback-success`.
    if (key === '$root' && value && value.$type) {
      out.push(token(path, value, prefix));
      continue;
    }
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object') {
      if (value.$type) {
        out.push(token([...path, key], value, prefix));
      } else {
        flatten(value, [...path, key], out, prefix);
      }
    }
  }
  return out;
}

const isAlias = (v) => typeof v === 'string' && v.startsWith('{') && v.endsWith('}');
const aliasTarget = (v) => v.slice(1, -1);

const round = (n) => parseFloat(n.toFixed(4));

/**
 * Valeur CSS d'un token.
 *
 * Un alias devient `var(--cible)` : la chaîne reste vivante en CSS, ce qui est
 * le comportement voulu (un rôle qui pointe vers une rampe s'écrit
 * `var(--ramp-indigo-500)`, pas `#3F2BFF`).
 */
function toCss(token) {
  const { path, type, value } = token;

  if (isAlias(value)) return `var(${cssName(aliasTarget(value))})`;

  if (type === 'color') {
    const { alpha = 1, components } = value;
    if (alpha === 1) return value.hex;
    // Une couleur transparente ne s'écrit pas en hex sans devenir illisible :
    // `#2F2D2E1A` ne dit pas 10 %. Les couleurs d'ombre sont les seules
    // concernées aujourd'hui.
    const [r, g, b] = components.map((c) => Math.round(c * 255));
    return `rgb(${r} ${g} ${b} / ${round(alpha)})`;
  }

  if (type === 'string') {
    if (path.startsWith('fontStack.')) {
      const fallback = FALLBACKS[value];
      return fallback ? `"${value}", ${fallback}` : `"${value}"`;
    }
    return value;
  }

  // type === 'number' — l'unité dépend du groupe.
  if (path.includes('.lineHeight')) return String(value / 100); // Figma stocke en %
  if (path.includes('.letterSpacing')) return `${value / 100}em`; // idem
  if (/\.weight(\.|$)/.test(path) && (path.startsWith('base.text.') || path.startsWith('text.'))) return String(value);
  if (path.startsWith('base.text.size.') || /^text\..+\.size$/.test(path)) return `${round(value / REM)}rem`;
  if (path.startsWith('motion.duration.')) return `${value}ms`; // Figma stocke le nombre nu
  if (path === 'viewport.scale') return String(value);
  if (path.startsWith('ratio.')) return String(value);
  // Figma stocke une opacité en pourcentage, exactement comme un interligne — et
  // pour la même raison : c'est ce que la liaison de variable attend côté dessin.
  // Une variable à 0,5 y vaudrait un demi pour cent. Elle se divise donc ici, et
  // le repli en pixels ci-dessous en aurait fait `50px` : une longueur là où le
  // navigateur attend un rapport, donc une déclaration jetée sans un mot.
  if (path.startsWith('opacity.')) return String(value / 100);
  return `${value}px`; // base.*, border.*, control.*, stack.*, breakpoint.*, nav.*…
}

// --- Lecture -----------------------------------------------------------------

for (const { dir, mode } of SOURCES) {
  const f = join(ROOT, 'tokens', dir, `${mode}.tokens.json`);
  if (!existsSync(f)) {
    throw new Error(`Export manquant : tokens/${dir}/${mode}.tokens.json. Exporte la collection depuis Figma.`);
  }
}

const base = SOURCES.flatMap(({ dir, mode, prefix }) =>
  flatten(read(dir, mode), prefix ? [prefix] : [], [], prefix),
);

const resolved = base.map((t) => ({
  name: cssName(t.path),
  path: t.path,
  group: groupOf(t.path),
  type: t.type,
  css: toCss(t),
  alias: isAlias(t.value) ? cssName(aliasTarget(t.value)) : null,
  description: t.description,
}));

// Deux collections qui écrivent le même nom se marcheraient dessus sans un mot.
const vus = new Map();
for (const t of resolved) {
  if (vus.has(t.name)) throw new Error(`Nom en double dans l'export : ${t.name} (${vus.get(t.name)} et ${t.path}).`);
  vus.set(t.name, t.path);
}

// --- Émission de tokens.css --------------------------------------------------

/**
 * Recompose les ombres à partir de leurs parties.
 *
 * Ajoutée par le build, pas par Figma — comme les polices de repli. Figma n'a
 * pas de type de variable « ombre » : une variable y est couleur, nombre, texte
 * ou booléen. Les parties d'une couche sont donc nommées séparément et liées à
 * l'effet dans le fichier — le dessin et le code lisent la même valeur, et rien
 * ne peut diverger. Il ne reste qu'à les remettre bout à bout, ici.
 *
 * Deux règles du système sont écrites dans cette fonction plutôt que dans une
 * variable, parce que ce sont des règles et non des valeurs :
 *
 *   — aucune ombre n'a de décalage horizontal, d'où le `0` en tête ;
 *   — toute ombre pose la même couche de contact, d'où `shadow.contact`, qui
 *     n'est pas une ombre mais la seconde couche de toutes les autres.
 *
 * Les parties restent émises à côté des composées : c'est ce qui rend une
 * ombre réglable dans Figma sans toucher au code.
 */
function composeShadows(tokens) {
  const layer = (prefix) => {
    const part = (suffix) => tokens.find((t) => t.name === `${prefix}-${suffix}`);
    const [y, blur, spread, color] = ['y', 'blur', 'spread', 'color'].map(part);
    if (!y || !blur || !color) return null; // couche incomplète : on n'invente pas
    return ['0', y, blur, spread, color]
      .filter(Boolean)
      .map((t) => (typeof t === 'string' ? t : `var(${t.name})`))
      .join(' ');
  };

  const contact = layer(cssName('shadow.contact'));

  return [...new Set(tokens.map((t) => t.path.split('.')[1]))]
    .filter((sub) => sub !== 'contact')
    .map((sub) => ({ name: cssName(`shadow.${sub}`), own: layer(cssName(`shadow.${sub}`)) }))
    .filter((s) => s.own)
    .map((s) => ({ name: s.name, css: [s.own, contact].filter(Boolean).join(', ') }));
}

const pad = Math.max(...resolved.map((t) => t.name.length)) + 1;
const declare = (t) => `  ${(t.name + ':').padEnd(pad + 1)} ${t.css};`;

const lines = [
  '/* GÉNÉRÉ — ne pas éditer à la main.',
  ' * Source : tokens/<collection>/*.tokens.json (export de variables Figma, format W3C DTCG).',
  ' * Régénérer avec `npm run tokens`.',
  ' */',
  '',
  ':root {',
];

// Un alias dont la cible n'est pas dans l'export ne s'écrit pas : voir SOURCES.
const cibles = new Set(resolved.map((t) => t.name));
const orphelins = resolved.filter((t) => t.alias && !cibles.has(t.alias));

if (orphelins.length) {
  throw new Error(
    `${orphelins.length} alias pointent vers un token absent de l'export : ` +
      `${orphelins.slice(0, 3).map((t) => `${t.name} → ${t.alias}`).join(', ')}` +
      `${orphelins.length > 3 ? '…' : ''}.\n` +
      `Si la cible est une rampe (--ramp-…), exporte aussi la collection « Primitives » ` +
      `dans tokens/primitives/.`,
  );
}

// GROUP_TITLES décide de ce qui est émis, et pas seulement de l'ordre : un
// groupe qui n'y figure pas serait filtré par la boucle ci-dessous et
// disparaîtrait de tokens.css sans un mot. Un token ajouté dans Figma serait
// alors simplement absent du CSS, et on le chercherait dans le composant qui
// l'utilise. On refuse plutôt de construire.
const inconnus = [...new Set(resolved.map((t) => t.group))].filter((g) => !(g in GROUP_TITLES));

if (inconnus.length) {
  throw new Error(
    `Groupe(s) de tokens inconnu(s) : ${inconnus.join(', ')}.
` +
      `Ajoute-les à GROUP_TITLES dans ce script, sinon ils ne sortiront pas dans tokens.css.`,
  );
}

for (const [group, title] of Object.entries(GROUP_TITLES)) {
  const tokens = resolved.filter((t) => t.group === group);
  if (!tokens.length) continue;
  lines.push('', `  /* ── ${title} ${'─'.repeat(Math.max(3, 72 - title.length))} */`);

  let subgroup;
  for (const token of tokens) {
    const parts = token.path.split('.');
    const current = parts.length > 2 ? parts[1] : '';
    if (subgroup !== undefined && current !== subgroup) lines.push('');
    subgroup = current;
    lines.push(declare(token));
  }

  // Les composées ferment le groupe : on lit les parties, puis ce qu'elles font.
  if (group === 'shadow') {
    const composed = composeShadows(tokens);
    if (composed.length) {
      lines.push('');
      for (const shadow of composed) lines.push(declare(shadow));
    }
  }
}

lines.push('}');

// Les thèmes de couleur ne redéfinissent que ce qui change réellement d'un mode à
// l'autre — la comparaison s'en charge, et c'est elle seule qui décide. Un thème
// s'active en posant `data-theme="prof-hub"` sur <html> ou sur un conteneur.
const themeOverrides = new Map(); // nom CSS → { thème: valeur }
for (const { name, selector } of THEMES) {
  const overrides = flatten(read('semantic', name))
    .map((t) => ({ ...t, name: cssName(t.path) }))
    .filter((t) => {
      const baseToken = resolved.find((r) => r.name === t.name);
      return baseToken && baseToken.css !== toCss(t);
    });

  if (!overrides.length) continue;

  lines.push('', `/* Thème ${name} : les rôles de couleur qui changent. */`, `${selector} {`);
  for (const t of overrides) {
    lines.push(declare({ name: t.name, css: toCss(t) }));
    themeOverrides.set(t.name, { ...(themeOverrides.get(t.name) ?? {}), [name]: toCss(t) });
  }
  lines.push('}');
}

// Les blocs par mode d'appareil ne redéfinissent que ce qui change réellement d'un
// export à l'autre. Aujourd'hui c'est la largeur de référence, l'échelle et la
// hauteur de la barre ; le jour où une variable de Layout porte une valeur par mode,
// elle sort d'ici sans qu'on ait à revenir dans ce script.
for (const { name, query } of MODES) {
  const overrides = flatten(read('layout', name))
    .map((t) => ({ ...t, name: cssName(t.path) }))
    .filter((t) => {
      const baseToken = resolved.find((r) => r.name === t.name);
      return baseToken && baseToken.css !== toCss(t);
    });

  if (!overrides.length) continue;

  lines.push('', `@media ${query} {`, '  :root {');
  for (const t of overrides) lines.push('  ' + declare({ name: t.name, css: toCss(t) }));
  lines.push('  }', '}');
}

// Ajouté par le build, pas par Figma — comme les polices de repli : la
// préférence système n'est pas une valeur de design, c'est une condition.
// Ce sont les tokens eux-mêmes qui s'effondrent, donc tout composant qui les
// utilise respecte la préférence sans avoir à la connaître. Les durées tombent
// à zéro, les courbes restent : on supprime le trajet, pas les états.
const durations = resolved.filter((t) => t.path.startsWith('motion.duration.'));

if (durations.length) {
  lines.push('', '@media (prefers-reduced-motion: reduce) {', '  :root {');
  for (const t of durations) lines.push('  ' + declare({ name: t.name, css: '0ms' }));
  lines.push('  }', '}');
}

writeFileSync(join(ROOT, 'src/design-system/styles/tokens.css'), lines.join('\n') + '\n');

// --- Émission de tokens.json -------------------------------------------------
//
// Alimente la page /design-system/foundations. Les $description Figma portent la doctrine
// d'usage et les ratios de contraste : elles ne doivent pas se perdre ici.

// Lu avant la réécriture ci-dessous : après, le fichier contiendrait déjà les
// nouvelles valeurs et la garde plus bas se comparerait à elle-même.
const PRECEDENT = join(ROOT, 'src/design-system/data/tokens.json');
const avant = existsSync(PRECEDENT)
  ? new Map(JSON.parse(readFileSync(PRECEDENT, 'utf8')).map((t) => [t.path, t.css]))
  : null;

const literal = (name, seen = new Set()) => {
  if (seen.has(name)) return null; // garde-fou contre un cycle d'alias
  const token = resolved.find((t) => t.name === name);
  if (!token) return null;
  return token.alias ? literal(token.alias, seen.add(name)) : token.css;
};

writeFileSync(
  join(ROOT, 'src/design-system/data/tokens.json'),
  JSON.stringify(
    resolved.map((t) => ({
      ...t,
      resolved: t.alias ? literal(t.name) : t.css,
      ...(themeOverrides.has(t.name) ? { themes: themeOverrides.get(t.name) } : {}),
    })),
    null,
    2
  ) + '\n'
);

// --- La garde des deux familles en pourcentage -------------------------------
//
// Les interlignes et les espacements de lettres sont les seules variables que Figma
// **ne sait pas lier** à un style de texte : une variable de type nombre transporte
// le nombre et pas l'unité, et Figma applique alors des pixels. Le pourcentage est
// donc tapé à la main dans chacun des styles, et rien dans Figma ne le rattache à
// la variable.
//
// Conséquence : le code suit tout seul — la division par 100 est faite plus haut —
// mais **les styles du fichier de dessin, non**. Ils gardent leur ancienne valeur
// sans rien dire.
//
// Cette garde ne corrige rien et ne bloque rien : elle parle au seul moment où la
// machine voit passer le changement. C'est le pendant du refus de construire sur un
// groupe inconnu, en plus doux — ici il n'y a rien de cassé, seulement quelque chose
// à aller vérifier ailleurs.
const FAMILLES_EN_POURCENT = ['base.text.lineHeight.', 'base.text.letterSpacing.'];

if (avant) {
  const bouge = resolved.filter(
    (t) =>
      FAMILLES_EN_POURCENT.some((f) => t.path.startsWith(f)) &&
      avant.has(t.path) &&
      avant.get(t.path) !== t.css
  );

  if (bouge.length) {
    console.log('');
    console.log('  ⚠️  ' + bouge.length + (bouge.length > 1 ? ' valeurs ont bougé' : ' valeur a bougé') + ' dans les familles que Figma ne sait pas lier :');
    for (const t of bouge) console.log(`      ${t.path} : ${avant.get(t.path)} → ${t.css}`);
    console.log('');
    console.log("      Le code est à jour. Les styles de texte du fichier Figma, non :");
    console.log('      ils portent le pourcentage à la main, et il vient de diverger.');
    console.log('      → lancer l\'audit de typographie, atelier/verifier-la-typographie.md');
    console.log('');
  }
}

// --- La palette DSFR, à part --------------------------------------------------
//
// Collection Figma « DSFR », exportée seule dans tokens/DSFR.tokens.json. Elle ne
// se mêle ni à tokens.css ni au compte du système : un projet qui garde la palette
// d'origine ne la charge pas, un projet qui adopte celle de l'État importe
// tokens-dsfr.css. Les noms suivent la règle de tout le reste (`color.blue-france.500`
// → `--color-blue-france-500`) ; la description de chaque variable garde le nom DSFR.
const DSFR_SOURCE = join(ROOT, 'tokens', 'DSFR.tokens.json');
let dsfrCount = 0;

if (existsSync(DSFR_SOURCE)) {
  const dsfr = flatten(JSON.parse(readFileSync(DSFR_SOURCE, 'utf8'))).map((t) => ({
    name: cssName(t.path),
    path: t.path,
    group: t.path.split('.')[0],
    type: t.type,
    css: toCss(t),
    description: t.description,
  }));

  // Pas de composant ni d'ombre ici : une palette ne porte que des couleurs, et
  // un nom qui existe déjà dans le système écraserait silencieusement l'un des deux.
  const horsPalette = dsfr.filter((t) => t.type !== 'color');
  const doublons = dsfr.filter((t) => resolved.some((r) => r.name === t.name));
  if (horsPalette.length || doublons.length) {
    throw new Error(
      `tokens/DSFR.tokens.json : ${horsPalette.length} token(s) qui ne sont pas des couleurs, ` +
        `${doublons.length} nom(s) déjà pris par le système` +
        (doublons.length ? ` (${doublons.slice(0, 3).map((t) => t.name).join(', ')}…)` : '') +
        '.',
    );
  }

  const dsfrPad = Math.max(...dsfr.map((t) => t.name.length)) + 1;
  const dsfrLines = [
    '/* GÉNÉRÉ — ne pas éditer à la main.',
    ' * Source : tokens/DSFR.tokens.json (collection Figma « DSFR », palette du',
    ' * Système de design de l’État). Régénérer avec `npm run tokens`.',
    ' * Non chargé par défaut : à importer par les projets qui adoptent cette palette.',
    ' */',
    '',
    ':root {',
  ];
  let famille;
  for (const t of dsfr) {
    const parts = t.path.split('.');
    const courante = parts.slice(1, -1).join('.');
    if (famille !== undefined && courante !== famille) dsfrLines.push('');
    famille = courante;
    dsfrLines.push(`  ${(t.name + ':').padEnd(dsfrPad + 1)} ${t.css};`);
  }
  dsfrLines.push('}');

  writeFileSync(join(ROOT, 'src/design-system/styles/tokens-dsfr.css'), dsfrLines.join('\n') + '\n');
  writeFileSync(
    join(ROOT, 'src/design-system/data/tokens-dsfr.json'),
    JSON.stringify(dsfr, null, 2) + '\n',
  );
  dsfrCount = dsfr.length;
}

const perGroup = Object.keys(GROUP_TITLES)
  .map((g) => `${g} ${resolved.filter((t) => t.group === g).length}`)
  .join(', ');
console.log(
  `${resolved.length} tokens → src/design-system/styles/tokens.css, src/design-system/data/tokens.json`
);
console.log(`  ${perGroup}`);
if (themeOverrides.size) {
  console.log(`  ${themeOverrides.size} rôles de couleur redéfinis par le thème Prof Hub`);
}
if (dsfrCount) {
  console.log(
    `${dsfrCount} couleurs DSFR → src/design-system/styles/tokens-dsfr.css, src/design-system/data/tokens-dsfr.json (hors du compte)`
  );
}
