# Mettre à jour les tokens depuis Figma

Le chemin complet, de la variable changée dans Figma jusqu'à la page qui l'affiche. Quatre étapes,
et aucune ne demande de savoir coder.

> La procédure voisine, [ajouter-une-icone-ou-un-token.md](ajouter-une-icone-ou-un-token.md), dit
> **ce qui se passe** et quels pièges coûtent du temps. Ce fichier-ci dit **ce qu'on fait**, dans
> l'ordre.

## 1. Changer la variable dans Figma

C'est la seule source. Une valeur qui paraît fausse se corrige ici, jamais dans le code.

## 2. Exporter les quatre modes

Le plugin d'export, les quatre modes : Desktop, Tablet, Mobile, Paper. Ré-exporter **les quatre**
même si un seul a bougé — le script les compare entre eux pour savoir ce qui varie par appareil.

⚠️ **Toujours le même plugin.** Le format attendu porte `com.figma.variableId` dans le fichier.
Un autre exportateur produit un format voisin mais pas identique, et réécrit les quatre fichiers en
entier pour six lignes changées.

## 3. Déposer les fichiers dans le dépôt

Dans `tokens/`, en écrasant les anciens :

```
C:\Users\judit\Documents\Claude\Projects\UX-design-system\tokens\
```

Les noms doivent rester exactement ceux-là :

```
Desktop.tokens.json
Tablet.tokens.json
Mobile.tokens.json
Paper.tokens.json
```

## 4. Lancer la conversion

Dans un terminal ouvert sur le dossier du projet :

```bash
npm run tokens
```

C'est tout. Le script écrit `styles/tokens.css` et `data/tokens.json`, que tous les composants lisent.

## Comment savoir que ça a marché

**Le compte, qu'il affiche à la fin.** C'est le contrôle le plus simple, et il suffit :

```
144 tokens → src/design-system/styles/tokens.css, src/design-system/data/tokens.json
  color 43, space 10, radius 4, control 3, border 2, opacity 1, shadow 16, font 27, ...
```

| Ce que tu lis | Ce que ça veut dire |
|---|---|
| le compte attendu | rien n'a été perdu — c'est bon |
| **moins** que prévu | il manque des variables dans l'export : recommencer l'étape 2 |
| **plus** que prévu | normal si tu viens d'en créer ; suspect sinon |

**Et pour le voir à l'écran :**

```bash
npm run dev
```

Puis la page [Fondations](http://localhost:4321/UX-design-system/foundations), qui affiche les tokens
en lisant les vraies variables — s'ils y sont, ils sont arrivés.

## Ce que le script peut te dire

**« Groupe(s) de tokens inconnu(s) »** — et il refuse de construire. C'est voulu : tu as créé une
famille dont le script ignore le nom, et sans cette ligne elle sortirait du CSS sans un mot. L'erreur
nomme le groupe ; il n'y a rien à chercher, seulement une ligne à faire ajouter au script.

**« ⚠️ n valeurs ont bougé dans les familles que Figma ne sait pas lier »** — rien n'est cassé, le
code est à jour. Mais un interligne ou un interlettrage a changé, et les **styles de texte du fichier
Figma ne suivent pas tout seuls**. Voir [verifier-la-typographie.md](verifier-la-typographie.md).

## Ce qui ne voyage pas

L'export ne transporte **que les variables**. Tout le reste du fichier Figma reste sur place :

| Ce qui ne part pas | Conséquence |
|---|---|
| Les **styles d'effet** — les quatre ombres | le style lui-même ne part pas ; ce sont ses **morceaux** qui voyagent, une fois nommés en variables et liés à la couche. C'est ce qui a été fait le 27/08 : décalage, flou, étendue et couleur pour chaque couche, et `npm run tokens` les remet bout à bout |
| Les **styles de texte** | leur interligne et leur interlettrage sont tapés à la main, et ne peuvent pas être liés — voir [verifier-la-typographie.md](verifier-la-typographie.md) |
| Les **composants et leurs mesures** | elles se lisent au cas par cas, quand on intègre |

C'est la même règle à chaque fois : **si ce n'est pas une variable, ça ne sort pas de Figma.** Quand
une propriété n'a pas de type de variable — une ombre, par exemple — la parade est toujours la même :
nommer ses morceaux, les lier au dessin, et laisser le script les recomposer. Le dessin et le code
lisent alors la même valeur, et plus rien ne peut diverger.

## Après

Les deux fichiers générés sont **versionnés** — `npm run dev` ne relance pas la conversion, et un
clone frais serait cassé sans eux. Ils font donc partie du commit.

Un dernier coup d'œil avant de le faire :

```bash
git diff --stat tokens/
```

Quelques dizaines de lignes par fichier : c'est bon. Des milliers, sur les quatre : c'est l'autre
exportateur, et il faut s'arrêter là.

Le compte annoncé à la main dans `README.md`, `LINKS.md`, `CLAUDE.md` et la description de
`index.astro` ne se met jamais à jour tout seul. Les pages, elles, comptent depuis les fichiers
générés et n'ont rien à corriger.
