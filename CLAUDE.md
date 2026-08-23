## Liens

Fichier Figma, nœuds des composants, variables : [LINKS.md](LINKS.md). À tenir à jour quand un
composant s'ajoute.

## Ce qu'est ce dépôt

Le design system de Judith Heckmann, et rien d'autre. Les sites qui le consomment — à commencer par
le portfolio — vivent ailleurs. Cette séparation est la règle du projet : **aucun fichier d'ici ne
doit connaître un site consommateur**. Ce qui est propre à une page (liste de liens, page courante,
textes, chemins d'images) se passe en props ; un composant qui connaîtrait les pages d'un site ne
serait plus un composant.

- `src/design-system/` — le système : `components/`, `layouts/`, `lib/`, et `styles/` + `data/`
  (générés depuis `tokens/` par `npm run tokens`).
- `src/pages/` — la doc du système, qui est aussi le site publié : `/`, `/foundations`,
  `/components`. Elle est le premier consommateur du système, et à ce titre la première à trahir
  une régression.

## Les tokens ne s'écrivent pas dans le code

La source de vérité est Figma. Les 115 variables sont exportées dans `tokens/*.tokens.json` (4 modes :
Desktop, Tablet, Mobile, Paper), puis `npm run tokens` en fait `styles/tokens.css` et `data/tokens.json`.

Si une valeur paraît fausse, la correction va **dans Figma**, puis dans l'export — jamais en dur dans
un composant. Les deux fichiers générés sont versionnés parce que `npm run dev` ne lance pas
`npm run tokens` : un clone frais serait cassé sans eux.

## Les URLs absolues passent par withBase()

Le site est publié sur GitHub Pages sous `/UX-design-system/`, pas à la racine d'un domaine. Astro
applique ce préfixe au routage mais **ne réécrit pas** les URLs écrites à la main. Tout chemin absolu
— asset de `public/` comme lien vers une page — passe donc par `withBase()`
(`src/design-system/lib/url.ts`). Un `/icons/x.svg` laissé tel quel marche en local et donne un 404
en ligne : c'est une erreur qui ne se voit pas en développement.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Pour vérifier ce qui sera réellement publié, c'est `npm run build && npm run preview` qu'il faut :
le préfixe `base` ne s'observe pas autrement.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Deploying to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
