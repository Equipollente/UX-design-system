# Décisions

Les arbitrages **encore en vigueur**, distillés des commits. Ce n'est pas une chronologie : il n'y
a pas de journal ici, `git log` le tient déjà et le tient mieux. Ce fichier répond à une seule
question — *pourquoi c'est fait comme ça ?* — et ne grossit que quand une décision change.

Chaque entrée porte sa trace. Le raisonnement complet est dans le commit : `git show <hash>`.

---

## Le dépôt ne porte que le système

Le portfolio est parti dans un dossier voisin, hors dépôt. **Aucun fichier d'ici ne doit connaître
un site consommateur** : ce qui est propre à une page se passe en props. La règle de dépendance à
sens unique avait été tenue — l'extraction n'a demandé aucune modification de composant, ce qui l'a
prouvée.

`← f1378ea`

## La surface publique est close, et `public/` n'en est pas

Une carte `exports` décide ce qu'un site a le droit d'importer — composants, layouts, lib, styles,
tokens — plutôt que de laisser toute l'arborescence atteignable. `files` exclut `public/` : les
icônes et les images sont le choix du site qui les monte.

`← a741c46`, [package.json](../package.json)

## Astro est en `devDependencies`, pas en `dependencies`

Un site qui installe le système n'a pas à se retrouver avec un second Astro dans son
`node_modules` — deux instances, deux compilateurs, des symptômes obscurs. La version attendue est
déclarée en `peerDependencies` ; le dépôt garde Astro en `devDependencies` pour construire sa
propre doc.

`← fcd36d1`

## Les fichiers générés sont versionnés

`npm run dev` ne relance ni `tokens` ni `icons`. Sans les quatre sorties dans le dépôt, un clone
frais serait cassé. C'est aussi ce que le build CI vérifie : il tourne sur un clone frais et échoue
si un fichier nécessaire au site est resté hors du dépôt.

`← ` [CLAUDE.md](../CLAUDE.md), [deploy.yml](../.github/workflows/deploy.yml)

## Les icônes sont du SVG inliné, pas des `<img>`

Une icône était un fichier de `public/icons/` monté dans un `<img>`. Trois conséquences, toutes
subies : elle ne pouvait pas changer de couleur — d'où le même dessin en double,
`arrow-right.svg` et `arrow-right-on-accent.svg` — elle ne partait pas dans le paquet npm, et
chaque appel devait passer par `withBase()` sous peine d'un 404 invisible en développement.

Inlinées, elles n'ont plus d'URL, donc plus de `withBase()`. `icon` n'est plus un chemin mais un
nom, vérifié à la compilation.

`← 284bcad`, `4a455ac`

## Une variante ne s'intègre que quand une vue en a besoin

`Ghost` et `CTA` sur Button : décrits dans Figma, volontairement absents du code. Intégrer par
anticipation, c'est maintenir du code que personne n'appelle et documenter des états que personne ne
voit.

Les trois Tag remplies ont longtemps tenu la même ligne, puis sont entrées — non parce qu'une vue
d'ici les demandait, mais parce que **le point de surcharge dessinait à leur place** : `--tag-color`
posé au cran 800 fabriquait des outlines colorées que Figma ne dessine nulle part, en empruntant
pour se justifier le contraste des variantes remplies. Une doctrine qui reproduit de travers ce
qu'elle refuse d'intégrer ne tient plus. C'est le second chemin d'entrée d'une variante, et il est
plus étroit que le premier.

`← ` [Tag.astro](../src/design-system/components/Tag.astro),
[Button.astro](../src/design-system/components/Button.astro)

## `Alert` est entrée avant son emploi, et c'est une dette

Elle déroge à la règle ci-dessus, et il faut que ce soit écrit plutôt que découvert. Le 31/08 la
variante est intégrée pour l'action destructive du formulaire — sauf que la seule qui existe, le
« supprimer » d'Edit Image Gallery, est encore un `secondary` dans Figma (`355:1396`). La vue qui
la demande est donc décidée, pas dessinée : à ce jour `variant="alert"` n'a aucun appel dans le
dépôt, hors sa démonstration.

Ce n'est pas un troisième chemin d'entrée. Si `355:1396` ne change pas de variante, c'est l'alerte
qui doit ressortir, et non la règle qui doit s'élargir — sans quoi `Ghost` et `CTA` n'ont plus de
raison d'attendre.

`← 907d635`, [arbitrages.md](arbitrages.md)

## Un fond de bouton lit une rampe, par crans

Le primaire lit `accent 500 / 600 / 700` — repos, survol, appui. L'alerte lit
`feedback/danger 500 / 600 / 700`, et le secondaire `bg/surface`, puis `accent 100 / 200`.

Deux arbitrages du 31/08 tombent sur la même règle. Le rouge du système était un rôle seul : il
devient le cran 500 d'une rampe plutôt que de gagner deux voisins nommés `danger-hover` et
`danger-pressed` — aucun autre token de la collection ne porte un état dans son nom. Et le survol
du secondaire empruntait `bg/section`, dont le nom désigne le fond d'une région de page : un bouton
qui se teinte avec un fond de section emprunte un mot qui dit autre chose que ce qu'il fait.

Ce que la règle a coûté : renommer `danger` en `danger/500` a touché FieldLabel et deux pages. Ce
qu'elle rend : une variante se lit sans dictionnaire, et le cran suivant existe déjà le jour où un
quatrième état arrive.

`← 907d635`

## La surcharge se fait par variable CSS, pas par variante de plus

`--card-height`, `--intro-gap`, `--btn-bg` : le composant garde la valeur de Figma et accepte qu'un
contexte la lui reprenne. Le repli est **lu** sans être **déclaré** sur l'élément — le déclarer
battrait l'héritage et le point de surcharge ne servirait à rien.

`← a1969b4`

## Les écarts avec la maquette se signalent, ils ne se corrigent pas en dur

Le code suit le nœud Figma et écrit l'écart en `<p class="flag">`, avec son raisonnement. Corriger
en dur ferait diverger le code et la source sans que rien ne le dise. Ce qui appelle un geste dans
Figma est rassemblé dans [arbitrages.md](arbitrages.md).

`← 03c3afb`, et toutes les sections de [components.astro](../src/pages/components.astro)

## Les données de démonstration vivent dans `src/pages/`, jamais dans le système

`_demo.ts` — le préfixe empêche Astro d'en faire une route. Ce sont les mots d'un site, donc
exactement ce que le dépôt interdit de faire descendre dans `src/design-system/`. Il est partagé
parce que `/components` et `/templates/home` montrent les mêmes objets : deux copies divergeraient
au premier mot corrigé.

`← c0df004`

## Ne jamais inventer de contenu au nom d'une entreprise réelle

Deux cartes de remplissage portaient des missions fabriquées, attribuées à des entreprises qui
existent. Le commentaire du fichier disait bien que c'étaient des remplissages ; **l'écran, lui, ne
le disait pas** — même dessin, même phrase d'impact, même bouton. Ces pages sont publiées.

Un remplissage répète donc un contenu existant. Contrepartie assumée : trois cartes identiques
rendent le recouvrement moins lisible dans la démo réduite.

`← faa4bbc`

## Le mouvement de la pile est du défilement natif

Un script de pagination aurait coûté le clavier, la barre de défilement et le repli sans
JavaScript. Le seul script pose `inert` sur les couches recouvertes, et rien d'autre : sans lui, le
bouton de la première carte prend le focus alors que la deuxième le couvre entièrement — échec WCAG
2.4.11, *Focus Not Obscured*. Le cas a été mesuré, pas supposé.

Même contrat que les flèches du Carousel : sans son script, le composant marche entièrement.

`← b9f0ff8`

## Le liseré de la pile vaut 90 px par arbitrage, pas par lecture

Figma pose bien 50 en `itemSpacing`, mais ce n'est pas le liseré : celui qu'il dessine vaut 166 px
au repos puis 70, il n'est pas constant. Le code en garantit un seul partout, parce que c'est
l'intention. Les deux lectures se rejoignent à une condition, devenue la clé du calcul : **une carte
au repos occupe la hauteur de l'écran.**

Il valait 50 jusqu'au 2026-08-25, et il a été porté à 90 en montant la pile sur le portfolio : à 50,
le liseré se lisait comme un défaut d'alignement plutôt que comme une carte qui attend. Le nombre
n'a pas d'autre source que ce jugement — mais il tombe entre les 166 et les 70 que la maquette
dessine, donc il rapproche le code de ce qui est dessiné au lieu de l'en éloigner.

Le liseré n'est pas un réglage isolé : le chevauchement entre deux cartes est le même nombre vu de
l'autre côté, et le seuil de fenêtre basse du gabarit en est dérivé pixel pour pixel. Le déplacer,
c'est déplacer les trois.

`← b9f0ff8`

## Le bloc qui suit la pile doit être positionné

Sur une fenêtre courte, l'intro déborde du premier écran par le bas. C'est assumé : une carte la
recouvre pendant toute la pile. Mais en fin de page il n'y a plus de carte, et le premier écran —
collé, donc positionné — se peint par-dessus le bloc qui suit, quel que soit l'ordre du DOM. Lui
donner un fond ne suffit pas : il est peint dans la mauvaise couche.

`position: relative`, sans décalage, suffit à l'y remettre. Le bloc devient alors le sol qui
recouvre, comme les cartes avant lui, et aucun `z-index` n'est écrit. Le cas a été mesuré sur le
portfolio, pas supposé — et le gabarit portait le même défaut.

`← b9f0ff8`

## La pile s'empile à toutes les largeurs, téléphone compris

Elle se défaisait sous 768 px, et l'entrée qui vivait ici disait pourquoi : une carte pleine hauteur
serait illisible sur un téléphone. C'était une intuition. Mesurée le 2026-08-25, la vraie raison
était ailleurs — l'en-tête occupait 55 à 70 % de l'écran, la carte réclamait 753 px, et le carrousel
payait seul jusqu'à 13 px de vignette.

Puis la maquette mobile a effacé les tags, ce qui a rendu 132 px : en-tête à 229, carte à 621, moins
que la plupart des téléphones. Le repli n'avait plus d'objet, donc il n'existe plus. Ni le composant
ni le gabarit ne portent de règle sous 768 px, et le script a perdu le garde qui vérifiait que les
couches se collaient vraiment — sa branche était devenue inatteignable.

Il ne reste aucune bascule mobile, ni dans le composant ni dans la page : le premier écran est une
couche à toutes les largeurs, donc le liseré est garanti partout dès le chargement.

Ce que ça coûte est un arbitrage, et il a été tranché explicitement : **le liseré prime sur ce qui
dépasse**. L'intro réclame 741 px dans une colonne de 412 — son titre se replie sur sept lignes —
quand le premier écran n'en offre qu'environ 620. Elle déborde donc sous la première carte,
description et bouton compris. Ce n'est pas un cas mobile mais le cas des fenêtres courtes, que le
système connaît déjà : un écran de bureau trop bas fait exactement pareil. Seule la fréquence change.
Réduire le titre pour faire tenir la géométrie a été proposé et **refusé** : le titre est celui de
Figma, et une consigne de dessin ne se corrige pas pour arranger un calcul.

Trois choses que ce renversement apprend, et qui valent au-delà de ce cas. **Une raison de dessin non
mesurée se périme sans prévenir** : celle du repli a tenu des mois et était fausse. **Un ordre
d'empilement ne se déduit pas du positionnement** : la nav passait devant les cartes par effet de
bord de leur `static`, elle écrit désormais son propre rang, le même des deux côtés — sans quoi tout
ceci l'aurait cassée. Et **un arbitrage de dessin ne se tranche pas en écrivant du code** : le
compromis entre le liseré et l'intro a d'abord été décidé dans le silence, puis corrigé par la
personne à qui il revenait.

Reste un écart connu, le seul du système où une mesure de dessin n'est pas constante : la couche est
en `svh`, donc la barre d'URL du téléphone rend 60 à 90 px que la carte ne reprend pas, et le liseré
vaut 90 au chargement puis ~160 en lecture. Détail et arbitrage dans le `.flag` de
/components → Case Study List.

`← b9f0ff8`, puis `← 14f0468`, `2dfea45`

## La doc ne style que `main > section`

Un sélecteur nu atteignait tous les `<section>` de la page, y compris ceux que rendent les
composants montrés : l'Intro héritait dans sa propre démo d'une bordure et d'une marge qui ne sont
pas les siennes. Un composant montré doit se voir tel qu'il est ailleurs — c'est toute la raison
d'être de cette page.

`← 1a2650a`

## Le mouvement réduit supprime le trajet, pas les états

`npm run tokens` ajoute un bloc `prefers-reduced-motion: reduce` qui met les trois durées à `0ms`.
Ce bloc n'existe pas dans Figma. Aucun composant n'a à connaître la préférence : un onglet courant
reste signalé, un bouton survolé reste survolé.

`← ` [build-tokens.mjs](../scripts/build-tokens.mjs)
