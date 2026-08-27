## Liens

Fichier Figma, nœuds des composants, variables : [LINKS.md](LINKS.md). À tenir à jour quand un
composant s'ajoute.

## L'atelier

`atelier/` tient les gestes : ajouter un composant, en modifier un, ajouter une icône ou un token.
Il ne détient aucune valeur — il dit où aller et dans quel ordre. Voir
[atelier/README.md](atelier/README.md).

Une intervention se demande en **brief** — gabarit dans [atelier/brief.md](atelier/brief.md).
Ses sept lignes ne décrivent pas le travail : chacune ferme une vérification qu'il faudrait faire
de toute façon, plus cher. `OBJET` évite de traduire des mots en fichiers, `POUR QUI` dit s'il faut
intégrer et sous quelle forme, `FIGMA` dit où est la vérité.

L'ordre de lecture compte autant que le brief : les vérifications bon marché — l'arbre, l'objet, le
périmètre, la source — passent **avant** toute lecture longue, et la section de doc d'un composant
se lit avant son fichier.

**Avant d'intervenir sur le système**, lire la procédure correspondante. Si aucune ne correspond,
faire — et n'en écrire une que si le geste se répétera. Même politique que les variantes.

**Une procédure ne se met pas à jour par précaution.** Elle gagne une ligne quand un détour a été
payé : quelque chose qu'on aurait voulu savoir avant de commencer. Sinon on n'y touche pas.

Un arbitrage structurant s'ajoute à `atelier/decisions.md` ; un écart qui appelle un geste dans
Figma, à `atelier/arbitrages.md`. Le reste du récit reste dans les messages de commit, qui le
portent déjà — **il n'y a pas de journal à tenir.**

## Ce qu'est ce dépôt

Le design system de Judith Heckmann, et rien d'autre. Les sites qui le consomment — à commencer par
le portfolio — vivent ailleurs. Cette séparation est la règle du projet : **aucun fichier d'ici ne
doit connaître un site consommateur**. Ce qui est propre à une page (liste de liens, page courante,
textes, chemins d'images) se passe en props ; un composant qui connaîtrait les pages d'un site ne
serait plus un composant.

- `src/design-system/` — le système : `components/`, `layouts/`, `lib/`, `styles/` + `data/`
  (générés depuis `tokens/` par `npm run tokens`) et `icons/` + `lib/icons.ts` (générés depuis
  `icons/` par `npm run icons`).
- `src/pages/` — la doc du système, qui est aussi le site publié : `/`, `/foundations`, `/icons`,
  `/components`. Elle est le premier consommateur du système, et à ce titre la première à trahir
  une régression.

## Les tokens ne s'écrivent pas dans le code

La source de vérité est Figma. Les 122 variables sont exportées dans `tokens/*.tokens.json` (4 modes :
Desktop, Tablet, Mobile, Paper), puis `npm run tokens` en fait `styles/tokens.css` et `data/tokens.json`.

Si une valeur paraît fausse, la correction va **dans Figma**, puis dans l'export — jamais en dur dans
un composant. Les deux fichiers générés sont versionnés parce que `npm run dev` ne lance pas
`npm run tokens` : un clone frais serait cassé sans eux.

## Les icônes ne s'écrivent pas non plus dans le code

Même contrat que les tokens, même raison. Les 17 icônes sont les composants de la page Figma
`Icons` (`45:395`), exportés dans `icons/` **au niveau du composant et non du vecteur** — sans quoi
la `viewBox` n'est pas celle de la frame 24 × 24, et le script refuse le fichier. `npm run icons` en
fait `src/design-system/icons/*.svg` (nettoyés) et `src/design-system/lib/icons.ts` (le registre
typé). Les deux sont versionnés, pour la même raison que `tokens.css`.

Une icône est alors un nom, pas un chemin : `<Button icon="mail-edit">`. Le nom se vérifie à la
compilation. Aucun `<img>`, aucune URL, donc aucun `withBase()` — et les fichiers ne portent que
`currentColor` : c'est le contexte qui décide de la couleur. Ne jamais retoucher un SVG de
`src/design-system/icons/` : il est régénéré. Ajouter une icône, c'est déposer l'export dans
`icons/` et relancer.

## Les URLs absolues passent par withBase()

Le site est publié sur GitHub Pages sous `/UX-design-system/`, pas à la racine d'un domaine. Astro
applique ce préfixe au routage mais **ne réécrit pas** les URLs écrites à la main. Tout chemin absolu
— asset de `public/` comme lien vers une page — passe donc par `withBase()`
(`src/design-system/lib/url.ts`). Un `/images/avatar.png` laissé tel quel marche en local et donne
un 404 en ligne : c'est une erreur qui ne se voit pas en développement. Les icônes, elles, n'en
relèvent plus : inlinées, elles n'ont pas d'URL.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Pour vérifier ce qui sera réellement publié, c'est `npm run build && npm run preview` qu'il faut :
le préfixe `base` ne s'observe pas autrement.

`npm run check` type les fichiers `.astro`, ce que `npm run build` ne fait pas. C'est lui qui refuse
un nom d'icône inconnu ou une prop qui n'existe pas — à lancer avant de pousser.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Deploying to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
