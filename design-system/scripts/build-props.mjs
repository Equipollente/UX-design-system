// Lit les réglages (`Props`) de chaque composant et en fait src/data/components.json,
// que la doc affiche : le tableau des props n'est jamais écrit à la main.
//
// Ce que le script lit, dans l'ordre :
//   1. le script du composant (entre les deux `---` de son .astro) : `interface Props`,
//      ou `type Props = Nom` avec Nom importé d'un fichier .ts voisin (lib/input.ts) ;
//   2. les commentaires JSDoc de chaque prop : la phrase, `@default`, `@example` (la valeur
//      d'essai du playground), `@since`,
//      `@deprecated`, `@experimental` ; celui du composant donne son statut ;
//   3. le modèle, pour les slots (`<slot />`, `<slot name="x" />`).
//
// Un statut et une version sont lus dans le code, jamais écrits dans la doc : voir
// docs de convention, § 6 bis. Aucun générateur n'existe pour les fichiers .astro ;
// celui-ci passe par le compilateur TypeScript, qu'Astro installe déjà.
//
// Un composant dont les props ne se lisent pas (aucun `Props`, ou un type que ce script
// ne sait pas suivre) est listé en fin d'exécution, pas passé sous silence.

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS = join(ROOT, 'src/components');
const OUT = join(ROOT, 'src/data/components.json');

// --- Lire un fichier TypeScript ------------------------------------------------

const parse = (texte, nom = 'x.ts') => ts.createSourceFile(nom, texte, ts.ScriptTarget.Latest, true);

/** Le texte d'un commentaire JSDoc (une chaîne, ou une liste de morceaux si un lien s'y trouve). */
const commentaire = (noeud) => {
  const doc = noeud.jsDoc?.at(-1);
  if (!doc) return '';
  return (ts.getTextOfJSDocComment(doc.comment) ?? '').trim();
};

/** Les étiquettes JSDoc d'un nœud : { default, since, deprecated, experimental }. */
const etiquettes = (noeud) => {
  const out = {};
  for (const tag of ts.getJSDocTags(noeud)) {
    const nom = tag.tagName.text;
    const texte = (ts.getTextOfJSDocComment(tag.comment) ?? '').trim();
    if (nom === 'default') out.default = texte.replace(/^['"`]|['"`]$/g, '');
    else if (nom === 'example') out.exemple = texte.replace(/^['"`]|['"`]$/g, '');
    else if (nom === 'since') out.since = texte;
    else if (nom === 'deprecated') out.deprecated = texte || true;
    else if (nom === 'experimental') out.experimental = true;
  }
  return out;
};

/** Une déclaration (interface ou alias) de ce nom, dans ce fichier. */
const trouver = (sf, nom) =>
  sf.statements.find(
    (s) => (ts.isInterfaceDeclaration(s) || ts.isTypeAliasDeclaration(s)) && s.name.text === nom,
  );

/** L'import d'un nom : le chemin du fichier .ts qui l'exporte, ou null. */
const importDe = (sf, nom, dossier) => {
  for (const s of sf.statements) {
    if (!ts.isImportDeclaration(s) || !s.importClause?.namedBindings || !ts.isNamedImports(s.importClause.namedBindings)) continue;
    const trouve = s.importClause.namedBindings.elements.some((e) => e.name.text === nom);
    const spec = s.moduleSpecifier.text;
    if (trouve && spec.startsWith('.')) {
      for (const ext of ['', '.ts', '/index.ts']) {
        const chemin = join(dossier, spec + ext);
        if (existsSync(chemin) && !/\.(?:astro|svg)$/.test(chemin) && ext !== '') return chemin;
        if (ext === '' && /\.ts$/.test(chemin) && existsSync(chemin)) return chemin;
      }
    }
  }
  return null;
};

/** Les attributs natifs qu'une interface hérite : `Omit<HTMLAttributes<'input'>, 'type' | 'size'>`. */
function natifs(sf, interf) {
  const out = { balise: null, ecartes: [] };
  for (const h of interf.heritageClauses ?? []) {
    for (const t of h.types) {
      const decl = ts.isIdentifier(t.expression) ? trouver(sf, t.expression.text) : null;
      const texte = (decl && ts.isTypeAliasDeclaration(decl) ? decl.type : t).getText(sf);
      const balise = texte.match(/HTMLAttributes<\s*['"]([a-z0-9]+)['"]\s*>/);
      if (!balise) continue;
      out.balise = balise[1];
      const omis = texte.match(/Omit<[^,]+,\s*([^>]+)>/);
      if (omis) out.ecartes = [...omis[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
    }
  }
  return out;
}

/** Un type sur une ligne : les retours à la ligne d'une union longue n'ont pas leur place dans une cellule. */
const uneLigne = (texte) => texte.replace(/\s+/g, ' ').replace(/^\|\s*/, '').trim();

/** Le type d'une prop, et ses valeurs quand il est une liste de mots (`'a' | 'b'`), alias suivi. */
function typeDe(sf, noeud) {
  if (!noeud) return { type: 'unknown' };
  let n = noeud;
  if (ts.isTypeReferenceNode(n)) {
    const alias = trouver(sf, n.typeName.getText(sf));
    if (alias && ts.isTypeAliasDeclaration(alias)) n = alias.type;
  }
  const membres = ts.isUnionTypeNode(n) ? n.types : [n];
  const valeurs = membres.every((x) => ts.isLiteralTypeNode(x) && ts.isStringLiteral(x.literal))
    ? membres.map((x) => x.literal.text)
    : null;
  return { type: uneLigne(n.getText(sf)), ...(valeurs ? { valeurs } : {}) };
}

/** Les props d'une interface : un objet par membre. */
const proprietes = (sf, interf) =>
  interf.members.filter(ts.isPropertySignature).map((m) => ({
    nom: m.name.getText(sf),
    ...typeDe(sf, m.type),
    requis: !m.questionToken,
    description: commentaire(m),
    ...etiquettes(m),
  }));

// --- Lire un composant ---------------------------------------------------------

const frontmatter = (src) => src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';

/** Les pièces que le composant emprunte : les composants .astro qu'il importe (pas les types). */
function pieces(sf) {
  const noms = [];
  for (const s of sf.statements) {
    if (!ts.isImportDeclaration(s) || s.importClause?.isTypeOnly) continue;
    if (!s.moduleSpecifier.text.endsWith('.astro') || !s.importClause?.name) continue;
    noms.push(s.importClause.name.text);
  }
  return noms;
}

/** Les slots du modèle : { nom, } — `default` pour `<slot />`. */
function slots(src) {
  const modele = src.replace(/^---[\s\S]*?\n---/, '').replace(/<!--[\s\S]*?-->/g, '');
  const noms = new Set();
  for (const m of modele.matchAll(/<slot\b([^>]*)>/g)) {
    noms.add(m[1].match(/name=["']([^"']+)["']/)?.[1] ?? 'default');
  }
  return [...noms];
}

function lire(fichier) {
  const src = readFileSync(fichier, 'utf8');
  const sf = parse(frontmatter(src), 'frontmatter.ts');
  let decl = trouver(sf, 'Props');
  if (!decl) return { erreur: 'aucun `Props`' };

  let source = sf;
  let dossier = dirname(fichier);

  // `type Props = InputProps;` : on suit l'import vers le fichier qui porte l'interface.
  if (ts.isTypeAliasDeclaration(decl)) {
    const cible = ts.isTypeReferenceNode(decl.type) ? decl.type.typeName.getText(sf) : null;
    const chemin = cible && importDe(sf, cible, dossier);
    if (!chemin) return { erreur: `\`type Props = ${decl.type.getText(sf)}\` : type que le script ne sait pas suivre` };
    source = parse(readFileSync(chemin, 'utf8'), chemin);
    decl = trouver(source, cible);
    if (!decl || !ts.isInterfaceDeclaration(decl)) return { erreur: `${cible} n'est pas une interface dans ${basename(chemin)}` };
    dossier = dirname(chemin);
  }

  return {
    description: commentaire(decl),
    ...etiquettes(decl),
    natifs: natifs(source, decl),
    props: proprietes(source, decl),
    slots: slots(src),
    utilise: pieces(parse(frontmatter(src), 'frontmatter.ts')),
  };
}

// --- Tous les composants -------------------------------------------------------

const resultat = {};
const illisibles = [];
for (const f of readdirSync(COMPONENTS).filter((n) => n.endsWith('.astro')).sort()) {
  const nom = f.replace(/\.astro$/, '');
  const lu = lire(join(COMPONENTS, f));
  if (lu.erreur) illisibles.push(`${nom} : ${lu.erreur}`);
  else resultat[nom] = { source: `design-system/src/components/${f}`, ...lu };
}

writeFileSync(OUT, JSON.stringify(resultat, null, 2) + '\n');

const avecProps = Object.entries(resultat).filter(([, c]) => c.props.length);
console.log(`${Object.keys(resultat).length} composants lus → src/data/components.json`);
console.log(`  ${avecProps.length} avec des props : ${avecProps.map(([n, c]) => `${n} ${c.props.length}`).join(', ')}`);
if (illisibles.length) {
  console.log(`\n${illisibles.length} composant(s) dont les props ne se lisent pas :`);
  for (const i of illisibles) console.log(`  ${i}`);
}
