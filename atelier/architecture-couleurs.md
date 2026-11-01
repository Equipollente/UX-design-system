# Architecture des couleurs — cible

Proposition, pas décision. Elle remplace l'espace plat `color/` (81 variables, primitives et rôles
mêlés) par deux collections. Si elle est retenue, ses arbitrages structurants passent dans
[decisions.md](decisions.md) et ses écarts côté Figma dans [arbitrages.md](arbitrages.md).

**Aucune valeur n'est écrite ici qui n'existe déjà dans Figma.** Ce qui manque est marqué
`À DÉFINIR` : c'est à Judith de le dessiner dans Figma, puis d'exporter.

## Les quatre règles

1. **Un composant ne lit que des rôles.** Jamais une marche de rampe. Aujourd'hui `accent-500`
   est lu 24 fois, `neutral-100` 15 fois, `accent-600` 11 fois directement dans les composants.
2. **Un rôle est un alias.** Une valeur brute n'existe que dans `Primitives`.
3. **Un fond coloré a son encre.** Chaque `bg` ou `solid` a un `text/on-…` dont le contraste est
   mesuré une fois, à la création.
4. **On n'ajoute un rôle que s'il est lu quelque part.** Pas de grille remplie d'avance.

Seuils : 4,5 pour le texte, 3 pour les bordures de contrôle, l'anneau de focus et les icônes.

---

## Collection 1 — `Primitives`

Un seul mode. Dans Figma elles s'appellent `ramp/<teinte>/<marche>` (`ramp/neutral/100`,
`ramp/white`) et sortent en CSS `--ramp-neutral-100` ; les tableaux ci-dessous écrivent
`neutral/100` pour abréger. Elles s'exportent à part, dans `tokens/Primitives.tokens.json`, et
`build-tokens.mjs` refuse de construire si des rôles les visent sans ce fichier.
**Aucun composant, aucun designer ne les applique** : portée vide (ou masquées à la
publication). C'est la différence qui empêche de re-sauter la couche des rôles.

| Rampe | Marches | État |
|---|---|---|
| `white` | 1 valeur, `#FFFFFF` | À créer (valeur déjà portée par `bg/default`) |
| `neutral` | 100–900 | Existe |
| `accent` | **25**, **50**, 100–900 | 25 = `#F3F0FF` et 50 = `#ECE1FF` sortent de `bg/surface` et `bg/section` (aujourd'hui des hex sans rampe). **Numérotation à confirmer.** |
| `highlight` | 100–900 | Existe (base à 200) |
| `clay`, `teal`, `sun`, `rose` | 100–900 | Existent |
| `red` | 100–900 | 500 `#DC2626`, 600 `#B91C1C`, 700 `#991B1B` existent (ex `feedback/danger`). **100, 200, 300, 400, 800, 900 : À DÉFINIR** |
| `green` | 100–900 | 500 `#48A66B` existe (ex `feedback/success`). **Les autres marches : À DÉFINIR** |

Total : 8 rampes de 9 marches + `accent` à 11 + `white` = 84 primitives.

---

## Collection 2 — `Semantic`

Un seul mode tant que le système n'a pas de second thème : les quatre modes actuels (Desktop,
Tablet, Mobile, Paper) portent des couleurs **strictement identiques**. Les noms de variables CSS
ne changent pas pour les rôles qui existent déjà.

Portées : `bg/*` → remplissages de cadre et de forme ; `text/*` → texte ; `border/*` → contours ;
`action/*` → remplissages ; `feedback/*/text` → texte, les autres → remplissage et contour.

### `bg` — le fond

| Token | Alias | Rôle |
|---|---|---|
| `bg/default` | `white` | Le sol de la page |
| `bg/surface` | `accent/25` | Cartes, champs, dialogues |
| `bg/section` | `accent/50` | Une région entière, jamais une carte |
| `bg/feature` | `accent/500` | Panneau indigo plein cadre |
| `bg/celebrate` | `highlight/200` | Panneau citron, réservé à la célébration |

### `text` — l'encre

| Token | Alias | Mesure |
|---|---|---|
| `text/default` | `neutral/900` | 13,67 sur le sol |
| `text/muted` | `neutral/600` | 5,56 sol · 4,96 surface · **4,45 section ✗** (voir arbitrage 2) |
| `text/accent` | `accent/500` | 7,00 sol |
| `text/disabled` | `neutral/500` | 2,41 — exempté (état inactif), jamais pour du contenu |
| `text/on-accent` | `white` | 7,00 sur `accent/500` · 8,24 sur `accent/600` |
| `text/on-accent-soft` | `accent/100` | 4,86 sur `accent/500` |
| `text/on-highlight` | `neutral/900` | 12,32 sur `highlight/200` |
| `text/on-danger` | `white` | 4,83 sur `red/500` · 6,47 sur `red/600` |
| `text/on-success` | `neutral/900` | 4,52 sur `green/500` (valeur de l'ancienne description) |
| `text/on-warning` | `neutral/900` | À mesurer sur `sun/400` |

`text/placeholder` n'est pas créé : il vaudrait `text/muted`. Un doublon n'est pas un rôle.

### `border` — le trait

| Token | Alias | Mesure / rôle |
|---|---|---|
| `border/subtle` | `accent/100` | 1,44 — **décoratif**, ne sépare jamais seul deux contenus. Reprend l'actuel `border/default` |
| `border/default` | `accent/100` | Inchangé tant que les 43 lectures ne sont pas migrées (voir Migration) |
| `border/control` | `accent/400` | Le contour visible d'un champ, d'une case, d'un chip : 4,66 sol · 4,15 surface · 3,72 section. Arbitré : `accent/300` (3,23 sol) échouait sur surface et section |
| `border/strong` | `neutral/300` | 1,29 — cadre de photographie. **Nom trompeur, voir arbitrage 1** |
| `border/focus` | `accent/500` | 7,00 sur le sol |
| `border/focus-on-accent` | `white` | 7,00 sur `accent/500` (l'anneau actuel y est invisible : 1,00) |
| `border/danger` | `red/500` | 4,83 sur le sol — champ en erreur |

### `action` — ce qui se presse

Les états ne se lisent plus dans la rampe : ils se décident ici, une fois. Les valeurs reprennent
exactement ce que `Button.astro` écrit aujourd'hui.

| Variante | `bg` | `bg-hover` | `bg-pressed` | texte |
|---|---|---|---|---|
| `action/primary` | `accent/500` | `accent/600` | `accent/700` | `text/on-accent` |
| `action/secondary` | `bg/surface` | `accent/100` | `accent/200` | `text/default` |
| `action/destructive` | `red/500` | `red/600` | `red/700` | `text/on-danger` |

`bg-disabled` : commun aux trois, `neutral/200` (**à valider** — pas lu dans `Button.astro`
aujourd'hui). La variante tertiaire/ghost de `Button` suit le même schéma que `secondary` ; à
confirmer en relisant le composant avant de la déclarer.

### `feedback` — l'état du système

Chaque famille a quatre rôles : `bg` (teinte pâle), `border`, `text`, `solid` (pastille, icône,
remplissage fort). Le texte se pose sur son propre `bg` **et** sur le sol.

| Famille | `bg` | `border` | `text` | `solid` |
|---|---|---|---|---|
| `success` | `green/100` | `green/300` | `green/800` | `green/500` |
| `warning` | `sun/100` | `sun/300` | `sun/800` (7,74 sur `sun/100`) | `sun/400` |
| `danger` | `red/100` | `red/300` | `red/800` | `red/500` |
| `info` | `teal/100` | `teal/300` | `teal/800` (8,00 sur `teal/100`) | `teal/500` |

`success` et `danger` attendent les marches `À DÉFINIR` de leurs rampes. Contrôle à faire à la
création : chaque `text` ≥ 4,5 sur son `bg` **et** sur `bg/default`.
`warning/border` (`sun/300`, 1,43) et les `border` des quatre familles sont décoratifs : un champ en
erreur utilise `border/danger`, pas `feedback/danger/border`.

### `category` — les familles décoratives

`clay`, `teal`, `sun` et `rose` sont aujourd'hui des rampes sans rôle, **aucune n'est lue dans
`src/`**. Leurs descriptions disent déjà l'usage : 100 = fond de tag ou de mémo, 300 = bordure de
carte mémo, 800 = texte sur le 100.

| Token | Alias |
|---|---|
| `category/clay/bg` · `border` · `text` | `clay/100` · `clay/300` · `clay/800` |
| `category/teal/…` | `teal/100` · `teal/300` · `teal/800` |
| `category/sun/…` | `sun/100` · `sun/300` · `sun/800` |
| `category/rose/…` | `rose/100` · `rose/300` · `rose/800` |

Si aucun composant (Tag, Chip, cartes mémo) ne les lit à l'arrivée, les rampes sortent de
`Primitives` pour rejoindre une collection à part, comme la palette DSFR.

---

## Rôles ajoutés à l'usage

Nés de l'inventaire des lectures de rampe restantes dans les composants (règle 4 : un rôle existe
parce qu'il est lu). Tous à valeur identique à la lecture qu'ils remplacent.

| Rôle | Alias | Lu par |
|---|---|---|
| `action/ghost/bg-hover` | `neutral/100` | Checkbox, Radio, Chip, Select (survol d'une ligne ou d'une case) |
| `text/accent-hover` | `accent/600` | AddImage (libellé survolé) |
| `bg/neutral` | `neutral/100` | TabList, TabPanel |
| `bg/selection` | `accent/100` | `::selection` de global.css |
| `category/accent·highlight·neutral/{bg,border,text}` | `100` · `300` · `800` | Tag |
| `feedback/danger/solid`, `feedback/success/solid` | `red/500`, `green/500` | FieldLabel, AddImage, Modal (rouge plein en texte court ou en icône) |

Et, pour les lectures qu'aucun rôle existant ne couvrait sans changer une couleur :

| Rôle | Alias | Lu par |
|---|---|---|
| `text/secondary` | `neutral/700` | Modal (corps du dialogue, tel que Figma le lie) |
| `border/accent` | `accent/500` | Tag (liseré qui suit `--tag-color`) |
| `border/hover` | `neutral/500` | champs survolés (global.css) |
| `action/toggle/bg-off` | `neutral/300` | Toggle éteint — 1,29:1, écart noté dans arbitrages.md |
| `progress/track`, `progress/fill` | `neutral/400`, `accent/300` | AddImage |

`feedback/*/solid` n'était pas bloqué par les anciens noms, contrairement à ce qui était écrit plus
haut : `feedback/success` sort en `$root` et `build-tokens.mjs` le garde.

## Pas maintenant (règle 4)

`data-viz/series-*`, `state/hover-overlay`, `utility/scrim`, `bg/inverse`, tout mode sombre : aucun
besoin lu dans le code. À ajouter le jour où un composant les demande.

## Arbitrages ouverts — à Judith

1. **`border/strong`.** Le nom promet un trait fort, la valeur (1,29) est plus pâle que
   `border/default`. Soit on renomme en `border/frame` (c'est ce que la description dit), soit on
   en fait le trait fort. Un renommage casse les 3 lectures actuelles.
2. ~~`border/control`, ≥ 3.~~ **Tranché : `accent/400`**, seul pas existant qui passe sur le sol, la
   surface et la section.
3. **`text/muted` sur `bg/section`** : 4,45. Soit `text/muted` passe à `neutral/700` (7,27 sur
   section, 8,11 sur surface), soit on reste à « grand texte seulement » sur section.
4. **Numérotation** de `accent/25` et `accent/50`.

## Migration — sans rien casser

Les noms de variables CSS sont une API publique (le portfolio les consomme) : tout retrait est un
changement majeur.

1. **Figma** : créer `Primitives` (avec `white`, `red`, `green`, `accent/25`, `accent/50`), y
   re-pointer les rampes existantes, puis rendre `Semantic` alias de `Primitives`. Aucune valeur
   ne change.
2. **Figma** : ajouter les rôles nouveaux (`action`, `feedback`, `category`, `border/*`,
   `text/on-*`). Ancien et nouveau coexistent.
3. **Export** : `npm run tokens`. Les noms existants restent produits.
4. **Code** : remplacer, composant par composant, les ~75 lectures de primitives par des rôles
   (`Button` en premier : ses 11 lectures d'`accent-600` deviennent `action/primary/bg-hover`).
   `npm run check` et la doc `/foundations` détectent les régressions.
5. **Retrait** : `feedback/danger/*` et `feedback/success` (déplacés vers `red`/`green` et
   `feedback/*`) quittent l'espace `color/` dans une version majeure.

## Garde-fou

`npm run tokens` calcule la matrice de contraste de chaque paire `text/*` × `bg/*` et de chaque
`border/*` × `bg/*`, et échoue sous le seuil. Les chiffres cessent alors de vivre dans les
descriptions Figma (où ils périment : « 4,45:1 », « 33 endroits », « depuis le 27/08 ») : la
description garde l'usage, le build garde la mesure.
