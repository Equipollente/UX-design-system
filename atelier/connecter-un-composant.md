# Connecter un composant à Figma (Code Connect)

Faire apparaître le vrai code d'un composant — `<LabelCounter label="…" variant="…" />` — dans le
panneau Inspect de Figma, en mode Dev. Rien ici n'est une valeur ni un nom de prop : ce fichier
décrit un ordre d'opérations. Les noms viennent de Figma et du `interface Props` du `.astro`.

Le modèle à copier est [design-system/figma/composant.gabarit.txt](../design-system/figma/composant.gabarit.txt).
Un exemple qui marche : `design-system/figma/LabelCounter.figma.ts`.

## Ce que ça ne fait pas

- Le lien passe **par Figma, pas par GitHub**. La commande de publication envoie le gabarit
  directement ; le dépôt ne sert qu'à garder les gabarits pour republier.
- L'interface « Connect components to code » de Figma **ne sert pas** : elle refuse le `.astro`, et
  même acceptée elle n'affiche que le nom du fichier, jamais le code. On passe par la commande.
- Un jeton Figma ne s'écrit **jamais** dans un fichier, un commit ni une conversation. Il se tape
  dans le terminal, au moment de publier.

## Avant la première fois

Un jeton d'accès personnel, créé dans Figma : profil → Settings → Security → Personal access tokens.
Deux droits seulement : lecture du contenu des fichiers, et « Write and change component code ».
Le copier à la création : Figma ne l'affiche qu'une fois.

## Le geste

**1. Le lien du composant.** Dans Figma, sélectionner le **jeu de variantes entier** (le cadre qui
les contient toutes), clic droit → *Copy link to selection*. Une variante seule est refusée.
Vérifier que c'est bien le composant actuel : un nœud noté dans LINKS.md peut avoir été remplacé.

**2. Copier le gabarit.** `composant.gabarit.txt` → `design-system/figma/<Nom>.figma.ts`, où `<Nom>` est
le nom du composant **tel qu'il s'écrit dans Figma** (`Label-subtle`, pas `Label`) : c'est ce nom qu'on
cherche dans l'interface de Figma, et un jeu Figma = un fichier.

**3. Le remplir.**
- Les noms entre guillemets viennent de Figma : le panneau de droite en mode Dev les liste, avec
  leur casse exacte, « ? » compris.
- Les noms après le deux-points viennent de l'`interface Props` du `.astro`.
- Une variante : lister **toutes** ses valeurs. Une valeur oubliée donne un code vide.
- Une propriété Figma sans prop dans le code : on ne l'écrit pas.
- Les états (hover, pressed…) et les icônes : omis, voir le gabarit.

**4. Vérifier sans rien publier.**
```
cd design-system
npx figma connect parse
```
Doit citer le fichier et son lien Figma, sans erreur. Puis `npm run check` à la racine.

**5. Publier ce seul fichier.**
```
npx figma connect publish --token=<JETON> --file figma/<Nom>.figma.ts
```
Le jeton se colle ici, dans le terminal. `--file` évite de republier ce que d'autres sessions ont
laissé dans le dossier.

**6. Voir le résultat.** Recharger Figma (F5), mode Dev, sélectionner une instance : la ligne
« Code Connect » du panneau Inspect affiche « Connected » et le code. Le bouton « View connection »
ouvre l'interface, qui n'affiche pas ces liens : c'est normal.

## Les règles pour que tous les gabarits se ressemblent

Un gabarit se génère, il ne s'invente pas : à partir des mêmes entrées, on obtient le même fichier.
Les entrées sont deux : les propriétés du jeu de variantes dans Figma (`get_context_for_code_connect`
du MCP Figma les donne avec leur type), et l'`interface Props` du `.astro`.

**Un jeu de variantes Figma = un fichier = un nœud, et Figma a la même forme que le code.** Une prop
du code est une propriété du jeu, pas une différence de nom entre deux jeux : deux jeux `X-subtle` et
`X-bold` pour une prop `emphasis` sont à fondre en un seul jeu à propriété `emphasis`, sans quoi rien
ne dit à Figma, ni à l'aperçu de l'interface, que la prop existe. Deux jeux qui sont deux composants
distincts dans le code pointent chacun vers leur `.astro`.

**Le nom du fichier est le nom Figma**, avec sa casse et ses tirets : `<NomFigma>.figma.ts`.
`id` est ce nom en minuscules avec des tirets, et il est unique dans le dossier.

**L'en-tête est toujours le même, dans cet ordre :** `url`
(le lien du jeu, avec le tiret : `node-id=1046-30984`), `source` (chemin du `.astro` depuis la racine
du dépôt), `component` (nom du composant du code).

**Les propriétés se lisent dans l'ordre où le code les déclare :** le texte, puis les variantes, puis
les interrupteurs. Le type Figma décide de la méthode :

| Type dans Figma | Méthode | Dans le code |
|---|---|---|
| texte | `getString` | prop texte |
| variante | `getEnum`, **toutes** les valeurs | prop à valeurs |
| interrupteur | `getBoolean` | prop booléenne, seulement si elle existe |
| icône | **omise** | voir ci-dessous |

**Ce qu'on omet, toujours, et pourquoi :**
- les états (`state` : hover, pressed, disabled, focus) — ce sont des états CSS ;
- les icônes — Figma ne donne que le nom du calque (« Icon »), pas celui de l'icône, donc le code
  afficherait un nom faux ;
- toute propriété Figma qui n'a pas de prop dans le `.astro`.

**L'import** s'écrit `import <Nom> from "ux-design-system/components/<Nom>.astro"` : c'est ce que
voit un site qui consomme le paquet.

## Les pièges déjà payés

| Message ou symptôme | Cause |
|---|---|
| « node is not a top level component or component set » | le lien vise une variante, pas le jeu entier |
| « Cannot publish Astro; the active framework is Web Components » | l'étiquette de `figma.config.json` doit être celle du framework actif chez Figma (un seul sur le forfait Pro) |
| Rien ne s'affiche sur un composant | le lien vise un ancien nœud, ou la bibliothèque n'est pas republiée |
| Une valeur de variante donne un code vide | une valeur manque dans `getEnum` |
| `check` : « Cannot find module 'figma' » | `design-system/tsconfig.json` doit déclarer `"types": ["@figma/code-connect/figma-types"]` |

## Quand une prop change

Le gabarit est une copie des noms : si une prop est renommée dans le `.astro` ou une propriété dans
Figma, le gabarit ment sans prévenir. Le corriger et republier (étapes 3 à 5).
