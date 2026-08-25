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
| Icon (les 11 icônes) | [`45-395`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=45-395) | [Icon.astro](src/design-system/components/Icon.astro), registre généré dans [icons.ts](src/design-system/lib/icons.ts) |
| Button (jeu de variantes) | [`21-47`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=21-47) | [Button.astro](src/design-system/components/Button.astro) |
| Nav (jeu de variantes) | [`142-1458`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=142-1458) | [Nav.astro](src/design-system/components/Nav.astro) |
| Avatar-Button | [`45-703`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=45-703) | prop `home` de Nav |
| Tag | [`19-12`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=19-12) | [Tag.astro](src/design-system/components/Tag.astro) |
| Case Study Card | [`88-131`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=88-131) | [CaseStudyCard.astro](src/design-system/components/CaseStudyCard.astro) |
| Section Header (en-tête de la carte) | [`88-74`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=88-74) | [CaseStudyHeader.astro](src/design-system/components/CaseStudyHeader.astro) |
| Carousel | [`88-85`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=88-85) | [Carousel.astro](src/design-system/components/Carousel.astro) |
| Section.Intro | [`209-2348`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=209-2348) | [Intro.astro](src/design-system/components/Intro.astro) |
| Case Study Card en situation | [`176-1248`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=176-1248) | — |
| Case Study List | [`222-814`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=222-814) | [CaseStudyList.astro](src/design-system/components/CaseStudyList.astro) |
| Page HP (la pile en situation, 3 états) | [`222-1168`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=222-1168) | [templates/home.astro](src/pages/templates/home.astro) |

La section Figma qui porte les trois derniers : [`176-1236`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=176-1236) — *Case Study Cards Components*.

Le composant Figma s'appelle « Section Header » mais tout ce qu'il contient est propre à une étude
de cas : le code le nomme `CaseStudyHeader`. Renommage à trancher côté Figma.

Même décalage sur `Section.Intro`, pour une autre raison : le préfixe `Section.` est une convention
de rangement du fichier Figma, pas une partie du nom de l'objet. Le code le nomme `Intro`.

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
| Les deux ombres | `--carousel-item-shadow`, `--card-shadow` | Des tokens, le jour où une troisième apparaît |
| Le point de rupture (`767px`) | six media queries dans `src/`, plus `build-tokens.mjs` | Une variable de build, pas un token CSS : une custom property ne peut pas figurer dans une media query |

Les composants Figma pas encore intégrés : `Cards/UXVision`, `Cards/Metric Highlight`,
`Cards/User Quote`, `Research Finding`, `Role` — tous sur la page Components.

### Variables

`nav/height` ([`234-1222`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system)) porte
la hauteur de la barre collée : 88 en Desktop, Tablet et Paper, 72 en Mobile. C'est le seul token du
groupe `nav`, et le premier qui varie par mode en dehors de `layout`. Il double une valeur qui vit
aussi dans le padding de `.nav-bar` — changer l'un demande de reprendre l'autre, et les deux
fichiers se renvoient l'un à l'autre en commentaire.

Les 116 tokens vivent dans la collection **Design tokens** du même fichier, en 4 modes (Desktop,
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

## Construire un lien Figma à la main

- **Design** : `https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=<id>`
- **Prototype** : `https://www.figma.com/proto/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=<id>&starting-point-node-id=<id-encodé>`

Dans une URL, l'identifiant de nœud s'écrit avec un tiret (`45-388`) ; l'API et les outils l'écrivent
avec deux-points (`45:388`). C'est le même nœud.
