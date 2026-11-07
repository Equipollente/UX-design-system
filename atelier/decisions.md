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

`CTA` sur Button : décrit dans Figma, volontairement absent du code. Intégrer par
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

## `Alert` est entrée avant son emploi — la dette a été honorée le jour même

Elle dérogeait à la règle ci-dessus, et il fallait que ce soit écrit plutôt que découvert. Le 31/08
la variante est intégrée pour l'action destructive du formulaire — sauf que la seule qui existe, le
« supprimer » d'Edit Image Gallery, était encore un `secondary` dans Figma (`355:1396`). La vue qui
la demandait était donc décidée, pas dessinée : `variant="alert"` n'avait alors aucun appel dans le
dépôt, hors sa démonstration.

Ce n'était pas un troisième chemin d'entrée. La condition de sortie était posée : si `355:1396` ne
changeait pas de variante, c'était l'alerte qui devait ressortir, et non la règle s'élargir — sans
quoi `Ghost` et `CTA` n'ont plus de raison d'attendre.

**La condition a été remplie le même jour.** Le nœud `418:1020` dessine le « supprimer » de son état
`success` en `Alert`, `355:1396` a suivi, et
[EditImageGallery.astro](../src/design-system/components/EditImageGallery.astro) passe le sien de
`secondary` à `alert`. La variante a maintenant son emploi, et la règle n'a pas eu à bouger.

Ce qui reste en vigueur ici n'est donc pas la dette mais **le fait qu'elle ait été écrite avant
d'être honorée**. C'est ce qui rend la règle crédible : une exception qu'on note se referme, une
exception qu'on tait devient le nouvel usage.

`← 907d635`, `← 810a9b6`, [arbitrages.md](arbitrages.md)

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

## Les cartes sont des primitives composables identifiables par `data-slot`

La famille Cards sépare la primitive neutre et les compositions spécialisées. `Card` porte uniquement
le cadre UI et accepte zéro ou plusieurs enfants ; `CardDefault` compose ce cadre pour le cas de carte
de liste et peut porter ses règles de lien et responsive. `CardImage`, `CardText`, `CardTags` et
`CardActions` portent chacun leur propre région et acceptent les attributs HTML complémentaires.

Chaque primitive expose un `data-slot` stable (`card`, `card-image`, `card-text`, `card-tags`,
`card-actions`). Cela rend la composition inspectable et donne aux futurs composants une convention
à suivre sans dépendre de noms de classes ou d'un framework CSS.

Cette décision reprend le principe de composition du dossier Card de
[fulldotdev/ui](https://github.com/fulldotdev/ui/tree/main/src/components/ui/card), mais pas sa
dépendance à Tailwind : ici les styles restent scopés dans Astro et lisent les tokens du système.
Une nouvelle région comme `CardHeader` ou `CardFooter`, ou une nouvelle composition, n'entre que
lorsqu'une vue réelle et un contrat Figma la justifient. `Card` ne déduit jamais un lien de la présence
d'un enfant : le comportement interactif appartient à la composition qui le demande.

`← improvement-component-card-default`

## Le dessin d'un champ est une recette de balise, pas un style de composant

Text field, Text Area et Select écrivaient chacun les mêmes déclarations — police, encre, fond,
trait, rayon, rembourrage — et divergeaient tout de même sur trois points. Le dessin est parti dans
[global.css](../src/design-system/styles/global.css), à côté de celui du `h2` et du `p` : « tu n'as
rien à écrire, c'est un champ ». C'est le raisonnement de `FieldLabel`, appliqué à la boîte au lieu
du libellé — un fichier, et ce qui change là a déjà changé partout.

Trois choses tiennent cette décision :

- **La liste de types est celle de la prop `type` de TextField, mot pour mot.** Elle tient dehors
  `checkbox`, `radio`, `file` et `range`, dont le dessin appartient à Checkbox, Radio, Toggle, Chip
  et AddImage — une recette de champ les écraserait.
- **`:where()` met la base à spécificité zéro.** Tout ce qui est déjà écrit ailleurs l'emporte, sans
  dépendre de l'ordre des feuilles : les contrôles bruts du bac à sable gardent leur dessin.
- **La recette habille, elle ne place pas.** La largeur d'un champ et la hauteur d'une zone de texte
  restent au composant qui les monte ; une largeur imposée à la balise déborderait ailleurs.

`global.css` était déjà la dépendance de fait des composants — `Card` compte sur lui pour la typo de
son titre, et l'anneau de focus des champs y était écrit une quatrième fois, en double des trois.

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

## La hauteur d'un champ est un token, et c'est celle du bouton

`control/height` vaut 44, comme `button/height/sm`. Les champs d'une ligne — Text field, Select,
Multi Select, la recherche de sa liste — se posent ainsi au même niveau qu'un bouton, et tiennent la
cible tactile de WCAG 2.5.5. Elle avait d'abord été dessinée à 36, une somme de deux espacements que
rien ne nommait.

Le token a son propre nom plutôt qu'un alias de `button/height/sm` : un champ qui change de hauteur
ne doit pas entraîner le bouton avec lui. Son rembourrage vertical n'est pas appliqué — la ligne fait
16,8, 12 + 16,8 + 12 donne 40,8 — et c'est la hauteur qui centre le texte, comme pour Button. Text
Area, dont la hauteur se compte en lignes, n'est pas concernée.

`← ` [global.css](../src/design-system/styles/global.css), variable `control/height` dans Figma

## Le fichier Figma est rangé par famille, et une page ne porte que des sources

Une page par famille de composants — Actions, Forms, Navigation, Cards, Content, Overlays — plus
Foundations, Icons, Templates, Illustrations. Chaque composant n'a qu'une place, et une page de
famille ne porte que des composants, pas leurs instances : deux boutons identiques côte à côte ne
disent pas lequel est la source. Les instances d'exemple et les brouillons vont dans « À trier »,
sans être supprimés ; la page « Documentation » garde les cadres de l'interface de ce site, que
`Sidebar.astro` cite.

Déplacer un nœud ne change pas son identifiant : les liens du dépôt tiennent. Seuls les liens de
**pages** ont changé, et `LINKS.md` les liste. La page HP n'existe plus : ses frames sont la
section Home de la page Templates (`729:3`). La collection de variables « Collection » s'appelle
« Responsive » ; la vide « Collection 2 » est supprimée.

`← ` [LINKS.md](../LINKS.md)

## Le Select n'est plus natif : un seul champ, à un ou plusieurs choix

Le Select retenait une valeur et restait un `<select>` natif, parce qu'un menu réécrit en `div`
coûte le clavier, la recherche à la frappe et la roulette du téléphone. MultiSelect, lui, était déjà
une liste flottante. Le dessin (`forms/Select List Combined`, 778:4266) a demandé pour **une valeur
seule** la recherche en haut, l'item choisi épinglé en bas et la création d'une option : une liste
ouverte par le système d'exploitation est hors d'atteinte du CSS, et ces trois demandes auraient
réécrit le natif presque en entier.

Il y a donc un seul composant, `Select`, qui porte `multiple` : des radios pour un choix, des cases
pour plusieurs, le même `name`, le même popover. Le clavier reste celui du navigateur (Tab, Entrée,
Espace, flèches). `MultiSelect` n'est plus que `<Select multiple>`, gardé importable pour que les
sites qui l'emploient ne changent rien ; **le Select, lui, change de balisage** — un `fieldset` et
des radios à la place du `<select>` — et un site qui le ciblait par `select` doit suivre.

La création d'une option n'enregistre rien : le champ l'annonce par l'événement `select-create`, et la
page décide de la garder.

`← ` [Select.astro](../src/design-system/components/Select.astro)


## La palette de l'État est une collection à part, pas un groupe de plus

Pour qu'un projet — Prof Hub, d'abord — réutilise les composants avec la palette du Système de
design de l'État, les 228 couleurs entrent dans une **seconde collection Figma, DSFR**, et non dans
*Design tokens*. Elle s'exporte seule (`tokens/DSFR.tokens.json`) et sort dans `tokens-dsfr.css`, que
rien ne charge par défaut : un projet qui garde la palette d'origine ne paie pas 228 variables.

Les paliers suivent ton échelle, du plus clair au plus foncé : 50 à 950, la teinte `main` du DSFR
toujours en 500 ; `grey` a ses 14 pas, les couleurs fonctionnelles reprennent `feedback`. Le nom DSFR
d'origine reste dans la description de chaque variable. Le `error` du DSFR n'est **pas** renommé
`danger` : `color.feedback.danger.*` existe déjà (bg, border, text, solid), et les deux fichiers auraient défini la même
variable, le DSFR écrasant le rouge d'erreur en silence. `build-tokens.mjs` refuse désormais un nom
déjà pris.

**Reste à faire** : les composants lisent désormais des rôles (`color.action.*`, `color.text.*`…), et ces
rôles pointent vers `ramp.*` (voir ci-dessous) ; `bg-default`, `bg-surface` et `bg-section` sont liés. Pour qu'une
palette en remplace une, il reste à repointer les rôles vers la famille choisie.

`← ` [LINKS.md](../LINKS.md)

---

## Les composants lisent des rôles, jamais une rampe ; les rampes sont à part

Les couleurs sont sur deux étages. `Primitives` (collection Figma, un seul mode, exportée dans
`tokens/Primitives.tokens.json`) porte les rampes brutes — `ramp.neutral.100`, `ramp.accent.500`,
`ramp.red.800`… — et n'est appliquée par personne. `Design tokens` porte les rôles (`bg`, `text`,
`border`, `action`, `feedback`, `category`, `progress`), tous des alias vers une primitive. Un composant ne
lit qu'un rôle : la valeur d'un survol ou d'un état se décide dans Figma, une fois, et non en choisissant
un cran de rampe dans le composant.

Les anciens noms — `color.neutral|accent|highlight|clay|teal|sun|rose.*`, `color.feedback.danger.500|600|700`
et `color.feedback.success` — sont **retirés** : 67 tokens, 335 → 268. C'est un changement cassant pour un
site qui lisait `--color-accent-500` ; d'où la version `0.2.0` (en `0.x`, le cassant monte le deuxième
chiffre). La correspondance est mécanique : `--color-accent-500` devient `--ramp-accent-500`, ou mieux le
rôle qui dit l'usage (`--color-action-primary-bg`).

Le retrait s'est fait dans cet ordre, qui est le seul sûr : plus aucune lecture dans le code ; dans Figma,
chaque liaison vers un ancien nom déplacée vers la primitive de même valeur (environ 2 400, composants
principaux d'abord, puis surcharges d'instances) ; contrôle qu'il n'en restait aucune ; seulement alors
suppression des variables. Résultat : 0 valeur résolue qui change, 67 tokens en moins, rien d'autre.

**Côté dessin, fait le 01/11** : sur 2 400 liaisons vers `ramp/*`, 2 300 ont été repointées vers le rôle qui
dit leur usage (texte, traits d'icône, fonds de survol, tags, boutons, retours d'état…). Chaque rôle choisi a la
même valeur que la primitive qu'il remplace, sauf une exception voulue : l'icône d'un bouton primaire lisait
`neutral/100` et lit `text/on-accent` (blanc), comme le code. **Restent 100 liaisons** sans rôle équivalent : des gris
décoratifs de la page Fondations et des nœuds de maquette (`neutral/400`, `neutral/200`, `neutral/800`,
`highlight/*`, quelques `accent/200`) — soit un rôle à créer, soit à laisser en `ramp/*` s'il s'agit de
maquette plutôt que de système.

`←` [atelier/architecture-couleurs.md](architecture-couleurs.md), [mettre-a-jour-les-tokens-depuis-figma.md](mettre-a-jour-les-tokens-depuis-figma.md)

## Ghost entre dans le Button, et Link reste à part

*02/11.* Le Button gagne la variante `ghost` : l'action sans fond, à faible poids visuel — « Annuler », un
outil dans une barre. Elle vient de l'« invisible » du Button de Primer, que le dessin nomme ici `ghost`.
Elle entre non par anticipation mais parce que Judith l'a demandée, et qu'une action sans fond n'a pas de
chemin plus court : le point de surcharge `--btn-bg: transparent` ne donne ni le lavis au survol ni celui
à l'appui.

**Link ne devient pas une variante du Button.** Un lien mène quelque part et se reconnaît à son
soulignement au survol (WCAG 1.4.1) ; un Ghost déclenche une action et garde la taille, la pilule et
l'anneau du bouton. Fusionner demandait à la variante de redéfinir presque tout — forme, marges, survol,
focus — et d'imposer `size` à un objet qui n'en a pas. La règle est l'intention, pas l'apparence : ce qui
navigue est un Link, ce qui agit sans poids est un Ghost.

Un token créé pour l'occasion : `color/action/ghost/bg-pressed`, alias de `ramp/neutral/200`, dans le même
schéma que le Secondary (survol 100, appui 200). `bg-hover` existait déjà.

## Le Ghost remplace Link, qui sort du code

*02/11.* Le composant Link est retiré du code et de la doc. Aucune vue ne l'utilisait — il n'apparaissait que
dans sa propre démonstration — et la règle du dépôt veut qu'un composant sans appelant ne se maintienne pas.
Le Ghost du Button porte ce qu'il portait : avec `href`, le Button rend déjà un `<a>`, donc un Ghost avec
`href` est le lien autonome.

Cela **corrige l'entrée précédente**, qui gardait Link à part. Le raisonnement sur la différence tient
toujours — un lien se reconnaissait à son soulignement, un Ghost a un lavis au survol —, mais le soulignement
n'était plus un argument pour entretenir un composant que personne n'appelait. Ce qui est perdu : ce signe
au survol. Une flèche en fin de libellé (`iconEnd`) aide à reconnaître ce qui se clique.

Le Ghost n'est **pas redessiné** pour autant : il garde sa taille, sa pilule et son anneau. Le dessin `Link`
reste dans Figma (`613:4816`), rangé dans la liste des non-intégrés de LINKS.md ; un lien qui devrait se
lire comme du texte, soulignement compris, se rouvrirait à ce moment-là.

## Le champ texte s'appelle Input

*02/11.* `TextField` devient `Input`, dans Figma (`forms/Input`) et dans le code
([Input.astro](../src/design-system/components/Input.astro)). Le nom d'un composant qui habille un champ de
saisie est celui de la balise : c'est celui de Primer, et c'est ce qu'un designer attend. « Field » désignait
aussi bien le select et la zone de texte, et n'était déjà plus le nom d'un seul objet.

Le nœud est aussi normalisé sur ses voisins : `state=disabled` (copié de Text Area : opacité de la boîte,
encre `text/disabled`), `validation` (`error`, `success`), et la propriété `value`, que Text Area et Select
avaient déjà. La description du nœud, qui disait « pas d'état désactivé ni d'erreur », est réécrite.

**C'est un changement cassant pour qui consomme le paquet.** `ux-design-system/components/TextField.astro`
n'existe plus : un site qui l'importe doit passer à `Input.astro`. Le renommage doit donc partir avec une
version mineure en 0.x, et le portfolio — s'il emploie le champ — change son import le même jour.

**Pas fusionné avec `forms/search`.** On l'avait pris pour un doublon de l'Input ; ses quatorze instances
sont toutes dans les listes du Select, c'est la recherche de la liste. Elle reste une pièce du Select.

## La zone de texte s'appelle Textarea

*02/11.* `TextArea` devient `Textarea`, dans Figma (`forms/Textarea`) et dans le code
([Textarea.astro](../src/design-system/components/Textarea.astro)), par la même règle que l'Input : le nom d'un
composant qui habille un champ de saisie est celui de la balise.

Le nœud est normalisé sur l'Input : une description, qui manquait ; `hint?`, que le code portait déjà ;
`showCount?` au lieu de `count?`, pour que la propriété Figma porte le nom de la prop `showCount` ; une largeur
fixe de 260 comme l'Input, au lieu de celle du mot « Description ». Le libellé passe par `_FieldLabel`.

**Même changement cassant** que pour `Input` : `ux-design-system/components/TextArea.astro` n'existe plus. Les
deux renommages partent dans la même version mineure.

Restent ouverts, parce que ce sont des choix de dessin : le placeholder, que le code distingue d'une valeur et
que Figma ne dessine pas ; et la poignée de redimensionnement (`resize: vertical`).

## Le placeholder se dessine : `text` = value ou placeholder

*02/11.* Input et Textarea gagnent une propriété de variante `text`, qui vaut `value` ou `placeholder`, et deux
propriétés de texte, `value` et `placeholder`. C'est le découpage du code, qui sépare les deux props et leur donne
deux encres — `text/default` pour ce qui est écrit, `text/muted` pour l'exemple qui disparaît à la première frappe.
Avant, Figma n'avait qu'un texte, en noir : un champ vide était impossible à dessiner, et un exemple avait l'air
d'une valeur. La solution est celle de Primer (« text type »).

Le texte par défaut est « Value » et « Placeholder », les mêmes pour les deux composants. Les trois textes
d'exemple qui variaient (« Untitled project », « Enter your text here… », « Choose… ») sont partis avec.
Le Select, qui dessine un « Choose… », sera traité à son tour. La poignée de redimensionnement de la zone de texte
n'est pas dessinée : c'est le navigateur qui la pose, et elle diffère d'un système à l'autre.

## Les lignes de la liste du Select sont un seul jeu, `_SelectItem`

*02/11.* Les trois jeux de lignes — `Single Select Menu Item`, `Multi Select Menu Item`, `Select Menu Item Create
Option` — deviennent un jeu interne, `_SelectItem`, avec `type` (multiple, single, create), `selected` et `state`. Ils
dessinaient chacun la même ligne autour d'un contrôle différent ; le changer demandait trois gestes, sur 319
instances. Les propriétés des onze jeux de la famille passent en minuscules, comme les champs, et la variante
`State5` de la ligne de création — identique à `Default`, sans aucune instance — est supprimée.

**Le Chip n'en fait pas partie.** `forms/Chip` (351:273, ex `forms/Select Menu Item Chips`, rangé dans la frame Chip le 02/11) est le composant Chip du système, avec sa
propre section et son propre fichier de code ; l'avoir fondu dans `_SelectItem` aurait retiré un composant public. Une
première passe l'avait fait, et a été défaite : les 112 pastilles du fichier sont revenues sur le Chip, intactes.

Reste à ranger : les jeux de liste (`Select List`, `Combined`, `Search`, `Count`, `Count chips`, `Select Chips`), dont
`Search`, `Count` et `Count chips` n'ont aucune instance et sont des états de donnée plus que des composants.

## La liste du Select devient `_SelectPanel`, avec des booléens

*02/11.* `Select List Combined` (778:4266) s'appelle `_SelectPanel`. Ses dix variantes — `List` × `Search` × `Create
option` × `Selected` — tombent à deux : `type` (single ou multiple), et trois booléens, `searchable?`, `creatable?` et
`showSelected?`, qui sont les noms des props du code. Les neuf instances du fichier gardent leur rendu ; l'une d'elles
cachait ses choix épinglés par une surcharge, que le booléen a remplacée.

**Décidé, pas encore fait.** La boîte `Select` perd son état `open` au profit d'un booléen `open?` qui montre ce panneau,
comme le `menu?` du Select de Primer ; et le code se coupe en `Select` (un choix), `MultiSelect` (plusieurs) et
`_SelectPanel` (la liste partagée), sans native — la liste reste dessinée. `creatable` reste sur les deux. Ce n'est pas
un détail pour les sites qui consomment le paquet, mais c'est la décision de Judith, qui les gère.

**Ce qui bloque l'état `open`.** Dix instances du fichier s'accrochent aux variantes `open` du Select — elles vivent
dans les jeux de démonstration `Select List Search`, `Count` et `Count chips` (aucune instance extérieure). Les retirer
sans les refaire casserait ces démonstrations : il faut d'abord les redessiner, comme variantes `type` du contenu du
panneau (items, empty, max), à la manière du `Content` de Primer.

**Fait le même jour : la boîte du Select n'a plus d'état `open`.** Elle porte `open?`, un booléen qui montre un
`_SelectPanel` en instance exposée, comme le `menu?` de Primer : 24 variantes (état × validation × texte) au lieu de
30. Les trois jeux de démonstration — `Select List Search`, `Count`, `Count chips` — qui s'accrochaient aux variantes
`open` sont supprimés. Leurs cas (fermé, ouvert, recherche tapée, aucun résultat, création, choix épinglés, maximum
atteint, pastilles) sont redessinés dans une frame « Cas », en instances du `Select` et de `_SelectPanel` avec le
contenu de l'emplacement : **ce sont des cas de contenu, pas des variantes**, parce que le panneau a des emplacements,
là où le `Content` de Primer n'en a pas.

## Select et MultiSelect sont deux composants, sur une pièce interne

*02/11.* `Select` n'accepte plus que le choix unique ; `MultiSelect`, qui était un alias de `<Select multiple>`, devient
le champ à plusieurs choix. La prop `multiple` disparaît : c'est le nom du composant qui le dit. `max`, `display`,
`showSelected`, `values` et les mots du compteur ne sont offerts qu'à `MultiSelect`, et `npm run check` les refuse sur
`Select`. `creatable` et `searchable` restent sur les deux, par décision de Judith. La coupe se fait par métier et non
par pièce : la liste est la même, dessinée, sans `<select>` natif.

**Changement cassant, assumé** : un site qui écrit `<Select multiple>` doit passer à `<MultiSelect>`. Judith gère les
sites qui consomment le paquet.

**Fait à moitié.** Le champ, la liste et le script restent ensemble dans `_Select.astro` (1 304 lignes), que les deux
façades habillent. `_SelectPanel` — la liste, qui est déjà une pièce à part dans Figma — n'en est pas encore tiré :
le script de 780 lignes relie la boîte, la liste et les pastilles par des attributs `data-*` sur un conteneur unique, et
il n'y a aucun test automatique. À faire avec un cas d'essai pour chaque comportement.

**`_SelectPanel` est tiré de `_Select` (02/11).** La liste — recherche, options en cases ou en radios, groupes, pied avec
les choix épinglés et la création — est son propre fichier, avec son style (338 lignes) et les modèles d'une option
créée, qui doivent porter son identifiant de style et non celui de la boîte. `_Select.astro` passe de 1 304 à 855
lignes et garde la boîte, les pastilles, le message de limite et le script. Le script ne bouge pas : il relie ces
morceaux par les `data-*` du fieldset, et le couper aurait déplacé des attributs sans rien séparer.

Vérifié sans test automatique, par comparaison : le HTML de chacun des dix-huit champs de `/formulaire` est identique avant
et après (modèles compris), la liste a le même cadre, la même largeur que sa boîte et la même ombre, une ligne cochée a
son fond d'accent et sa coche, les chevrons se renversent, la recherche filtre et se vide à la fermeture, et une
option créée — dont la ligne vient d'un modèle — est stylée comme les autres.

**Le bac à sable clone les listes sans les copier telles quelles (02/11).** Un Select cloné depuis la banque
gardait un seul choix `⟨choix⟩`, des ids en double et aucun écouteur : la copie d'un `<select>` natif ne vaut plus pour
un fieldset à liste flottante. Le script du Select est donc ré-initialisable — `init(root)` garde un `WeakSet`, et se
tient à `window.initSelect` — et l'atelier « formulaire » remonte chaque champ : une ligne clonée par choix, son id, celui
de sa liste, le `popovertarget` du bouton et l'ancre de la liste, puis `initSelect` sur chaque fieldset. `MultiSelect`
y est un huitième type, avec ses quatre états dans la banque.

**Les cas du Select et du MultiSelect sont séparés, la boîte reste commune dans le code (02/11).** La frame « Cas »
montrait huit cas en cases à cocher posés sur la boîte du Select simple : des cas de MultiSelect sur le mauvais
composant. Chacun a désormais les siens — cinq en radios dans la frame Select, huit en cases à cocher dans la frame
MultiSelect, où les pastilles sont la variante `display=chips` de la boîte et non plus une pièce ajoutée. La fusion en un
seul `Select` à prop `multiple` a été examinée et écartée : la valeur change de forme (`value` ou `values`) et cinq
props ne valent que pour le multiple, d'où une union discriminée ou des props ignorées en silence ; deux façades fines
sur `_Select` les refusent à la compilation, et ajouter une prop à l'une est sans risque quand en retirer casse les
sites. Le partage voulu — boîte, liste, script — existe déjà côté code ; côté Figma, la boîte est dessinée deux fois.

**Le bouton rond n'est plus une variante : c'est `IconButton` (03/11).** Figma a sorti la variante `icon` du
jeu Button pour en faire un composant à part (881:71005, `variant` × `size` × `state`, plus `icon`). Le code suit :
`Button` n'a plus que primary, secondary, alert et ghost, et `IconButton` le rend en lui retirant la largeur
minimale et le rembourrage, avec un diamètre égal à la hauteur de la taille. Un bouton sans libellé n'a ni texte, ni
`iconEnd`, ni largeur minimale, et doit porter son nom : `icon` et `aria-label` sont obligatoires, et le composant
refuse de se compiler sans. Le secondaire reste son défaut, parce que c'est le rond d'origine. Cassant pour qui
écrivait `<Button variant="icon">` : la bascule est `<IconButton icon="…" aria-label="…" />`.

## La couleur s'organise par propriété, la forme et la typographie suivent Primer (03/11)

**Couleur : deux étages, des rôles par propriété.** `primitives` porte les rampes, nommées d'après leur teinte —
`grey`, `indigo`, `lime`, `clay`, `teal`, `sun`, `rose`, `red`, `green`, plus `blue-france` et `green-emeraude` pour
Prof Hub. `semantic` porte les rôles, rangés par **propriété d'abord** — `color/surface`, `background`, `text`, `icon`,
`border` — puis par famille (primary, secondary, highlight, neutral, rose, clay, teal, sun, danger, success, warning,
info, plus `base` pour le défaut). L'emphase se dit `bold`, `subtle`, `subtlest` ; l'état `/hover`, `/pressed`. Une
famille s'appelle d'après sa fonction, une rampe d'après sa teinte. Un composant ne lit qu'un rôle.

**Le thème est un mode, pas une catégorie.** Prof Hub est un mode de `semantic` : mêmes noms, autres valeurs (rampes
DSFR). Dans le CSS, Default est le `:root` et Prof Hub un bloc `[data-theme="prof-hub"]` qui ne redéfinit que ce qui
change. Les modes d'appareil n'existent que dans `layout`.

**Taille, forme et typographie suivent Primer.** `size` : une échelle `base/` nommée d'après sa valeur, des rôles qui
y pointent (`stack`, `control`, `icon`, `overlay`, `section`), les traits, les rayons, l'anneau de focus et les
seuils de largeur. La densité est dans le nom (`condensed`, `normal`, `spacious`), pas dans un mode. `typography` : une
échelle de base (8 tailles : 12, 14, 16, 18, 20, 24, 32, 40) et neuf rôles de texte (`display`, `title/large|medium|small`,
`subtitle`, `body/large|medium|small`, `caption`). Les tailles passent de 10, 11, 13, 15, 17 à une échelle où le
texte courant fait 16 px et rien ne descend sous 12 : un champ à moins de 16 px fait zoomer iOS.

**Un bouton épouse son contenu.** La largeur minimale (`button/min-width`) est supprimée ; la hauteur reste un token
(`control/<taille>/size`), parce qu'elle fixe la cible tactile. Le padding vertical n'existe plus sur le bouton.

**Les variantes de catégorie du Button sont des teintes claires.** `action/<teinte>/bg` valait exactement
`background/<famille>/subtle`, le libellé `text/<famille>/on-subtle`, et l'icône `icon/<famille>`.

**Écarts connus, à arbitrer dans Figma :** la bordure de champ (`border/base/subtle`) et l'indicateur « éteint » du
Toggle (`background/inactive`, très pâle) ne tiennent pas le 3:1 des éléments d'interface ; les ombres, l'opacité et les
rapports d'image sont dans `effects` sans rôle sémantique ; `card` n'a plus de tokens propres.

## Le nom d'un token est la syntaxe code de sa variable Figma

`build-tokens.mjs` ne déduit plus le nom CSS du nom de la variable : il lit `com.figma.codeSyntax.WEB`
(`var(--color-text-primary-default)`) dans l'export, tel quel. Le but est de coder depuis Figma sans
interpréter — ce que Figma affiche en mode Dev est ce que le code écrit. Une variable sans syntaxe, ou
deux variables avec la même, font refuser la construction ; une syntaxe qui s'écarte de la règle de
nommage est signalée sans bloquer, parce que c'est presque toujours un renommage dont le champ n'a pas
suivi. La palette DSFR, qui n'a pas de syntaxe, garde la règle.

La collection Motion est préfixée par le script (`--motion-duration-quick`) : sa syntaxe dans Figma doit
le dire aussi. `node scripts/liste-syntaxes.mjs` dresse la liste et relève les écarts.

## Les variantes d'un champ ont un vocabulaire commun : `state` × `validation`

Décidé le 07/11, après l'audit des formulaires dans Figma. Le fichier mêlait `status`, `validation`, `state`,
`State`, `default` et `rest`, un interrupteur `focus` en plus, et un `Property 1` sans nom.

| Propriété | Valeurs |
| --- | --- |
| `state` | `rest`, `hover`, `focus`, `disabled` (+ `read-only` sur les champs texte) |
| `validation` | `none`, `error`, `success` |
| `size` | `small`, `medium`, `large` — `xsmall` est retiré, rien dans le code ne l'emploie |
| `checked`, `indeterminate`, `selected` | `true`, `false` |
| `orientation` | `vertical`, `horizontal` |
| `text` | `value`, `placeholder` |
| `type` | la sorte de champ (`text`, `search`, `select`) |

L'état d'interaction et la validation sont **deux axes**, comme dans le code où `error` et `success` sont
indépendants de `disabled` : un champ peut être au focus et en erreur, ce que le `status` unique ne dessine
pas. Les combinaisons impossibles (désactivé et en erreur) ne sont pas dessinées.

Un `?` en fin de nom désigne un interrupteur d'affichage (`hint?`, `label?`, `counter?`), jamais une
variante : `inset?`, `fullWidth?` et `selected?` le perdent. Tout est en minuscules, sans préfixe `forms/` —
la page range déjà — et le préfixe `_` reste réservé aux pièces internes.
