# Ajouter une icône ou un token

Les deux suivent le même contrat, et c'est pour ça qu'ils sont dans le même fichier.

> **La source est Figma.** Le fichier de `src/design-system/` est **généré** : il ne se retouche
> jamais, il se régénère. Une valeur qui paraît fausse se corrige dans Figma, puis se ré-exporte.

Les procédures détaillées existent déjà et ne sont pas recopiées ici. Ce fichier dit où elles sont
et quels pièges coûtent du temps.

| | Icônes | Tokens |
|---|---|---|
| Source Figma | page `Icons` (`45:395`) | collection *Design tokens*, 4 modes |
| Export vers | `icons/` | `tokens/*.tokens.json` |
| Commande | `npm run icons` | `npm run tokens` |
| Produit | `src/design-system/icons/*.svg` et `lib/icons.ts` | `styles/tokens.css` et `data/tokens.json` |
| Script | [build-icons.mjs](../scripts/build-icons.mjs) | [build-tokens.mjs](../scripts/build-tokens.mjs) |
| Procédure écrite | section « Ajouter une icône » d'[icons.astro](../src/pages/icons.astro) | [CLAUDE.md](../CLAUDE.md) et [README.md](../README.md) |

## Les pièges

**L'export d'une icône se fait au niveau du composant, pas du vecteur.** Sinon la `viewBox` n'est
pas celle de la frame 24 × 24 et le script refuse le fichier — c'est voulu. Les premiers exports du
dépôt venaient du vecteur : leurs dimensions bâtardes (17,8 × 13,8) étaient étirées jusqu'à 24, soit
35 % plus grand que le dessin.

**`npm run dev` ne relance ni `tokens` ni `icons`.** Seul `npm run build` les enchaîne. C'est pour
ça que les quatre fichiers générés sont **versionnés** : sans eux, un clone frais serait cassé.
Après un ré-export, lancer la commande à la main.

**Une icône est un nom, pas un chemin.** `<Button icon="mail-edit">`. Il se vérifie à la
compilation, et un nom faux arrête `npm run check` en listant les valides. Pas d'`<img>`, pas
d'URL, donc pas de `withBase()` — les fichiers ne portent que `currentColor`, et c'est le contexte
qui décide de la couleur.

**Les quatre modes sont lus, mais un seul intégralement.** `Desktop` est le mode de référence ; des
quatre, seuls les tokens du groupe `layout` diffèrent. Ré-exporter les quatre malgré tout : le
script compare.

## Ce qu'il faut regarder après

- `npm run check`, qui refuse un nom d'icône inconnu.
- La page qui montre ce qui a changé : [/icons](../src/pages/icons.astro) pour la planche,
  [/foundations](../src/pages/foundations.astro) pour le vocabulaire. Les deux se construisent
  depuis les fichiers générés — un token ajouté y apparaît seul, avec sa description Figma.
- Le compte annoncé : `index.astro` et `README.md` citent des **nombres** de tokens et d'icônes.
- Le `git diff` des fichiers générés. Il doit être exactement ce qu'on attendait : un diff plus
  large que prévu veut dire qu'un autre export a bougé en même temps.
