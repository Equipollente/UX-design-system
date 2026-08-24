// Fait de icons/ — les exports bruts de la page Figma « Icons » (45:395) — les deux
// fichiers que le système consomme réellement :
//
//   src/design-system/icons/<slug>.svg   nettoyés, prêts à être inlinés par Astro
//   src/design-system/lib/icons.ts       le registre typé qui les nomme
//
// Même contrat que build-tokens.mjs : la source de vérité est Figma, on ne retouche
// pas une sortie à la main, et les deux sorties sont versionnées parce que
// `npm run dev` ne relance pas la génération.
//
// Le nettoyage n'est pas cosmétique. C'est lui qui rend `currentColor` systématique —
// l'oublier sur une seule icône ramènerait le défaut qu'on vient de supprimer : une
// icône qui ne sait pas changer de couleur, donc un second fichier pour le même
// dessin dès qu'un fond change.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'icons';
const OUT_SVG = 'src/design-system/icons';
const OUT_TS = 'src/design-system/lib/icons.ts';

/** La frame des composants Figma. Tout ce qui s'en écarte est un export du vecteur. */
const VIEWBOX = '0 0 24 24';

/**
 * Le nom Figma en slug : minuscules, et toute suite de caractères non alphanumériques
 * réduite à un seul tiret. « File - Text » → file-text, « Mail-Edit » → mail-edit.
 */
const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Le slug en identifiant JS pour la ligne d'import : arrow-narrow-down → arrowNarrowDown. */
const identifier = (slug) => slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

// Nombre d'arguments attendu par commande de tracé. Sert à repérer un `d` tronqué —
// un export interrompu ou une transcription fautive laisse une commande incomplète.
const ARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };

/**
 * Vérifie qu'un attribut `d` est bien formé. On ne cherche pas à valider le dessin,
 * seulement à ce qu'aucune commande ne soit amputée de ses arguments.
 */
function checkPath(d, where) {
  const chunks = d.match(/[a-zA-Z][^a-zA-Z]*/g) ?? [];
  if (chunks.length === 0) throw new Error(`${where} : attribut d vide ou illisible`);

  for (const chunk of chunks) {
    const cmd = chunk[0];
    const expected = ARGS[cmd.toLowerCase()];
    if (expected === undefined) throw new Error(`${where} : commande de tracé inconnue « ${cmd} »`);

    const nums = chunk.slice(1).match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
    if (expected === 0) {
      if (nums.length > 0) throw new Error(`${where} : « ${cmd} » ne prend pas d'argument`);
      continue;
    }
    if (nums.length === 0 || nums.length % expected !== 0) {
      throw new Error(
        `${where} : « ${cmd} » attend un multiple de ${expected} arguments, ${nums.length} trouvés — tracé tronqué ?`,
      );
    }
  }
}

/**
 * Nettoie un export Figma :
 * - la racine perd width, height et xmlns (Astro pose les siens, et la taille est
 *   décidée par le CSS, pas par le fichier) ;
 * - toute couleur littérale devient currentColor, sur fill comme sur stroke ;
 * - les id disparaissent — Figma les nomme tous « Icon », et inliner deux fois la
 *   même icône dupliquerait l'identifiant dans le document.
 */
function clean(svg, where) {
  const root = svg.match(/<svg\b[^>]*>/);
  if (!root) throw new Error(`${where} : pas d'élément <svg>`);

  const viewBox = root[0].match(/viewBox="([^"]+)"/)?.[1];
  if (viewBox !== VIEWBOX) {
    throw new Error(
      `${where} : viewBox « ${viewBox ?? 'absente'} » au lieu de « ${VIEWBOX} » — ` +
        `l'export vient du vecteur et non de la frame du composant.`,
    );
  }

  for (const [, d] of svg.matchAll(/\sd="([^"]+)"/g)) checkPath(d, where);

  let out = svg
    .replace(/<svg\b[^>]*>/, (tag) =>
      tag
        .replace(/\s(?:width|height|xmlns|xmlns:xlink|version)="[^"]*"/g, '')
        .replace(/\s+/g, ' '),
    )
    .replace(/\sid="[^"]*"/g, '')
    .replace(/(fill|stroke)="(?!none|currentColor)[^"]*"/g, '$1="currentColor"')
    .trim();

  if (!/currentColor/.test(out)) throw new Error(`${where} : aucune couleur à reprendre du contexte`);
  if (/#[0-9a-f]{3,8}\b/i.test(out)) throw new Error(`${where} : une couleur littérale subsiste`);

  return out + '\n';
}

const files = readdirSync(SRC)
  .filter((f) => f.endsWith('.svg'))
  .sort();

if (files.length === 0) throw new Error(`Aucun SVG dans ${SRC}/`);

const icons = [];
for (const file of files) {
  const figmaName = file.replace(/\.svg$/, '');
  const slug = slugify(figmaName);
  const clash = icons.find((i) => i.slug === slug);
  if (clash) throw new Error(`Deux noms Figma donnent le même slug « ${slug} » : ${clash.figmaName}, ${figmaName}`);
  icons.push({ figmaName, slug, svg: clean(readFileSync(join(SRC, file), 'utf8'), figmaName) });
}

// L'ordre du registre est celui des slugs, pas celui des noms Figma : c'est le nom
// public qui range la planche de /icons.
icons.sort((a, b) => a.slug.localeCompare(b.slug));

rmSync(OUT_SVG, { recursive: true, force: true });
mkdirSync(OUT_SVG, { recursive: true });
for (const { slug, svg } of icons) writeFileSync(join(OUT_SVG, `${slug}.svg`), svg);

const registry = `// Généré par scripts/build-icons.mjs depuis icons/. Ne pas éditer à la main.
//
// Le registre est ce qui fait d'une icône un objet nommé du système plutôt qu'un
// chemin de fichier : \`icon="mail-edit"\` se vérifie à la compilation, \`icon="/icons/mail-edit.svg"\`
// ne se vérifiait qu'en production, sur un 404.

${icons.map(({ slug }) => `import ${identifier(slug)} from '../icons/${slug}.svg';`).join('\n')}

export const icons = {
${icons.map(({ slug }) => `  '${slug}': ${identifier(slug)},`).join('\n')}
} as const;

/** Les noms qu'un appelant a le droit d'écrire. */
export type IconName = keyof typeof icons;

/** L'ordre du registre, pour la planche de /icons : aucune liste tenue en double. */
export const iconNames = Object.keys(icons) as IconName[];
`;

writeFileSync(OUT_TS, registry);

console.log(`${icons.length} icônes → ${OUT_SVG}/ et ${OUT_TS}`);
console.log(icons.map((i) => `  ${i.slug}${i.slug === i.figmaName ? '' : `  ← « ${i.figmaName} »`}`).join('\n'));
