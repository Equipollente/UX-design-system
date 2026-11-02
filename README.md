# UX design system

Le design system de [Judith Heckmann](https://github.com/Equipollente) — 149 tokens exportés de Figma et
les composants qui en sont faits. La documentation est le site lui-même, et elle montre les
composants en vrai plutôt qu'une copie de leur markup : si un composant change, la page change.

**→ [Voir la documentation en ligne](https://equipollente.github.io/UX-design-system/)**

| | |
| --- | --- |
| [Fondations](https://equipollente.github.io/UX-design-system/foundations) | 121 tokens : couleur, typographie, espacement, rayon, contrôle, trait, opacité, ombre, mouvement, ratio et layout. Chaque valeur affichée est lue dans sa variable CSS. |
| [Composants](https://equipollente.github.io/UX-design-system/components) | Button, Tag, Nav, CardDefault, la fiche, la carte d'étude de cas avec son en-tête et son carrousel, et la modale. Doctrine d'usage, états, props. |
| [Formulaire](https://equipollente.github.io/UX-design-system/formulaire) | FieldLabel — le libellé que tous les champs partagent — puis Text field, Select, Radio, Checkbox, Toggle, Text Area, Chip, Add Image et Edit Image Gallery. |

## La source de vérité est Figma

Les valeurs ne s'écrivent pas dans le code. Elles vivent dans la collection **Design tokens** du
[fichier Figma](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system), en quatre
modes — Desktop, Tablet, Mobile, Paper — et suivent cette chaîne :

```
Figma  →  tokens/*.tokens.json  →  npm run tokens  →  src/design-system/styles/tokens.css
                (export)                                src/design-system/data/tokens.json
```

Rien n'est écrit en dur dans un composant. Si une valeur paraît fausse, la correction va dans Figma,
puis dans l'export. `data/tokens.json` alimente la doc, qui affiche donc les tokens réels et non une
liste tenue à la main.

## Structure

```
src/design-system/     le système
  components/          affichage : Button, Card, CardDefault, Carousel, CaseStudyCard,
                       CaseStudyHeader, CaseStudyList, Icon, Intro, Modal, Nav, Tag
                       formulaire : FieldLabel, TextField, Select, Radio, Checkbox,
                       Toggle, TextArea, Chip, AddImage, EditImageGallery
  layouts/             BaseLayout (coquille HTML nue), DocsLayout (doc)
  lib/                 withBase(), le préfixe d'URL du déploiement
  styles/ data/        générés — ne pas éditer à la main
src/pages/             la doc : /, /foundations, /icons, /components, /formulaire
tokens/                les exports Figma, un par mode
scripts/               build-tokens.mjs
```

Aucun fichier du système ne connaît le site qui l'emploie : liens, page courante, chemins d'images
tombent tous des props. C'est ce qui permet de le consommer depuis n'importe quel projet.

## Commandes

| Commande | Effet |
| --- | --- |
| `npm install` | Installe les dépendances (Node ≥ 22.12) |
| `npm run dev` | Serveur de développement |
| `npm run tokens` | Régénère `tokens.css` et `tokens.json` depuis `tokens/` |
| `npm run build` | Régénère les tokens puis construit le site dans `dist/` |
| `npm run preview` | Sert `dist/` — le seul moyen de voir le site tel qu'il sera publié |

## Déploiement

GitHub Pages, à chaque push sur `main`, via [le workflow](.github/workflows/deploy.yml).

Le site est servi sous `/UX-design-system/` et non à la racine d'un domaine. Astro applique ce
préfixe au routage mais ne réécrit pas les URLs écrites à la main : **tout chemin absolu passe par
`withBase()`**. Un `/icons/x.svg` laissé tel quel fonctionne en local et renvoie un 404 en ligne —
d'où `npm run preview` avant de pousser.
