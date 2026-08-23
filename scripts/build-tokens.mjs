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
  font: 'Typographie',
  motion: 'Mouvement — durées et courbes',
  button: 'Boutons — dimensions et cibles tactiles (WCAG 2.5.5 / 2.5.8 / 2.4.13)',
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

  if (type === 'color') return value.hex;

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
}

lines.push('}');

// Les blocs par mode ne redéfinissent que le groupe layout : c'est le seul qui
// varie entre les 4 exports Figma.
for (const { name, query } of MODES) {
  const overrides = flatten(read(name))
    .filter((t) => t.path.startsWith('layout.'))
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
