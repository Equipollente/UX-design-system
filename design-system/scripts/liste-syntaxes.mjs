// Liste la syntaxe code (`com.figma.codeSyntax.WEB`) de chaque token d'un export Figma.
//
// Ne modifie rien : il lit, il affiche. C'est le coup d'œil à jeter sur un export avant
// de faire confiance à ce champ — quels tokens ont une syntaxe, lesquels n'en ont pas,
// et lesquelles s'écartent du nom que `build-tokens.mjs` écrirait de lui-même.
//
//   node scripts/liste-syntaxes.mjs                 lit tokens/
//   node scripts/liste-syntaxes.mjs atelier         lit les .zip et .tokens.json d'atelier/
//   node scripts/liste-syntaxes.mjs atelier --resume    seulement le bilan et les écarts
//
// Un dossier, ou un zip, est une collection ; un fichier, un mode. Une collection
// exportée sur plusieurs modes (Semantic, Layout) n'est listée qu'une fois : la syntaxe
// appartient à la variable, pas au mode — si deux modes la disent différemment, c'est
// signalé.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const resume = args.includes('--resume');
const cible = resolve(ROOT, args.find((a) => !a.startsWith('--')) ?? 'tokens');

if (!existsSync(cible)) {
  console.error(`Introuvable : ${cible}`);
  process.exit(1);
}

// --- Lecture d'un zip, en mémoire, sans rien écrire sur le disque --------------

/** Les fichiers `*.tokens.json` d'un zip : [{ nom, texte }]. */
function lireZip(fichier) {
  const buf = readFileSync(fichier);

  // La fin du zip : la signature de « End of central directory », cherchée en remontant.
  let fin = buf.length - 22;
  while (fin >= 0 && buf.readUInt32LE(fin) !== 0x06054b50) fin--;
  if (fin < 0) throw new Error(`${basename(fichier)} : ce n'est pas un zip lisible.`);

  const nombre = buf.readUInt16LE(fin + 10);
  let p = buf.readUInt32LE(fin + 16);
  const sortie = [];

  for (let i = 0; i < nombre; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error(`${basename(fichier)} : annuaire du zip corrompu.`);
    const methode = buf.readUInt16LE(p + 10);
    const taille = buf.readUInt32LE(p + 20);
    const nomLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const noteLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const nom = buf.toString('utf8', p + 46, p + 46 + nomLen);
    p += 46 + nomLen + extraLen + noteLen;

    if (!nom.endsWith('.tokens.json')) continue;

    const debut = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const brut = buf.subarray(debut, debut + taille);
    const donnees = methode === 0 ? brut : methode === 8 ? inflateRawSync(brut) : null;
    if (!donnees) throw new Error(`${basename(fichier)} : ${nom} est compressé d'une façon que ce script ne lit pas.`);
    sortie.push({ nom: basename(nom), texte: donnees.toString('utf8') });
  }
  return sortie;
}

// --- Rassembler les fichiers : [{ collection, mode, json }] --------------------

const fichiers = [];
const ajouter = (collection, nom, texte) =>
  fichiers.push({ collection, mode: nom.replace(/\.tokens\.json$/, ''), json: JSON.parse(texte) });

function parcourir(dossier, collection) {
  for (const entree of readdirSync(dossier).sort()) {
    const chemin = join(dossier, entree);
    if (statSync(chemin).isDirectory()) {
      parcourir(chemin, entree);
    } else if (entree.endsWith('.zip')) {
      for (const { nom, texte } of lireZip(chemin)) ajouter(basename(entree, '.zip'), nom, texte);
    } else if (entree.endsWith('.tokens.json')) {
      ajouter(collection ?? '(racine)', entree, readFileSync(chemin, 'utf8'));
    }
  }
}

if (statSync(cible).isDirectory()) parcourir(cible);
else if (cible.endsWith('.zip')) for (const { nom, texte } of lireZip(cible)) ajouter(basename(cible, '.zip'), nom, texte);
else ajouter(basename(dirname(cible)), basename(cible), readFileSync(cible, 'utf8'));

if (!fichiers.length) {
  console.error(`Aucun *.tokens.json, ni zip qui en contienne, dans ${cible}`);
  process.exit(1);
}

// --- Aplatir ------------------------------------------------------------------

/** Les tokens d'un arbre DTCG : [{ chemin, syntaxe }]. Même parcours que build-tokens.mjs. */
function aplatir(noeud, chemin = [], sortie = []) {
  for (const [cle, valeur] of Object.entries(noeud)) {
    if (cle === '$root' && valeur?.$type) {
      sortie.push({ chemin: chemin.join('/'), syntaxe: valeur.$extensions?.['com.figma.codeSyntax']?.WEB });
      continue;
    }
    if (cle.startsWith('$') || !valeur || typeof valeur !== 'object') continue;
    if (valeur.$type) {
      sortie.push({ chemin: [...chemin, cle].join('/'), syntaxe: valeur.$extensions?.['com.figma.codeSyntax']?.WEB });
    } else {
      aplatir(valeur, [...chemin, cle], sortie);
    }
  }
  return sortie;
}

// Le nom que build-tokens.mjs écrirait : mêmes règles, recopiées — ce fichier ne doit
// pas importer le build, qui écrit des fichiers dès qu'on le charge. Motion est la seule
// collection à préfixe : `duration/quick` y devient `--motion-duration-quick`.
const nomDuBuild = (collection, chemin) =>
  '--' +
  [...(/motion/i.test(collection) ? ['motion'] : []), ...chemin.split('/')]
    .join('-')
    .replace(/\s+/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

// --- Un token = une ligne, tous modes confondus --------------------------------

const lignes = new Map(); // `${collection}\t${chemin}` → { collection, chemin, syntaxes: Set }
for (const { collection, json } of fichiers) {
  for (const { chemin, syntaxe } of aplatir(json)) {
    const cle = `${collection}\t${chemin}`;
    if (!lignes.has(cle)) lignes.set(cle, { collection, chemin, syntaxes: new Set() });
    lignes.get(cle).syntaxes.add(syntaxe ?? null);
  }
}

const sans = [];
const ecarts = [];
const modesEnDesaccord = [];
const parSyntaxe = new Map();
const parCollection = new Map();

for (const l of lignes.values()) {
  const vues = [...l.syntaxes];
  const syntaxe = vues.find((s) => s) ?? null;
  const stats = parCollection.get(l.collection) ?? { total: 0, avec: 0 };
  stats.total++;
  if (syntaxe) stats.avec++;
  parCollection.set(l.collection, stats);

  if (vues.length > 1) modesEnDesaccord.push({ ...l, vues });
  if (!syntaxe) {
    sans.push(l);
    continue;
  }
  const nom = syntaxe.match(/^var\((--[^)]+)\)$/)?.[1];
  const attendu = nomDuBuild(l.collection, l.chemin);
  if (nom !== attendu) ecarts.push({ ...l, syntaxe, attendu });
  parSyntaxe.set(syntaxe, [...(parSyntaxe.get(syntaxe) ?? []), `${l.collection}/${l.chemin}`]);
}

const doublons = [...parSyntaxe].filter(([, v]) => v.length > 1);

// --- Affichage ----------------------------------------------------------------

if (!resume) {
  let derniere = '';
  for (const l of lignes.values()) {
    if (l.collection !== derniere) console.log(`\n# ${(derniere = l.collection)}`);
    console.log(`${l.chemin.padEnd(52)} ${[...l.syntaxes].find((s) => s) ?? '— aucune —'}`);
  }
  console.log('');
}

console.log(`Lu : ${cible}`);
for (const [c, { total, avec }] of parCollection) console.log(`  ${c.padEnd(16)} ${avec}/${total} avec syntaxe`);

const section = (titre, liste, ligne) => {
  if (!liste.length) return;
  console.log(`\n${titre} (${liste.length})`);
  for (const x of liste.slice(0, 25)) console.log(`  ${ligne(x)}`);
  if (liste.length > 25) console.log(`  … et ${liste.length - 25} autres`);
};

section('Sans syntaxe', sans, (l) => `${l.collection}/${l.chemin}`);
section('Syntaxe ≠ nom que le build écrirait', ecarts, (l) => `${l.collection}/${l.chemin} : ${l.syntaxe}  (build : ${l.attendu})`);
section('Même syntaxe sur plusieurs tokens', doublons, ([s, v]) => `${s} ← ${v.join(', ')}`);
section('Modes en désaccord', modesEnDesaccord, (l) => `${l.collection}/${l.chemin} : ${l.vues.map((v) => v ?? 'aucune').join(' | ')}`);

if (!sans.length && !ecarts.length && !doublons.length && !modesEnDesaccord.length) {
  console.log('\nRien à signaler : toutes les syntaxes sont présentes et égales au nom du build.');
}
