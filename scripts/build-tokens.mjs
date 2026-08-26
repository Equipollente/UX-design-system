// Génère src/design-system/styles/tokens.css et src/design-system/data/tokens.json
// depuis l'export de variables Figma (format W3C DTCG) dans tokens/.
//
// La source de vérité est tokens/*.tokens.json — jamais les fichiers générés.
// Pour mettre à jour : ré-exporter depuis Figma dans tokens/, puis `npm run tokens`.
//
// Les 4 modes Figma (Desktop / Tablet / Mobile / Paper) sont identiques à
// l'exception des 3 tokens du groupe layout. On lit donc Desktop pour tout, et
// les trois autres uniquement pour ce groupe.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_MODE = 'Desktop';

// Les media queries viennent des `layout.Device Width` de chaque mode :
// mobile 390, tablet 768, desktop 1200, paper 1060.
const MODES = [
  { name: 'Tablet', query: '(min-width: 768px) and (max-width: 1199px)' },
  { name: 'Mobile', query: '(max-width: 767px)' },
  { name: 'Paper', query: 'print' },
];

// Ajoutées par le build, pas par Figma : les tokens ne portent que le nom de la
// famille. Même approche que folio/Folio-claude-design-system/styles.css.
const FALLBACKS = {
  Poppins: 'system-ui, sans-serif',
  Inter: 'system-ui, -apple-system, sans-serif',
};

// Titres des blocs de tokens.css, dans l'ordre d'émission.
const GROUP_TITLES = {
  color: 'Couleurs',
  space: 'Espacements',
  radius: 'Rayons',
  shadow: 'Ombres — les parties nommées, puis les ombres composées',
  font: 'Typographie',
  motion: 'Mouvement — durées et courbes',
  button: 'Boutons — dimensions et cibles tactiles (WCAG 2.5.5 / 2.5.8 / 2.4.13)',
  nav: 'Nav — la hauteur de la barre, lue par les pages qui se calent dessous',
  layout: 'Layout — métadonnées de mode Figma, informatives',
};

const read = (mode) =>
  JSON.parse(readFileSync(join(ROOT, 'tokens', `${mode}.tokens.json`), 'utf8'));

// `color.bg.default` → `--color-bg-default`. Figma déclare ces noms dans
// $extensions["com.figma.codeSyntax"].WEB pour 88 tokens sur 109 et suit
// exactement cette règle ; on l'applique uniformément pour couvrir aussi les 21
// tokens button.* qui n'ont pas de nom déclaré.
const cssName = (path) =>
  '--' + path.split('.').join('-').replace(/\s+/g, '-').toLowerCase();

/** Aplatit l'arbre DTCG en liste ordonnée de tokens. */
function flatten(node, path = [], out = []) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object') {
      if (value.$type) {
        out.push({
          path: [...path, key].join('.'),
          type: value.$type,
          value: value.$value,
          description: value.$description ?? '',
        });
      } else {
        flatten(value, [...path, key], out);
      }
    }
  }
  return out;
}

const isAlias = (v) => typeof v === 'string' && v.startsWith('{') && v.endsWith('}');
const aliasTarget = (v) => v.slice(1, -1);

/**
 * Valeur CSS d'un token.
 *
 * Un alias devient `var(--cible)` : la chaîne reste vivante en CSS, ce qui est
 * le comportement voulu (`color.text.on-accent` → `color.bg.default` → `#FFFFFF`
 * s'écrit `var(--color-bg-default)`, pas `#FFFFFF`).
 */
function toCss(token) {
  const { path, type, value } = token;

  if (isAlias(value)) return `var(${cssName(aliasTarget(value))})`;

  if (type === 'color') {
    const { alpha = 1, components } = value;
    if (alpha === 1) return value.hex;
    // Une couleur transparente ne s'écrit pas en hex sans devenir illisible :
    // `#2F2D2E1A` ne dit pas 10 %. Les trois couleurs d'ombre sont les seules
    // concernées aujourd'hui, et c'est exactement la forme que les composants
    // portaient en dur avant d'être nommées.
    const [r, g, b] = components.map((c) => Math.round(c * 255));
    return `rgb(${r} ${g} ${b} / ${round(alpha)})`;
  }

  if (type === 'string') {
    if (path.startsWith('font.family.')) {
      const fallback = FALLBACKS[value];
      return fallback ? `"${value}", ${fallback}` : `"${value}"`;
    }
    return value;
  }

  // type === 'number' — l'unité dépend du groupe.
  if (path.startsWith('font.line-height.')) return String(value / 100); // Figma stocke en %
  if (path.startsWith('font.letter-spacing.')) return `${value / 100}em`; // idem
  if (path.startsWith('font.weight.')) return String(value);
  if (path.startsWith('font.size.')) return `${round(value / rootFontSize)}rem`;
  if (path.startsWith('motion.duration.')) return `${value}ms`; // Figma stocke le nombre nu
  if (path === 'layout.Root Font Size') return `${value}px`;
  if (path.startsWith('layout.')) return String(value);
  return `${value}px`; // space.*, radius.*, button.*
}

const round = (n) => parseFloat(n.toFixed(4));

// --- Lecture -----------------------------------------------------------------

const base = flatten(read(BASE_MODE));

// Sert à convertir font.size.* en rem. Déclaré par le système lui-même.
const rootFontSize = base.find((t) => t.path === 'layout.Root Font Size').value;

const resolved = base.map((t) => ({
  name: cssName(t.path),
  path: t.path,
  group: t.path.split('.')[0],
  type: t.type,
  css: toCss(t),
  alias: isAlias(t.value) ? cssName(aliasTarget(t.value)) : null,
  description: t.description,
}));

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
  ` * Source : tokens/${BASE_MODE}.tokens.json (export de variables Figma, format W3C DTCG).`,
  ' * Régénérer avec `npm run tokens`.',
  ' */',
  '',
  ':root {',
];

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

// Les blocs par mode ne redéfinissent que ce qui change réellement d'un export à
// l'autre — la comparaison plus bas s'en charge, et c'est elle seule qui décide.
// Aujourd'hui le groupe layout est le seul à varier, mais la règle ne le nomme
// pas : le jour où une variable Figma porte une valeur par mode — une hauteur de
// barre, par exemple — elle sort d'ici sans qu'on ait à revenir dans ce script.
// Nommer le groupe faisait de ce filtre une deuxième décision, muette, qui
// aurait ignoré la variable sans rien dire.
for (const { name, query } of MODES) {
  const overrides = flatten(read(name))
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

const literal = (name, seen = new Set()) => {
  if (seen.has(name)) return null; // garde-fou contre un cycle d'alias
  const token = resolved.find((t) => t.name === name);
  if (!token) return null;
  return token.alias ? literal(token.alias, seen.add(name)) : token.css;
};

writeFileSync(
  join(ROOT, 'src/design-system/data/tokens.json'),
  JSON.stringify(
    resolved.map((t) => ({ ...t, resolved: t.alias ? literal(t.name) : t.css })),
    null,
    2
  ) + '\n'
);

const perGroup = Object.keys(GROUP_TITLES)
  .map((g) => `${g} ${resolved.filter((t) => t.group === g).length}`)
  .join(', ');
console.log(
  `${resolved.length} tokens → src/design-system/styles/tokens.css, src/design-system/data/tokens.json`
);
console.log(`  ${perGroup}`);
