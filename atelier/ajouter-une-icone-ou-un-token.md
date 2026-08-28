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

**Un groupe de tokens nouveau doit gagner une ligne dans `GROUP_TITLES`.** Le script refuse de
construire tant qu'il ne la trouve pas, et c'est voulu : sans elle, le groupe sortirait de
`tokens.css` sans un mot, et on chercherait la variable manquante dans le composant qui la lit.
L'erreur nomme le groupe — il n'y a rien à chercher, seulement une ligne à écrire. Le groupe `card`
a payé ce détour. Deux pages comptent aussi les groupes qui décrivent un objet plutôt que le
système, chacune dans sa liste écrite à la main : `foundations.astro` et `index.astro`.

**Un groupe nouveau doit aussi gagner son unité dans `toCss()`.** `GROUP_TITLES` décide qu'un
groupe sort ; `toCss()` décide en quoi. Le repli, tout en bas, est le **pixel** — ce qui convient à
`space`, `radius`, `button`, `control` et `border`, et à rien d'autre. Un groupe dont les valeurs ne
sont pas des longueurs sort donc en `…px`, et le navigateur jette la déclaration sans un mot.

**Et une opacité se stocke en pourcentage dans Figma**, comme un interligne : c'est ce que la liaison
de variable attend côté dessin. Une variable `opacity/disabled` créée à `0,5` y vaut **un demi pour
cent** — les onze nœuds désactivés du formulaire sont devenus invisibles avant qu'on le voie. Elle se
crée à `50`, et `toCss()` divise par 100, sur la ligne voisine de celle qui le fait pour
`font/line-height`. Les deux détours ont été payés le 27/08.

**L'export ne se fait pas depuis un outil quelconque.** Le format des quatre `tokens/*.tokens.json`
est celui du plugin d'export Figma — `$extensions` en `com.figma.*`. Un autre exportateur produit
un DTCG voisin mais pas identique, et réécrirait les quatre fichiers en entier pour six lignes.
Vérifier le `git diff` avant de le croire.

**Une icône est un nom, pas un chemin.** `<Button icon="mail-edit">`. Il se vérifie à la
compilation, et un nom faux arrête `npm run check` en listant les valides. Pas d'`<img>`, pas
d'URL, donc pas de `withBase()` — les fichiers ne portent que `currentColor`, et c'est le contexte
qui décide de la couleur.

**Les quatre modes sont lus, mais un seul intégralement.** `Desktop` est le mode de référence ; des
quatre, seuls les tokens du groupe `layout` diffèrent. Ré-exporter les quatre malgré tout : le
script compare.

## Ce qu'il faut regarder après

- `npm run check`, qui refuse un nom d'icône inconnu — **mais lui seul ne suffit pas**. Il est
  passé à 0 erreur sur une page dont il manquait une balise `</section>` ; c'est `npm run build`
  qui l'a arrêtée, et le message nommait la ligne. Les deux se lancent, dans cet ordre.
- La page qui montre ce qui a changé : [/icons](../src/pages/icons.astro) pour la planche,
  [/foundations](../src/pages/foundations.astro) pour le vocabulaire. Les deux se construisent
  depuis les fichiers générés — un token ajouté y apparaît seul, avec sa description Figma.
- Le compte annoncé, qui ne se met jamais à jour tout seul. Pour les **icônes** : `index.astro`
  (deux fois), `LINKS.md`, `CLAUDE.md` — `README.md` n'en cite aucun. Pour les **tokens** :
  `index.astro`, `README.md` (122 en tête, 94 dans le tableau), `LINKS.md`, `CLAUDE.md`, plus les
  21 tokens `button.*` cités en commentaire dans `foundations.astro`. Les pages, elles, comptent
  depuis les fichiers générés : `/icons` et `/foundations` n'ont rien à corriger.
- Le `git diff` des fichiers générés. Il doit être exactement ce qu'on attendait : un diff plus
  large que prévu veut dire qu'un autre export a bougé en même temps.
