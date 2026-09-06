# Plan de développement — famille Cards

## 1. Décision d'architecture

La nouvelle famille est créée dans `src/design-system/components/cards/` comme une nouvelle implémentation. Elle ne déplace ni ne modifie l'ancien `src/design-system/components/Card.astro`, qui reste une API legacy consommée par des sites externes.

Le plan retient définitivement la convention suivante :

```text
src/design-system/components/
  Card.astro                  # legacy, inchangé
  CardDefault.astro           # référence existante, conservée pendant la transition
  cards/
    Card.astro                # primitive UI neutre
    CardDefault.astro         # composition de carte de liste
    CardImage.astro           # public, optionnel
    CardText.astro            # public, optionnel
    CardTags.astro            # public, optionnel
    CardActions.astro         # public, optionnel
```

`cards/Card.astro` est la primitive neutre et ne doit imposer aucun enfant. `cards/CardDefault.astro` est une composition spécialisée au-dessus d'elle ; il ne s'agit pas d'un alias.

Convention de composition à appliquer dès maintenant et à conserver pour les futures régions :

- `data-slot` identifie le rôle public de chaque composant ;
- `class`, `style` et les attributs HTML complémentaires sont transmis à la racine ;
- le layout d'une région appartient à son composant ;
- `CardDefault` garde uniquement les relations entre régions, le comportement et le responsive ;
- aucune dépendance Tailwind n'est introduite : les styles Astro scopés et les tokens restent la source de dessin.

## 2. Principes Astro qui commandent l'implémentation

Le plan suit la documentation officielle Astro :

- [Component-based design](https://docs.astro.build/en/basics/astro-components/#component-based-design) : composer des composants Astro plutôt que dupliquer leur markup.
- [Component props](https://docs.astro.build/en/guides/typescript/#component-props) : définir une interface `Props` dans chaque composant pour obtenir le typage dans l'éditeur et avec `astro check`.
- [Named slots](https://docs.astro.build/en/basics/astro-components/#named-slots) : utiliser des slots nommés pour `image`, `tags-top`, `tags-bottom` et `actions`.
- [Astro.slots.has()](https://docs.astro.build/en/reference/astro-syntax/#component-utilities) : ne rendre les wrappers optionnels que lorsque le slot existe.
- [Passing a class to a child component](https://docs.astro.build/en/guides/styling/#passing-a-class-to-a-child-component) : accepter `class`, la renommer en `className`, puis transmettre `...rest` sur la racine pour conserver le comportement des styles scopés.
- [HTML attributes](https://docs.astro.build/en/guides/typescript/#htmlattributes) : étendre `HTMLAttributes<'div'>`, `HTMLAttributes<'article'>` ou `HTMLAttributes<'img'>` afin que les attributs HTML transmis soient aussi typés chez les consommateurs.
- [astro check](https://docs.astro.build/en/reference/cli-reference/#astro-check) : valider le typage des fichiers `.astro`, car `astro build` ne remplace pas cette vérification.

Dans `CardDefault`, `CardText` sera le contenu attendu du slot par défaut. La primitive `Card` reste libre : elle peut recevoir zéro, un ou plusieurs enfants. Astro ne vérifie pas que le contenu fourni est précisément un composant `CardText`.

## 3. Contrat public cible

### `cards/Card.astro`

Responsabilité : cadre UI neutre et composable.

Props prévues : `class?`, `style?` et attributs HTML complémentaires.

Slots :

- default : contenu libre, optionnel ;
- les primitives `CardImage`, `CardText`, `CardTags` et `CardActions` peuvent être composées librement.

Règles :

- aucun enfant n'est obligatoire ;
- aucun lien n'est déduit automatiquement ;
- aucun comportement métier `href/actions` n'est porté par cette primitive ;
- la racine expose `data-slot="card"` ;
- le cadre porte fond, bordure, rayon, ombre et espacement général.

### `cards/CardDefault.astro`

Responsabilité : composition de carte de liste, au-dessus de `cards/Card.astro`.

Props prévues :

- `href?: string` : obligatoire quand le slot `actions` est absent ; interdit quand `actions` est présent ;
- `headingLevel?: 2 | 3 | 4 | 5 | 6` : transmis à `CardText` ou utilisé comme défaut documenté ;
- `class?: string` et `style?: string` : extensions de mise en page documentées ;
- attributs HTML complémentaires transmis à la racine.

Slots :

- default : `CardText`, attendu par cette composition ;
- `image` : `CardImage`, optionnel ;
- `tags-top` : `CardTags`, optionnel ;
- `tags-bottom` : `CardTags`, optionnel ;
- `actions` : `CardActions`, optionnel.

Règles :

- aucun slot `actions` + `href` présent : la carte devient une surface de lien ;
- slot `actions` présent + `href` absent : seuls les boutons d'actions sont interactifs ;
- les deux combinaisons invalides sont refusées explicitement dans cette composition ;
- les régions absentes ne produisent ni wrapper ni espace vide ;
- le composant ne connaît aucune donnée métier ni aucun site consommateur.
- la racine expose `data-slot="card-default"`.

### `cards/CardText.astro`

Responsabilité : contenu textuel réutilisable, attendu par la composition `CardDefault` mais non imposé par la primitive `Card`.

Props prévues :

- `title: string` ;
- `subtitle?: string` ;
- `meta?: string` ;
- `headingLevel?: 2 | 3 | 4 | 5 | 6` ;
- `titleSize?: 'title' | 'heading'` si cette distinction reste nécessaire dans la nouvelle base ;
- `class?: string`, `style?: string` et attributs HTML complémentaires.

Règles :

- le titre est toujours rendu ;
- le sous-titre et la meta ne rendent aucun élément lorsqu'ils sont absents ;
- le rang HTML et la taille visuelle restent indépendants ;
- les styles lisent les tokens existants et ne recopient pas les valeurs de `CardDefault` en dur.
- la racine expose `data-slot="card-text"`.

### `cards/CardImage.astro`

Responsabilité : cadre et image optionnelle.

Props prévues :

- `src: string` ;
- `alt: string` pour une image informative ;
- `width?: number` et `height?: number` ou une autre information de ratio validée par Figma ;
- `decorative?: boolean` uniquement si le contrat d'accessibilité le justifie ;
- `fallback?: string` si le fallback fait partie du contrat public ;
- `class?: string`, `style?: string` et attributs HTML complémentaires.

Règles :

- une image informative porte un texte alternatif fourni par l'appelant ;
- un fallback décoratif rend `alt=""` ;
- le cadre réserve sa place et l'image utilise un recadrage stable ;
- le composant ne préfixe pas lui-même les URLs : les chemins publics viennent du consommateur et passent par `withBase()` lorsque nécessaire.
- la racine expose `data-slot="card-image"`.

### `cards/CardTags.astro`

Responsabilité : une région de tags, pas le rendu d'un tag individuel.

Contrat :

- contenu par slot par défaut ;
- `class?`, `style?` et attributs HTML complémentaires ;
- éventuellement une prop `position?: 'top' | 'bottom'` seulement si la mise en page en a réellement besoin.

Le composant compose `Tag.astro` mais ne le remplace pas. Il organise les tags, leur retour à la ligne et leur espacement. La carte ne doit pas accepter de contenu interactif dans une région qui serait recouverte par le lien de surface.

La racine expose `data-slot="card-tags"` et le layout de la rangée appartient à `CardTags`.

### `cards/CardActions.astro`

Responsabilité : une région d'actions, pas le rendu d'un bouton individuel.

Contrat :

- contenu par slot par défaut ;
- `class?`, `style?` et attributs HTML complémentaires.

Le composant compose `Button.astro` mais ne le remplace pas. Il organise plusieurs actions et ne peut coexister avec le mode carte entièrement cliquable.

La racine expose `data-slot="card-actions"` et le layout de la rangée appartient à `CardActions`.

### Composition `CardDefault`

`CardDefault` compose la primitive `Card` et les régions spécialisées. Il ne doit pas devenir un alias
de `Card` et ne doit pas être dupliqué pour chaque futur cas d'usage. Une nouvelle composition doit
réutiliser `Card` et les primitives existantes avant d'ajouter un nouveau composant.

## 4. Ordre d'implémentation

### Étape 0 — verrouiller l'état de départ

1. Vérifier `git status` et ne pas écraser les changements existants.
2. Confirmer que la branche est `improvement-component-card-default`.
3. Relever les noeuds Figma et lire leur description avant de figer les valeurs visuelles.
4. Ne pas toucher à l'ancien `Card.astro`, à ses slots ou à ses consommateurs.

Actions et sortie attendue :

- relever les nœuds Figma dans `LINKS.md` ou signaler l'absence de nœud avant de coder ;
- rechercher les imports de `Card.astro` et `CardDefault.astro` dans `src/` et dans les exports du paquet ;
- noter les fichiers déjà modifiés avant l'intervention ;
- confirmer que le travail porte uniquement sur le design system et non sur un site consommateur ;
- produire une courte liste des fichiers autorisés à changer : `src/design-system/components/cards/`, la documentation de composants et les fichiers de métadonnées nécessaires ;
- arrêter l'implémentation si Figma est annoncé comme source de vérité mais que le nœud n'est pas accessible.

Contrôle : les dépendances, la source Figma et la frontière legacy sont explicites avant toute création de composant.

### Étape 1 — créer la base de la famille

1. Créer `src/design-system/components/cards/`.
2. Copier uniquement le comportement validé de `CardDefault.astro` actuel dans `cards/CardDefault.astro` ; ne pas recopier aveuglément les commentaires ou les décisions propres à l'ancien fichier.
3. Conserver le responsive par container queries, car la largeur de la carte et non celle de la page commande les paliers.
4. Garder les attributs de variante explicites (`data-card-variant`) pour distinguer le mode lien du mode actions.
5. Déplacer la responsabilité textuelle vers `CardText` et la responsabilité image vers `CardImage`.
6. Garder dans la carte uniquement la structure, les wrappers de régions, les contraintes de slots et la mise en page globale.

Actions détaillées :

- créer le dossier sans déplacer les fichiers racine ;
- établir le markup cible avant d'écrire les styles : racine, layout, image, informations, tags et actions ;
- choisir les noms de classes propres à la famille pour éviter les collisions avec l'ancien composant ;
- ajouter `data-slot="card"` sur la racine et réserver les `data-slot` des sous-composants à leurs propres fichiers ;
- conserver les variables CSS et les container queries utiles ;
- remplacer progressivement chaque bloc spécialisé par son composant public, un seul bloc à la fois ;
- conserver `data-card-variant` comme état CSS calculé à partir de la présence du slot `actions` ;
- vérifier que le lien de surface est créé uniquement sur le mode `link` et qu'il ne recouvre jamais les actions ;
- documenter tout écart entre le comportement actuel et Figma dans `arbitrages.md`, sans corriger silencieusement la valeur.

Validation de sortie : `CardDefault` rend une structure vide mais correctement ordonnée, et `npm run check` passe avant l'ajout des sous-composants.

### Étape 2 — implémenter `CardText`

1. Définir l'interface `Props` typée.
2. Construire dynamiquement le niveau de titre comme dans le composant actuel, avec une union fermée.
3. Rendre le titre dans le slot par défaut sans générer de lien lui-même : le lien de surface doit rester contrôlé par `CardDefault`.
4. Rendre `subtitle` et `meta` conditionnellement.
5. Reprendre les tokens `card.*` existants.
6. Ajouter la section de documentation de ses props si le composant est exposé séparément dans `/components`.

Actions détaillées :

- décider si `CardText` reçoit `headingLevel` directement ou si `CardDefault` le transmet ; ne pas maintenir deux valeurs par défaut concurrentes ;
- garder le lien hors de `CardText` afin que le composant reste réutilisable dans les deux modes de carte ;
- vérifier le HTML produit pour les combinaisons titre seul, titre + sous-titre et titre + sous-titre + meta ;
- vérifier qu'un sous-titre ou une meta absente ne laisse ni élément vide ni espace supplémentaire ;
- comparer les tailles et couleurs aux tokens `card.*` déjà utilisés par le composant actuel ;
- exposer `class` et `style` seulement si leur usage est documenté dans le tableau de props ;
- ajouter `data-slot="card-text"` sur la racine de `CardText` et conserver ce nom si la région évolue.

Validation de sortie : le titre reste sémantiquement correct pour chaque `headingLevel`, les lignes optionnelles disparaissent proprement et `npm run check` détecte une prop manquante.

### Étape 3 — implémenter `CardImage`

1. Définir le contrat `src`, `alt`, fallback et dimensions après validation Figma.
2. Réserver les dimensions du cadre pour éviter les changements de layout.
3. Utiliser `object-fit: cover` et les tokens existants pour bordure et rayon.
4. Ne pas appeler `withBase()` dans le composant ; l'URL appartient à l'appelant.
5. Tester image informative, image absente et fallback décoratif.

Actions détaillées :

- décider si `CardImage` reçoit une image de fallback ou si le fallback reste une décision de `CardDefault` ; choisir une seule source de vérité ;
- transmettre `width` et `height` jusqu'à l'élément `img` lorsque ces dimensions sont disponibles ;
- ne jamais fabriquer un texte alternatif à partir du titre de la carte ;
- distinguer une image principale absente d'une image principale décorative ;
- vérifier que le composant ne dépend pas d'un chemin d'image présent dans le design system ;
- tester le recadrage aux quatre paliers de largeur et la stabilité de la hauteur avant chargement ;
- ajouter `data-slot="card-image"` sur l'élément racine sans déplacer la responsabilité des dimensions vers `CardDefault`.

Validation de sortie : aucune image informative n'est rendue sans contrat `alt`, et aucune image absente ne réserve un cadre inattendu.

### Étape 4 — implémenter `CardTags` et `CardActions`

1. Rendre le contenu via le slot par défaut.
2. Utiliser `Astro.slots.has('default')` uniquement si un wrapper vide doit être évité.
3. Poser le flux, le retour à la ligne et l'espacement sur la région, pas sur les composants `Tag` ou `Button` reçus.
4. Exposer `class`, `style` et les attributs HTML complémentaires avec la convention `class: className` et `...rest`.
5. Vérifier que le lien de surface n'est jamais présent quand `CardActions` est fourni.

Actions détaillées :

- conserver les slots historiques `tags-top` et `tags-bottom` dans `CardDefault` ;
- décider si `CardTags` accepte plusieurs enfants via son slot par défaut, sans imposer une nouvelle API à `Tag` ;
- vérifier le rendu d'une rangée vide, d'une rangée avec un tag et d'une rangée qui revient sur plusieurs lignes ;
- rendre les actions dans l'ordre fourni par l'appelant ;
- vérifier que `Button` conserve ses propres états de focus, survol et disabled ;
- interdire par contrat documentaire les liens et boutons dans les régions qui seraient couvertes par la surface de lien ;
- ne pas ajouter de script client : ces composants sont de la composition Astro statique ;
- ajouter `data-slot="card-tags"` et `data-slot="card-actions"` sur les deux régions ; ne pas ajouter de wrapper équivalent dans `CardDefault`.

Validation de sortie : les régions absentes ne rendent aucun wrapper, les tags restent des `Tag`, les actions restent des `Button`, et les deux modes d'interaction ne se chevauchent pas.

### Étape 5 — valider la composition de la primitive

1. Vérifier que `cards/Card.astro` accepte un slot vide, un `CardText` seul et plusieurs régions combinées.
2. Vérifier que la primitive ne déduit aucun lien et ne rend aucun enfant obligatoire.
3. Utiliser `CardDefault` pour le cas de carte de liste et conserver ses contraintes spécifiques dans cette composition.
4. Ne pas ajouter de styles métier ou de règles `href/actions` dans `cards/Card.astro`.

Actions détaillées :

- transmettre `class`, `style` et les attributs HTML complémentaires à la racine de `Card` ;
- vérifier que la primitive ne crée pas de wrapper spécialisé autour des régions ;
- utiliser `Card` dans au moins une démo indépendante de `CardDefault` pour vérifier sa neutralité.

Validation de sortie : `Card` est une primitive passive et librement composable ; `CardDefault` reste la composition spécialisée de liste.

### Étape 6 — adapter la documentation et les imports

1. Remplacer les imports de démonstration concernés dans `src/pages/components.astro` par les imports de `cards/` sans modifier la section legacy de l'ancien `Card.astro`.
2. Ajouter les démonstrations minimales : carte avec texte seul, carte avec image, carte avec tags, carte avec actions.
3. Ajouter un exemple de carte-lien et un exemple de carte à actions.
4. Mettre à jour les tableaux de props et de slots à partir des interfaces réellement codées.
5. Mettre à jour `_component-pages.ts`, `README.md` et `LINKS.md` si les composants deviennent des entrées publiques distinctes.
6. Corriger le léger espace avant le paragraphe `CardText.astro` dans le brief avant validation documentaire.

Actions détaillées :

- ajouter les imports des nouveaux composants en haut de `src/pages/components.astro` ;
- créer les données de démo dans `_demo.ts` uniquement si elles sont nécessaires à plusieurs sections ;
- montrer le rendu réel de `Card` et de `CardDefault`, jamais une copie de leur HTML ;
- documenter séparément les props de `CardDefault`, `CardText`, `CardImage`, `CardTags` et `CardActions` si chacun est public ;
- documenter les slots avec leur nom exact, leur caractère obligatoire ou optionnel et leur contenu attendu ;
- ajouter les états invalides dans la rubrique “Ce que la maquette ne dit pas” ou dans un flag explicite ;
- mettre à jour les nombres et listes de composants dans `index.astro` et `README.md` si la nouvelle famille modifie les comptes ;
- ajouter les nouveaux chemins et nœuds à `LINKS.md` ;
- vérifier que les URLs et images de démonstration passent par `withBase()` lorsqu'elles viennent de `public/` ;
- vérifier que le nom de l'ancien `Card.astro` est toujours distingué de la primitive `cards/Card.astro` et de `cards/CardDefault.astro` dans la documentation.

Validation de sortie : la documentation expose les mêmes props, slots et comportements que les interfaces TypeScript et le HTML réellement rendu.

### Étape 7 — préserver la compatibilité

1. Ne pas migrer les fichiers ni les consommateurs existants dans cette branche.
2. Vérifier seulement que l'ancien `Card.astro` n'a pas changé et que ses imports restent valides.
3. Documenter la nouvelle famille comme la voie recommandée pour les nouveaux développements.
4. Préparer une migration séparée si les sites consommateurs doivent adopter la primitive `cards/Card` ou la composition `cards/CardDefault`.

Actions détaillées :

- comparer le diff de l'ancien `Card.astro` avant et après l'intervention ; il ne doit contenir aucune modification fonctionnelle ;
- vérifier les imports existants de `Card.astro` et de `CardDefault.astro` dans le dépôt ;
- ne pas renommer ni supprimer `CardDefault.astro` racine dans cette branche ;
- ne pas changer les slots historiques de l'ancien composant ;
- consigner la future migration comme une tâche séparée, avec ses propres consommateurs et tests ;
- vérifier que l'export npm `./components/*` rend bien les nouveaux fichiers accessibles sans ajouter un export manuel inutile.

Validation de sortie : l'ancienne API reste disponible et la nouvelle famille est utilisable sans migration préalable.

### Étape 8 — revue du code et nettoyage

1. Relire chaque nouveau composant contre son contrat : ce qu'il est, ce qu'il n'est pas, props, slots et source Figma.
2. Supprimer les props non utilisées, les classes héritées de l'ancien composant et les commentaires devenus faux.
3. Vérifier qu'aucune valeur visuelle nouvelle n'est écrite en dur sans justification Figma ou token.
4. Vérifier qu'aucun composant public ne connaît une page, une route ou une donnée métier.
5. Vérifier l'accessibilité du lien de surface, du focus, des images et de l'ordre des actions.
6. Vérifier qu'aucun composant n'ajoute du JavaScript client sans comportement mesuré qui l'exige.
7. Comparer le HTML de l'ancien composant et de la nouvelle famille uniquement là où la compatibilité est explicitement attendue ; ne pas chercher une identité automatique entre deux contrats différents.

Validation de sortie : le diff est limité à la famille Cards, sa documentation et ses métadonnées ; aucun refactoring opportuniste n'est inclus.

### Étape 9 — validation finale et clôture

1. Lancer `npm run check` depuis la racine du dépôt.
2. Lancer `npm run build` pour vérifier les imports, la génération des pages et les tokens.
3. Ouvrir `/components` et vérifier les démonstrations réelles.
4. Tester au clavier : tabulation, focus visible, activation du lien, activation de chaque bouton et absence de piège de focus.
5. Tester sous 768px puis sur une fenêtre courte.
6. Tester les quatre paliers de container query et une grille de plusieurs cartes.
7. Vérifier `prefers-reduced-motion` si une transition est ajoutée, sans ajouter de logique locale si les tokens du système suffisent.
8. Lancer `git diff --check`, puis examiner `git diff --stat` et `git status --short`.
9. Vérifier que les fichiers générés n'ont pas été modifiés hors de leur commande prévue.
10. Préparer un commit limité à une seule évolution : nouvelle famille Cards et documentation associée.

Livrable final : composants publiables, documentation cohérente, ancienne API intacte, validation Astro et build réussis.

## 5. Matrice de validation comportementale

| Cas | Attendu |
|---|---|
| `CardText` absent | erreur de typage ou erreur explicite de composition |
| `CardText` présent seul | carte rendue sans image, tags ni actions ; `href` requis si le mode lien est conservé |
| image sans `alt` informatif | erreur de contrat ou impossibilité de valider le composant |
| `tags-top` absent | aucun wrapper ni espace de tags en haut |
| `tags-bottom` absent | aucun wrapper ni espace de tags en bas |
| `actions` absent + `href` présent | lien couvrant la carte, focus visible, hover de carte |
| `actions` présent + `href` absent | boutons seuls interactifs, pas de lien de surface |
| `actions` présent + `href` présent | erreur explicite |
| aucun `actions` + aucun `href` | erreur explicite ou état passif interdit par le contrat |
| fallback sans image principale | image décorative avec `alt=""` |
| largeur sous 224px, entre 224 et 337px, entre 338 et 560px, au-delà de 561px | quatre paliers responsive observables |
| attribut `class` fourni à un sous-composant | classe appliquée à la racine sans perdre les attributs Astro nécessaires |

## 6. Vérifications à exécuter

Après chaque étape substantielle, lancer la vérification la plus étroite possible :

1. `npm run check` après les interfaces, les slots et les imports ; Astro signale les erreurs de props et de composants `.astro`.
2. `npm run dev` puis ouvrir `/components` pour vérifier le HTML rendu, le clavier et les états de lien/actions.
3. Vérifier les largeurs de carte à moins de 224px, 224–337px, 338–560px et au moins 561px.
4. Vérifier une fenêtre courte afin de détecter les débordements et les espaces vides.
5. Vérifier le focus clavier sur une carte-lien et sur chaque action d'une carte à actions.
6. `npm run build` pour vérifier l'intégration complète ; ce build ne remplace pas `npm run check`.
7. `git diff --check` et `git status --short` avant de considérer le plan terminé.

## 7. Définition de fini

- [ ] Les composants publics et la frontière `Card` / `CardDefault` sont validés.
- [ ] La nouvelle famille vit dans `components/cards/`.
- [ ] L'ancien `components/Card.astro` est inchangé.
- [ ] `Card` ne contient que le cadre UI et n'impose aucun enfant.
- [ ] `CardText`, `CardImage`, `CardTags` et `CardActions` sont optionnels pour `Card`.
- [ ] `CardDefault` compose les primitives et documente séparément les contraintes de la carte de liste.
- [ ] Les contraintes `href` / `actions` empêchent les surfaces interactives qui se recouvrent.
- [ ] Les images ont un contrat d'accessibilité et une géométrie stable.
- [ ] Les composants lisent les tokens et ne connaissent aucun site consommateur.
- [ ] Chaque primitive expose son `data-slot` et transmet les attributs HTML à sa racine.
- [ ] Chaque primitive dessine sa propre région ; `CardDefault` ne redessine pas ses enfants.
- [ ] La documentation rend les composants réels et décrit leurs props et slots.
- [ ] `npm run check` passe.
- [ ] `/components` est vérifiée au clavier, sous 768px et dans une fenêtre courte.
- [ ] `npm run build` passe.
- [ ] Les consommateurs legacy restent fonctionnels.
