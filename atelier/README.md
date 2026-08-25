# L'atelier

L'arrière-boutique du design system : les gestes qu'on refait, et ce qu'il faut savoir avant de
les refaire. `src/pages/` est la vitrine — ce que le système donne à voir. Ici, c'est l'établi.

Ce dossier est versionné mais n'est ni publié sur le site (Astro ne rend que `src/pages/`), ni
expédié aux sites consommateurs (`files` de [package.json](../package.json) n'emporte que
`src/design-system`).

## La règle : il ne détient rien

C'est le seul vrai risque d'un dossier comme celui-ci — devenir une seconde source de vérité qui
périme en silence, et faire perdre le temps qu'il prétend faire gagner. La règle ne tient pas à la
discipline mais à la nature de ce qu'on a le droit d'y écrire.

**Un geste** — une suite d'actions, un ordre d'opérations, une condition d'entrée — ne périme pas.
« Recopier l'`interface Props` dans le tableau de la doc » reste vrai quand les props changent.

**Un état** — une valeur, un nom de prop, une liste, un nombre — périme toujours, et sans prévenir.

L'atelier n'écrit que des gestes. Quand il doit désigner un état, il donne le chemin du fichier qui
le détient. Le test, à chaque phrase écrite ici : *si je change quelque chose dans Figma ou dans un
composant, est-ce que cette phrase devient fausse ?* Si oui, elle est à réécrire en pointeur.

Deux exceptions assumées, et il n'y en a pas d'autres : `decisions.md`, parce qu'un fait daté ne
périme pas ; et l'étiquette de six mots d'une ligne d'`arbitrages.md`, qui renvoie au texte plutôt
que de le recopier.

## Où c'est vraiment

| Ce qu'on cherche | Où ça vit |
|---|---|
| La valeur d'un token | Figma, puis `tokens/*.tokens.json`, puis `npm run tokens` |
| Les props d'un composant | son `interface Props`, dans son `.astro` |
| Ce qu'un composant est, et n'est pas | le pavé en tête de son `.astro` |
| Sa surface publique documentée | sa section dans [components.astro](../src/pages/components.astro) |
| Le nœud Figma d'un composant | [LINKS.md](../LINKS.md) |
| Le détail d'un écart avec la maquette | son `<p class="flag">` dans la doc |
| Le pourquoi d'une décision de code | son message de commit |
| Le récit d'une intervention | `git log` — il n'y a pas de journal ici |

## Les fichiers

| Fichier | Quand l'ouvrir |
|---|---|
| [conventions.md](conventions.md) | avant d'écrire une ligne de composant |
| [ajouter-un-composant.md](ajouter-un-composant.md) | un nœud Figma devient un `.astro` |
| [modifier-un-composant.md](modifier-un-composant.md) | on touche à un composant existant |
| [ajouter-une-icone-ou-un-token.md](ajouter-une-icone-ou-un-token.md) | la source Figma a bougé |
| [decisions.md](decisions.md) | « pourquoi c'est fait comme ça ? » |
| [arbitrages.md](arbitrages.md) | on ouvre Figma pour trancher |

## Condition d'arrêt

Si dans trois mois ce dossier n'a servi à personne — aucune procédure relue, aucune ligne ajoutée —
il se supprime. Ce serait une information, pas un échec.
