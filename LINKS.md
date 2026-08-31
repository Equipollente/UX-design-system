# Liens du design system

Tout ce vers quoi il faut pouvoir retourner. Tenu à la main — les identifiants de nœuds Figma sont
stables, seul le nom du fichier dans l'URL est cosmétique.

Les liens propres au portfolio (prototypes des pages, maquettes du site) sont partis avec lui, dans
le `LINKS.md` du dossier `portfolio`.

## Figma

**Fichier** — `uQ5j90wu2MJSvzsN3Oc0pT`
<https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system>

| Page | Ce qu'on y trouve | Lien |
| --- | --- | --- |
| Foundations | Couleurs, typo, espacements, rayons, ombres — la source des tokens | [`5-2`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=5-2) |
| Components | Les composants et leurs variantes | [`19-2`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=19-2) |
| Icons | Les icônes sources — exportées dans `icons/`, générées par `npm run icons` | [`45-395`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=45-395) |
| Templates | Les maquettes de page — hors périmètre de ce dépôt | [`9-2`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=9-2) |

### Composants

| Composant | Nœud | Code |
| --- | --- | --- |
| Icon (les 20 icônes) | [`45-395`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=45-395) | [Icon.astro](src/design-system/components/Icon.astro), registre généré dans [icons.ts](src/design-system/lib/icons.ts) |
| Button (un jeu de variantes par taille) | lg [`21-47`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=21-47) · md [`334-1233`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=334-1233) · sm [`334-1283`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=334-1283) | [Button.astro](src/design-system/components/Button.astro) |
| Nav (jeu de variantes) | [`142-1458`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=142-1458) | [Nav.astro](src/design-system/components/Nav.astro) |
| Avatar-Button | [`45-703`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=45-703) | prop `home` de Nav |
| Tag | [`19-12`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=19-12) | [Tag.astro](src/design-system/components/Tag.astro) |
| Cards (jeu de variantes) | [`334-1129`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=334-1129) | [Card.astro](src/design-system/components/Card.astro) |
| Case Study Card | [`88-131`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=88-131) | [CaseStudyCard.astro](src/design-system/components/CaseStudyCard.astro) |
| Section Header (en-tête de la carte) | [`88-74`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=88-74) | [CaseStudyHeader.astro](src/design-system/components/CaseStudyHeader.astro) |
| Carousel | [`88-85`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=88-85) | [Carousel.astro](src/design-system/components/Carousel.astro) |
| Section.Intro | [`209-2348`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=209-2348) | [Intro.astro](src/design-system/components/Intro.astro) |
| Case Study Card en situation | [`176-1248`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=176-1248) | — |
| Case Study List | [`222-814`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=222-814) | [CaseStudyList.astro](src/design-system/components/CaseStudyList.astro) |
| Page HP (la pile en situation, 3 états) | [`222-1168`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=222-1168) | [templates/home.astro](src/pages/templates/home.astro) |
| FieldLabel | — (spécifié en conversation) | [FieldLabel.astro](src/design-system/components/FieldLabel.astro) |
| Select (jeu de variantes) | [`340-933`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=340-933) | [Select.astro](src/design-system/components/Select.astro) |
| Radio (jeu de variantes) | [`340-879`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=340-879) | [Radio.astro](src/design-system/components/Radio.astro) |
| Checkbox (jeu de variantes) | [`340-842`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=340-842) | [Checkbox.astro](src/design-system/components/Checkbox.astro) |
| Toggle (jeu de variantes) | [`340-912`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=340-912) | [Toggle.astro](src/design-system/components/Toggle.astro) |
| Text Area (jeu de variantes) | [`343-273`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=343-273) | [TextArea.astro](src/design-system/components/TextArea.astro) |
| Chip (jeu de variantes) | [`351-273`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=351-273) | [Chip.astro](src/design-system/components/Chip.astro) |
| Add Image (jeu de variantes) | [`343-315`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=343-315) | [AddImage.astro](src/design-system/components/AddImage.astro) |
| Edit Image Gallery | [`355-1396`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=355-1396) | [EditImageGallery.astro](src/design-system/components/EditImageGallery.astro) |
| Modals (jeu de variantes) | [`420-1223`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=420-1223) | [Modal.astro](src/design-system/components/Modal.astro) |

La section Figma qui porte les trois derniers : [`176-1236`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=176-1236) — *Case Study Cards Components*.

Le composant Figma s'appelle « Section Header » mais tout ce qu'il contient est propre à une étude
de cas : le code le nomme `CaseStudyHeader`. Renommage à trancher côté Figma.

Même décalage sur `Section.Intro`, pour une autre raison : le préfixe `Section.` est une convention
de rangement du fichier Figma, pas une partie du nom de l'objet. Le code le nomme `Intro`.

Le jeu de variantes `334:1129` s'appelle « Cards » — au pluriel, avec une espace finale — et sa
propriété de variante s'appelle « Property 1 ». Le code les nomme `Card` et `orientation` : un nom
de tiroir et un nom vide ne désignent pas un objet. Les deux renommages sont à trancher côté Figma.
Attention à la confusion : trois autres composants de la page portent le préfixe `Cards/` et ne sont
pas celui-là — ils sont toujours dans la liste des non-intégrés, plus bas.

Même geste sur le jeu `420:1223` : Figma l'appelle « Modals », au pluriel, le code le nomme
`Modal`. Sa propriété de variante, « Property 1 », devient `variant` dans le code, et prend trois
valeurs — `validation`, `alert`, `succes` — là où Figma en montre quatre : le quatrième,
« Layout », est le gabarit générique de la maquette, pas un cas de contenu réel, et ne devient
jamais une valeur de prop.

Quatrième décalage, tranché dans l'autre sens : la variante `Lime` du Tag consomme la rampe
`highlight`. Le code a gardé `lime` pour que la prop se recoupe avec le fichier, et écrit donc un nom
de couleur pour lire un nom de rôle. C'est la variante qu'il faut renommer — ligne ouverte dans
[arbitrages.md](atelier/arbitrages.md).

La page **HP** porte trois frames de 1280 × 834 qui sont trois états de défilement, pas trois
écrans : `45-388` au repos, `222-907` la première carte montée, `222-1042` la seconde par-dessus.
Aucune réaction de prototypage n'y est posée — le mouvement vient de la consigne, et il est
écrit sur `/components`.

Il en manque un quatrième : **la barre effacée**, première carte par-dessus l'intro. La prop
`sticky` du Nav lui donne ce comportement — elle se colle en haut, glisse vers le haut quand on
descend, revient quand on remonte — et rien dans Figma ne le dessine. Tant que ce frame n'existe
pas, le code est la seule spécification du mouvement.

### Ce que le code attend de Figma

Ce que les `flag` de `/components` demandent, rassemblé ici parce que c'est la carte Figma ↔ code.

| Ce qui manque | Où ça se voit | Arbitrage |
| --- | --- | --- |
| L'état « barre effacée » de la HP | prop `sticky` de [Nav.astro](src/design-system/components/Nav.astro) | Un quatrième frame sur la page HP |
| La taille de l'avatar (`64px`, en dur) | `--nav-home-size` dans [Nav.astro](src/design-system/components/Nav.astro) | Une variable. Elle vaut la hauteur d'une pilule d'onglets, et c'est ce qui fait que `nav/height` est le même nombre avec ou sans avatar — une coïncidence que rien ne garde aujourd'hui |
| Un fond pour la barre, ou l'absence assumée | `.nav-bar` dans [Nav.astro](src/design-system/components/Nav.astro) | À trancher : la pilule lavande sur une carte lavande perd son contour, et l'eyebrow de la carte passe derrière la barre |
| Une échelle d'empilement | `z-index: 1` dans [Nav.astro](src/design-system/components/Nav.astro) | Exception assumée : le seul z-index du système, à ne transformer en échelle que si un deuxième cas arrive |
| ~~Les trois ombres~~ | — | **Réglé le 27/08.** Figma n'a pas de type « ombre » : chaque morceau est nommé seul et lié à la couche, et `npm run tokens` les recompose. Une couche de contact partagée, plus une diffusion par élévation — 16 variables |
| Un fond lié pour la fiche | `background` de `.card` dans [Card.astro](src/design-system/components/Card.astro) | Le blanc de `334:1129` n'est lié à aucune variable, alors qu'il vaut exactement `color.bg.default` |
| Un slot nommé pour la rangée de tags du haut | slot `tags-top` dans [Card.astro](src/design-system/components/Card.astro) | « Frame 6 » (`392:1075`, `392:1076`) est un frame, pas un slot : l'emplacement ne se remplit pas dans la maquette, et son nom est une décision du code |
| Une hauteur de média | `--card-media-height` dans [Card.astro](src/design-system/components/Card.astro) | 324 et 256 n'ont pas de token. Un troisième nombre ouvrirait le groupe |
| Le point de rupture (`767px`) | six media queries dans `src/`, plus `build-tokens.mjs` | Une variable de build, pas un token CSS : une custom property ne peut pas figurer dans une media query |
| Un emploi pour la variante `Alert` | `<p class="flag">` du Button, sur /components | Elle est dessinée dans les trois tailles, mais la seule action destructive du système — le « supprimer » d'Edit Image Gallery, `355:1396` — est encore un `secondary`. C'est ce nœud-là qui doit changer de variante |

Les composants Figma pas encore intégrés : `Cards/UXVision`, `Cards/Metric Highlight`,
`Cards/User Quote`, `Research Finding`, `Role` — tous sur la page Components. Les sept objets
de formulaire en sont sortis le 27/08.

### Ce que le formulaire attend de Figma

Le sprint des sept composants avait buté sur une seule chose, et toujours la même : le système
n'avait aucune famille de mesures pour la géométrie d'un contrôle, ni pour l'épaisseur d'un trait,
ni pour l'opacité. **Les trois ont été créées le 27/08**, et les six variables sont dans la
collection — voir [suivi-formulaires.md](atelier/suivi-formulaires.md).

| Ce qui manquait | Ce que ça vaut maintenant |
| --- | --- |
| La boîte d'un contrôle (18) | `control/size` — Radio et Checkbox font 18 |
| La hauteur d'une piste (22) | `control/track-height` — le Toggle fait 22 |
| Une famille d'épaisseurs | `border/width/default` = 1 et `border/width/focus` = 2. Les champs portent leur trait, et le Chip se voit sur fond blanc |
| Une échelle d'opacité | `opacity/disabled` = 50 %. Un champ désactivé s'atténue au lieu de compter sur l'encre de son libellé |
| Un rembourrage de champ (14 / 10) | le nœud de Text Area redessiné sur les 12 / 16 du bouton |
| Un écart libellé ↔ champ (5) | `control/field-gap` — Text Area et Select s'espacent enfin pareil |

Ce qui reste ouvert côté Figma, et qui n'est plus une affaire de token :

| Ce qui reste | Ce que ça coûte |
| --- | --- |
| `color/border/default` ne vaut que **1,28:1** sur le blanc | Le trait du Chip se voit, mais n'atteint pas les 3:1 que WCAG 1.4.11 demande. C'est une couleur à foncer, pas une épaisseur |
| Le Select ne porte aucun trait au repos | Text Area en a un de 1 : deux champs voisins dessinés différemment |
| Le Button n'a **aucun état Focused** | `button/focus-ring-width` ne décrit donc aucun dessin. Plus personne ne le lit : c'est un reliquat à supprimer |

Tout le reste tombait déjà juste, souvent par composition de deux tokens : la piste du Toggle
(`space-xl + space-lg` = 40), le point du Radio (18 − 1 − 1 − 4 − 4 = 8), le rembourrage d'AddImage
(`space-xl + space-xs` = 28), son icône (`space/2xl` = 32), la hauteur d'une vignette
(`space-layout-128 + space-md` = 140), et la hauteur du Select (`space/2xl + space/xs` = 36).

### Variables

`nav/height` ([`234-1222`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system)) porte
la hauteur de la barre collée : 88 en Desktop, Tablet et Paper, 72 en Mobile. C'est le seul token du
groupe `nav`, et le premier qui varie par mode en dehors de `layout`. Il double une valeur qui vit
aussi dans le padding de `.nav-bar` — changer l'un demande de reprendre l'autre, et les deux
fichiers se renvoient l'un à l'autre en commentaire.

Les 146 tokens vivent dans la collection **Design tokens** du même fichier, en 4 modes (Desktop,
Tablet, Mobile, Paper). Ils ne s'éditent pas dans le code : on modifie la variable dans Figma, on
ré-exporte dans `tokens/*.tokens.json`, puis `npm run tokens`.

## Le dépôt et le site

| Quoi | Où |
| --- | --- |
| Dépôt | <https://github.com/Equipollente/UX-design-system> |
| Doc en ligne | <https://equipollente.github.io/UX-design-system/> |
| Serveur de dev | `npm run dev` → <http://localhost:4321/UX-design-system/> |

| Page | URL |
| --- | --- |
| Sommaire | `/` |
| Fondations | `/foundations` |
| Icônes | `/icons` |
| Composants | `/components` |
| Formulaire | `/formulaire` |

## Construire un lien Figma à la main

- **Design** : `https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=<id>`
- **Prototype** : `https://www.figma.com/proto/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=<id>&starting-point-node-id=<id-encodé>`

Dans une URL, l'identifiant de nœud s'écrit avec un tiret (`45-388`) ; l'API et les outils l'écrivent
avec deux-points (`45:388`). C'est le même nœud.
