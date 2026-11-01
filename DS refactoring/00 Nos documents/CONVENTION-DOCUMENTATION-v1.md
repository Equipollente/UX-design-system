# Convention de documentation — v1 (brouillon)

Première version, construite à partir des conventions de la documentation d'Astro
(dépôt `contribute.docs.astro.build` : style d'écriture, recettes, échantillons de code, composants
personnalisés, références d'API, guides de migration, revue de PR, documentation des changements).

Chaque section indique sa **source** : `Astro : <page>` quand la règle est reprise ou adaptée,
`Proposition` quand elle est ajoutée pour le design system. Les points à trancher sont rassemblés
en fin de document (§ 13).

Ce document est rédigé à l'infinitif et sans pronom, pour ne pas préjuger du choix tu / vous (§ 13).

---

## 1. Principe

Une doc aide **quelqu'un à faire quelque chose**, puis le laisse retourner à son projet.

- Documenter **comment construire avec le système**, pas comment le système est construit.
- Une page répond à une question d'un lecteur précis. Elle se lit seule.
- Une information a **un seul foyer**. Ailleurs, renvoyer par un lien.
- Une doc fausse est pire qu'une absence de doc : ce qui peut être déduit du code ou de Figma est
  **généré**, jamais recopié.

Source : Astro : *why-we-doc* (« how to build with Astro, not how Astro is built »). Le reste est une proposition.

## 2. Deux publics, deux endroits

| Public | Où | Contenu |
|---|---|---|
| Ceux qui **utilisent** le système | Le site (`site/`) | Principes, démarrer, fondations, icônes, composants, guides, migrations |
| Ceux qui **font vivre** le système | `docs/contributing/` et la racine du dépôt | Architecture, contrat Figma, conventions de code, tests, versions, cette convention |

Ce qui bouge (briefs, arbitrages, suivi) n'est dans aucun des deux : c'est une **issue**.

Source : Astro tient la doc d'usage (`docs`) et la doc de contribution (`contribute.docs`) dans deux dépôts séparés. Le reste : proposition.

## 3. Types de page

Chaque page a un `type` dans son front matter et suit le gabarit de son type. Un type, un gabarit.

| `type` | Répond à | Gabarit (sections dans l'ordre) |
|---|---|---|
| `principe` | « Pourquoi le système est ainsi ? » | Énoncé court, conséquences, renvois |
| `fondation` | « Quelles valeurs ? » | Définition, valeurs (**générées**), usage, ce qu'il ne faut pas faire |
| `composant` | « Comment l'utiliser ? » | Voir § 3.1 |
| `guide` | « Comment faire X ? » | Voir § 3.2 |
| `reference` | « Que contient cette API ? » | Voir § 6 (**générée**) |
| `migration` | « Que changer en passant à la version N ? » | Voir § 9 |

### 3.1 Page de composant

1. **Introduction** : une phrase qui définit le composant (« Un bouton déclenche une action sur place. »).
2. **Quand l'utiliser** et **quand ne pas l'utiliser** (avec le composant à employer à la place).
3. **Variantes et états**, montrés avec le vrai composant, jamais une copie de son balisage.
4. **Accessibilité** : clavier, nom accessible, contraste.
5. **Props** : tableau **généré**.
6. **Exemple** de code complet et copiable (§ 5).
7. **Ajouté en** (version) et **statut**, affichés en tête, lus dans le code (§ 13).

Source : Astro : *recipe-writing* (introduction, prérequis, étapes), *new-feature-docs* (« what is it, what for, why, when (not), how »). Gabarit de composant : proposition.

### 3.2 Guide (« comment faire X »)

- Titre et description commencent par un **verbe** (« Charger les tokens », « Ajouter une icône »).
- Une phrase d'introduction : ce que le lecteur saura faire à la fin.
- `## Prérequis` : l'état de départ (« Un projet Astro existant »).
- `## Marche à suivre` : étapes numérotées, linéaires.
- `## Ressources` : liens externes, en fin de page.
- Un guide enseigne **une tâche**. Pas d'explication théorique, pas de récit.

Source : Astro : *recipe-writing*, inspiré de Diátaxis (how-to guides).

## 4. Front matter

Un seul front matter par page. Il a des **champs communs** et, pour une page de composant,
**trois blocs** : `design`, `dev`, `management`. Chaque rôle lit son bloc. Un champ n'existe qu'une fois.

Légende : ✍ écrit à la main · ⚙ généré à la construction du site, jamais saisi
(un champ ⚙ saisi à la main est refusé par la validation du schéma).

### 4.1 Champs communs (toutes les pages)

```yaml
title: Bouton
description: Déclenche une action sur place.   # ✍ une phrase ; verbe en tête pour un guide
type: composant                                # ✍ voir § 3
keywords: [bouton, action]                     # ✍ mots de recherche
```

Champ d'une page générée : `source` (chemin du fichier qui la produit), voir § 6.

### 4.2 Page de composant : trois blocs

```yaml
title: Bouton
description: Déclenche une action sur place.
type: composant
keywords: [bouton, action]

design:                                        # rôle design
  figma: https://www.figma.com/design/<fichier>/<nom>?node-id=<nœud>   # ✍ le composant dans Figma
  anatomy: [conteneur, libellé, icône]         # ✍
  variants: [primary, secondary]               # ⚙ depuis Props, contrôlé contre Figma
  states: [default, hover, focus, disabled]    # ⚙
  sizes: [sm, md]                              # ⚙
  modes: [Desktop, Tablet, Mobile, Paper]      # ✍ modes regardés
  alternatives: [LinkButton]                   # ✍ « quand ne pas l'utiliser » : l'objet à employer à la place
  contrast: checked                            # ✍ contraste vérifié sur les modes
  thumbnail: /images/thumbnails/button.png     # ✍ vignette de la galerie

dev:                                           # rôle dev
  source: design-system/src/components/Button/Button.astro     # ✍
  import: ux-design-system/components/Button/Button.astro      # ⚙ depuis les exports du paquet
  props: …                                     # ⚙ depuis l'interface Props
  slots: [default, icon]                       # ⚙
  tokens: [--color-action-bg, --color-action-text]             # ⚙ rôles lus par le CSS
  tests: design-system/src/components/Button/Button.test.ts    # ✍
  clientJs: none                               # ⚙ un script est-il embarqué ?
  a11y:                                        # ✍
    wcag: AA
    keyboard: [Tab, Entrée, Espace]
    role: button

management:                                    # rôle gestion du design system
  status: stable                               # ⚙ lu dans le code : experimental | stable | deprecated
  since: 0.2.0                                 # ⚙ @since du code
  updated: 2026-11-01                          # ⚙ depuis Git
  owner: Judith Heckmann                       # ✍
  brief: https://github.com/Equipollente/UX-design-system/issues/12   # ✍ issue d'origine
  changelog: CHANGELOG.md#bouton               # ✍
  replacedBy: null                             # ✍ si déprécié : le remplaçant
  removeIn: null                               # ✍ si déprécié : la version majeure de suppression
  figmaCodeGap: none                           # ✍ écart connu entre le dessin et le code (lien d'issue)
  reviewed: 2026-11-01                         # ✍ dernière revue de la page
  a11yAudit: 2026-10-20                        # ✍ dernier contrôle d'accessibilité
```

Règles :
- `tokens`, `variants` et `states` sont générés : le site les affiche dans la vue de chaque rôle qui en a besoin, sans les saisir deux fois.
- `status` et `since` viennent du code du composant, pas de la page : un statut écrit dans la page peut contredire le code sans que personne le voie.
- Champs obligatoires pour un composant : `title`, `description`, `type`, `design.figma`, `dev.source`, `management.owner`. Le schéma de la collection (`content.config.ts`) refuse la page sinon.
- Les liens `figma` et `source` pointent vers un endroit, pas vers un état : ils ne dérivent pas.

Source : Astro : champs `title`, `description`, `type`, `githubURL` des pages ; Figma, *Design systems 103* (contenus attendus par rôle : design, dev, maintenance) ; Primer Brand (champs `figma`, `source`, `keywords`, `thumbnail`). Les trois blocs : adaptation.

## 5. Style d'écriture

### Ton
- Phrases **neutres et factuelles**. Pas d'humour, pas de métaphore, pas de personnage.
- Ton calme, respectueux, rassurant. Ne rien présumer des connaissances du lecteur.
- Le point d'exclamation est rare : réservé à l'encouragement ou à une vraie surprise.
- Ne documenter que le système. Pour Figma, Astro ou CSS, renvoyer vers la source externe.

### Adresse au lecteur
- Présent. Ni « nous », ni « on », ni « je » : l'auteur n'est pas à côté du lecteur.
- Consignes à **l'impératif**. Le but ou la raison **avant** l'action.
- Éviter « vous devriez » (suscite le doute : est-ce obligatoire ?).
- Réserver « vous pouvez » à une **option** ou une permission. Une obligation s'énonce directement.

### Lisibilité
- Phrases et paragraphes courts, vocabulaire simple, peu de jargon.
- Développer les abréviations à la première occurrence.
- Titres et listes pour aérer. Voix active.

### Instructions à choix ouvert
Séparer la consigne de l'option retenue : donner d'abord l'action avec le critère, puis dire quel
choix l'exemple utilise.

> Ajouter le sélecteur de langue dans un composant affiché sur toutes les pages. L'exemple suivant
> l'ajoute au pied de page :

### Titres
- Titre de page = `h1`. Les sections commencent au `h2`, puis `h3`.
- Courts. Sans ponctuation finale. Les termes de code en `code`.

### Listes
- Liste à puces quand l'ordre est indifférent, numérotée pour des étapes.
- Si les éléments deviennent longs ou chargés de code : passer à des intertitres.

### Exemples dans le texte
- « Par exemple » en toutes lettres pour un exemple unique.
- Liste partielle : parenthèses avec « p. ex. ». Liste exhaustive : parenthèses sans « p. ex. ».

### Encadrés (note, astuce, attention)
- **À utiliser avec parcimonie** : ils encombrent et distraient.
- Une information essentielle va dans le texte, pas dans un encadré.
- `note` : complément hors flux. `astuce` : action utile mais non indispensable. `attention` : risque réel (perte de données, accessibilité cassée).
- Une citation seule prend un bloc de citation. Tout le reste est un encadré.

### Liens
- Texte de lien **descriptif** : jamais « ici », jamais le nom du site où l'on est déjà.
- Une description neutre et factuelle d'un outil tiers, sans langage commercial.

Source : Astro : *writing-style*, *reviewing-prs* (« Detailed Editing Suggestions »), *custom-components* (Aside, ReadMore).

## 6. Pages générées et pages écrites

| Généré (jamais écrit à la main) | Écrit |
|---|---|
| Tableaux de props, valeurs des tokens, galerie d'icônes, statut, version d'ajout, comptes | Principes, usage, « à faire / à ne pas faire », guides, migrations |

Règles :
- Une page générée porte un **avertissement visible** (« Page générée : ne pas modifier ici ») et un lien `source`
  vers le fichier qui la produit.
- Corriger la source, jamais la page.

### Format d'une entrée de référence (props)

```md
##### `variant`

**Type :** `'primary' | 'secondary'`<br />
**Défaut :** `'primary'`<br />
Ajouté en 0.2.0

Définit l'emphase visuelle du bouton.
```

Une entrée doit contenir :
1. un **titre** = le nom du champ, en code ;
2. **Type**, **Défaut** (si applicable), **version** d'ajout, chacun sur sa ligne ;
3. une **définition** (« Définit… », « Spécifie… ») ;
4. les **valeurs possibles** expliquées (liste à puces), avec le critère de choix ;
5. un **exemple** de valeur configurée.

La source de ces entrées est le commentaire de type au-dessus de chaque prop dans le composant
(JSDoc : description, `@default`, `@since`, `@deprecated`, `@experimental`).

### 6 bis. Version et statut dans le code

La version d'ajout et le statut d'un composant vivent **dans son code**, dans le commentaire de
documentation placé au-dessus de `interface Props`. Le site les lit. Ils ne sont écrits nulle part ailleurs.

```astro
---
/**
 * Déclenche une action sur place.
 *
 * @since 0.2.0
 * @experimental
 */
interface Props {
  /**
   * Emphase visuelle du bouton.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';

  /**
   * @deprecated Utiliser `variant="secondary"`. Supprimé en 1.0.0.
   * @since 0.2.0
   */
  outline?: boolean;
}
---
```

| Information | Étiquette | Remarque |
|---|---|---|
| Version d'ajout | `@since 0.2.0` | Étiquette JSDoc courante. Elle n'est pas dans le standard TSDoc : la déclarer dans la configuration de l'outil de lecture. |
| Expérimental | `@experimental` | Étiquette standard TSDoc. |
| Déprécié | `@deprecated <remplaçant et version de suppression>` | Étiquette standard TSDoc : l'éditeur barre l'usage d'une prop dépréciée. |
| Stable | aucune étiquette | Comme GOV.UK : un composant stable n'a pas d'étiquette. |

Pourquoi dans le code et pas dans un fichier à part : un seul endroit, à côté des props qu'il décrit.
Un fichier de métadonnées séparé deviendrait une seconde source qui peut contredire la première.
Un script de la construction du site lit ces commentaires avec le compilateur TypeScript : aucun
générateur de documentation n'existe pour les fichiers `.astro` (à contrôler au premier composant).

Source : Astro : *jsdoc-config-ref* (ses pages de référence viennent de commentaires JSDoc à étiquettes) ; TSDoc (étiquettes `@experimental`, `@deprecated`).

Source : Astro : *api-references*, *jsdoc-config-ref* (pages `configuration-reference`, `legacy-flags` et erreurs générées depuis le dépôt `astro`), *source-content*.

## 7. Échantillons de code

Règles de contenu :
- **Un nom de fichier en titre** : le lecteur sait où coller le code.
- Un **vrai cas d'usage**, avec un code correct et qui tourne. Pas de `foo` / `bar`. Pas toutes les valeurs possibles d'une option.
- **Introduire chaque échantillon** par une phrase complète, sur une nouvelle ligne : « L'exemple suivant montre… ».
- Éviter « comme ceci : » : c'est un substitut à l'explication. Dire ce que fait le code.
- **Plusieurs échantillons** : introduire chacun séparément, puis relier les points. Ne pas empiler trois blocs suivis d'une longue explication.
- Une **commande à exécuter** a son propre bloc. Le code en ligne est réservé aux noms (variables, props).
- Marquer les lignes modifiées (ajout / suppression) quand le changement est le sujet.
- Prévisualiser le rendu avant de valider.

Exemple d'introduction :
> L'exemple suivant montre un bouton secondaire de petite taille avec une icône.

Syntaxe de marquage (outil : `astro-expressive-code`, voir § 13) :

````md
```astro title="src/pages/index.astro" {4-6} ins="<Button />"
```
````

- `title="chemin/du/fichier"` : le nom de fichier en titre.
- `{4-6}` : met les lignes 4 à 6 en évidence. `ins={3}` et `del={2}` : lignes ajoutées ou supprimées (le style +/- est appliqué, inutile de taper `+` ou `-`).
- `ins="texte"` et `del="texte"` : met en évidence un mot ou une expression.

Source : Astro : *code-samples*.

## 8. Composants de documentation (site)

Le site peut proposer quelques composants. Ils vivent dans `site/src/components/`, jamais dans le paquet.

| Composant | Usage | Règle |
|---|---|---|
| `Since` | « Ajouté en x.y.z », avec « Nouveau » / « Bêta » automatiques | Sur sa propre ligne, juste sous le titre de l'entrée |
| `ReadMore` | Lien interne vers une page liée | Le texte du lien dit où il mène. Le composant n'ajoute aucun texte. |
| `Steps` | Suite d'étapes numérotées | Seulement pour une séquence **linéaire**. Toute liste numérotée n'est pas une suite d'étapes. |
| `Badge` | Étiquette d'un mot (statut) | Un ou deux mots maximum |
| Encadré | note / astuce / attention | Voir § 5 |
| Arborescence | Structure de dossiers | `/` après chaque dossier, extension après chaque fichier |

Les **libellés d'interface** (« Ajouté en », « Copier », « À faire ») sont tous dans **un seul fichier**,
avec un schéma qui refuse une clé manquante. Aucun libellé n'est écrit dans un composant.

Source : Astro : *custom-components*, fichier `i18n/en.yml` et son schéma `i18n-schema.ts`.

## 9. Guides de migration (une par version majeure)

Contenu : **uniquement ce qui oblige à modifier un projet** pour qu'il fonctionne après la mise à jour.
Pas de nouvelles fonctions.

Structure d'une page :
1. Comment mettre à jour (commande et étapes manuelles).
2. Une phrase : après la mise à jour, il est possible que tout fonctionne ; sinon, lire la suite.
3. Lien vers le journal des changements (`CHANGELOG`).
4. Changements cassants.
5. Fonctions dépréciées.
6. Fonctions dépréciées désormais supprimées.
7. Problèmes connus.

Format d'une entrée de changement cassant :

```md
### Changé : `variant="tertiary"` renommé `variant="ghost"`

Dans la version 0.x, le bouton acceptait `variant="tertiary"`.

La version 1.0 le renomme `variant="ghost"`.

#### Que faire ?

Remplacer `tertiary` par `ghost` dans chaque `<Button>`.
```

- Le titre commence par un verbe au passé (« Changé », « Renommé », « Supprimé », « Ajouté », « Déprécié »), choisi selon **l'impact ressenti** par le lecteur.
- « Que faire ? » est **obligatoire** et donne une **action** (pas une constatation), avec un exemple avant / après quand c'est possible.
- La dépréciation dure au moins une version mineure, avec un avertissement en développement, avant la suppression.

Source : Astro : *upgrade-guides/about*, *upgrade-guides/breaking-changes*.

## 10. Documenter un changement

La doc fait partie de la **définition de « fini »** d'un changement.

- Tout changement du paquet reçoit une note de version (`changeset`) : elle alimente le `CHANGELOG`.
- Un changement qui modifie l'usage met à jour la doc **dans la même PR**.
- Documenter une nouvelle fonction : **définir**, puis répondre à *c'est quoi / pour quoi faire / pourquoi l'utiliser / quand (ne pas) l'utiliser / comment l'utiliser*.
- **Ne pas documenter** les détails d'implémentation (sauf s'ils aident à choisir une valeur), ni les usages non pris en charge (« vous pouvez, mais je ne le recommande pas » n'a pas sa place).
- Un composant **en brouillon** n'est pas dans les pages principales : il vit dans une section dédiée « Expérimental », avec un renvoi vers son issue. Il entre dans la doc normale à sa stabilisation.
- Le nom d'une option se juge du côté **usage** : décrit-il l'intention du lecteur, pas ce que fait le code ? Se poser la question dès que l'histoire d'usage est connue.

Source : Astro : *about-documenting-code-changes*, *new-feature-docs*, *experimental-feature-docs*, *changesets*. Les composants « brouillon » : adaptation.

## 11. Issues et pull requests

- **Issue d'abord**, PR ensuite. Une PR directe est réservée aux fautes de frappe et aux liens cassés.
- Une bonne issue contient : un **titre descriptif**, un **lien** vers la page ou le fichier, **pourquoi** (ou pour qui) c'est un problème, une **reproduction** si les instructions ne fonctionnent pas, et éventuellement une solution proposée.
- Une idée encore floue se discute avant d'être une issue.
- Description de PR : *quoi et pourquoi* (obligatoire), références (`Closes #…`), version concernée.
- Une PR ne couvre qu'un sujet.
- Chaque workflow de la CI commence par un commentaire qui dit ce qu'il fait, à tenir à jour.

Source : Astro : *file-an-issue*, `CONTRIBUTING.md`, `PULL_REQUEST_TEMPLATE.md`.

## 12. Revue et définition de « page prête »

### Ce que contrôle la revue
- **Exactitude** : les étapes marchent telles quelles ; le code est correct.
- **Linéarité** : les étapes se suivent, sans « avant cela, il fallait… ».
- **Périmètre** : la page ne documente pas le fonctionnement d'outils tiers (Figma, Astro) au-delà de ce qui sert le système.
- **Contexte** : le nouveau texte est placé là où il a du sens dans la page et dans l'ensemble, pas collé en bas.
- **Ni trop, ni trop peu** : couper les mots, pas les idées. Ajouter du contexte peut raccourcir la lecture.
- **Aperçu** : toujours relire la page rendue, pas seulement le texte source.
- Principe de progression : « pas pire qu'avant ». Une doc n'est jamais terminée.

### Liste de contrôle d'une page prête
- [ ] Le `type` et le gabarit correspondent.
- [ ] `title` et `description` renseignés ; verbe en tête pour un guide.
- [ ] Une seule idée par section, titres courts sans ponctuation finale.
- [ ] Aucune information déjà présente ailleurs (liens à la place).
- [ ] Ce qui peut être généré l'est (props, valeurs, statut).
- [ ] Chaque échantillon de code a un titre-fichier et une phrase d'introduction.
- [ ] Aucun encadré inutile ; liens au texte descriptif.
- [ ] Page rendue relue sur l'aperçu ; liens et exemples vérifiés.

Source : Astro : *reviewing-prs*, *recipe-writing*, *writing-style*.

## 13. Décisions ouvertes

| # | Question | Recommandation |
|---|---|---|
| 1 | **Tutoiement ou vouvoiement** dans les pages du site (Astro écrit « you » : un adresse directe, au présent) | **Décidé : vouvoiement.** |
| 2 | **Langue** de la doc : français seul, ou français + anglais | **Décidé : français seul** au départ ; si l'anglais vient, le texte français reste la source. |
| 3 | **Outil de blocs de code** : syntaxe de titre, lignes en évidence, ajouts / suppressions | **Décidé : `astro-expressive-code`**, l'outil que la doc d'Astro recommande en complément de Shiki (intégré à Astro) pour le marquage de code. Version 0.44.3, compatible Astro 7 (vérifié sur npm le 2026-11-01). Syntaxe au § 7. |
| 4 | **Où vit la version « Ajouté en »** | **Décidé : dans le code**, en commentaire de documentation (`@since`) au-dessus de `interface Props` du composant. Le site la lit et l'affiche. Voir § 6 bis. |
| 5 | **Où vit le statut** (expérimental / stable / déprécié) | **Décidé : dans le code**, avec les étiquettes standard `@experimental` et `@deprecated` ; l'absence d'étiquette signifie stable. Jamais en étiquette d'issue. Voir § 6 bis. |
| 6 | **Format des pages écrites** : Markdown simple ou MDX (composants dans le texte) | **Décidé : MDX**, pour montrer le vrai composant dans la page. |
| 7 | **Statut d'un composant** | **Décidé** (recoupé avec Primer, GOV.UK, USWDS, Carbon et Astro). Pas de « brouillon » publié : le travail en cours vit sur une **branche** et dans une issue. Trois états publiés : **Expérimental** (étiquette visible), **Stable** (aucune étiquette, dans `main`), **Déprécié** (étiquette, remplaçant nommé, avertissement en développement, suppression à la version majeure suivante). |
