# Conventions

Ce que les neuf composants font tous, et qu'aucun outil ne fait respecter : le dépôt n'a ni ESLint,
ni Prettier, ni EditorConfig. `npm run check` type les `.astro`, et c'est tout — la cohérence tient
à la convention seule. D'où ce fichier.

Ce sont des conventions et non des lois : s'en écarter demande une raison, et la raison s'écrit.

## 1. Le pavé doctrinal ouvre le fichier

Avant l'`interface Props`, un commentaire `//` qui dit, dans cet ordre et sans titre ni décoration :
ce que l'objet **est**, ce qu'il **n'est pas** — avec l'objet qu'il faudrait employer à la place —
et son nœud Figma en notation deux-points (`Figma 88:85`), suivi — **s'il y a lieu** — de ce que
le composant Figma déclare et que le code n'implémente pas, avec la raison. Cette dernière ligne
disparaît le jour où l'écart est comblé : le pavé du Tag l'a portée jusqu'à ce que ses variantes
remplies entrent.

C'est la première chose qu'on écrit, avant toute ligne de code : elle décide du reste.
[Tag.astro](../src/design-system/components/Tag.astro) en est le plus court exemple.

## 2. `interface Props` explicite, JSDoc sur ce qui n'est pas évident

Les JSDoc sont recopiées telles quelles dans la colonne « Rôle » des tableaux de la doc. Une seule
définition existe dans le projet : celle du composant.

Quatre habitudes qui reviennent partout :

- `class?: string` et `...rest` étalé sur l'élément racine — c'est à l'appelant de placer l'objet
  dans sa page.
- Tout ce qui porte un titre porte `headingLevel` : le rang se range sous ce que la page porte
  déjà, et il ne change jamais le dessin.
- Une action se décrit `{ label, href? }`. Sans `href`, l'objet rend un `<button>` inerte — c'est
  ce qui permet de le montrer dans la doc sans fabriquer une destination.
- Une icône se **nomme**, elle ne se chemine jamais : le type est `IconName`, et le nom se vérifie
  à la compilation.

## 3. La signature du frontmatter

Destructuration avec valeurs par défaut, `class: className`, `...rest`. Puis la composition :

```ts
const classes = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ');
```

Balise dynamique quand le rendu en dépend : `const Tag = href ? 'a' : 'button'`.

## 4. Aucune valeur en dur dans les styles

Les `<style>` sont scopés et **100 % `var(--*)`**. Une valeur qui n'a pas de token est un écart, pas
une exception : elle se hisse en variable locale nommée d'après l'objet (`--card-shadow`,
`--intro-measure`, `--fold-peek`), elle porte un commentaire qui dit pourquoi, et elle gagne une
ligne dans [arbitrages.md](arbitrages.md).

## 5. La surcharge se fait par variable CSS, pas par variante de plus

`--btn-bg`, `--card-height`, `--intro-gap` : le composant garde la valeur de Figma comme repli et
accepte qu'un contexte la lui reprenne.

Deux pièges déjà payés. Le repli se **lit** sans être **déclaré** sur l'élément — une déclaration
sur `.intro` battrait l'héritage et le point de surcharge ne servirait à rien. Et la variable se
nomme d'après l'objet, jamais d'après la propriété CSS.

L'héritage fait le reste : `--icon-size: var(--btn-icon)` posé sur `.btn` descend jusqu'au `<svg>`.
Le bouton n'a pas à viser l'icône, et l'icône n'a pas à connaître le bouton.

## 6. Aucune connaissance d'un site consommateur

La règle centrale du dépôt, écrite dans [CLAUDE.md](../CLAUDE.md). Liens, page courante, textes,
chemins d'images : tout tombe des props. C'est celle qui se viole le plus facilement sans le voir —
il suffit d'une URL écrite en dur « juste pour la démo ».

## 7. L'accessibilité s'argumente avec son numéro

En commentaire, à l'endroit où la règle est écrite, pas en fin de fichier. Le dépôt cite déjà 2.5.5,
2.5.8, 2.4.11, 2.4.13 et 1.4.3. Un ratio de contraste se mesure et s'écrit ; il ne se suppose pas.

## 8. Pas de script par défaut

Un composant marche entièrement sans JavaScript. Un script ne s'ajoute que si son absence a été
**mesurée** comme un échec, et le commit dit lequel : les deux seuls du dépôt — les flèches du
Carousel, le `inert` de CaseStudyList — portent leur numéro WCAG. Le script constate ce que le CSS
a déjà fait ; il ne déplace rien et ne dessine rien.

## 9. Une variante ne s'intègre que le jour où une vue en a besoin

`Ghost` et `CTA` sur Button : décrits dans Figma, volontairement absents du code. Pas avant. La même
politique vaut pour les procédures de ce dossier.

Il existe un second chemin d'entrée, plus étroit, ouvert par les Tag remplies : quand le point de
surcharge se met à dessiner à la place de la variante absente. Voir
[decisions.md](decisions.md).

## 10. Les écarts se signalent, ils ne se corrigent pas en dur

Une mesure qui ne tombe pas juste, une description Figma périmée, une couleur non liée : le code
suit le nœud et **écrit l'écart** en `<p class="flag">` dans la section de doc, avec le raisonnement
et l'arbitrage retenu. Si l'écart appelle un geste dans Figma, il gagne aussi une ligne dans
[arbitrages.md](arbitrages.md).

Corriger en dur ferait diverger le code et la source sans que rien ne le dise.

## 11. Les commits

Français. Sujet à l'impératif ou en phrase déclarative complète, pas de préfixe conventionnel, pas
de point final. Le sujet dit l'intention ou l'effet, jamais le fichier touché — « La carte, le
carrousel et l'intro acceptent qu'on leur impose leur place ».

Le corps est long et argumenté : ce qui a été fait, pourquoi, **la contrepartie assumée**, et les
écarts restant à trancher avec leur nœud. Un défaut antérieur se commite seul, pour pouvoir être
relu sans le reste. Les fusions sont préfixées « Fusion : » et leur corps récapitule le mouvement.

Trailer systématique :

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```
