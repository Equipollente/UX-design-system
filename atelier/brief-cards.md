# Brief — famille Cards

## OBJET

Famille de composants `Cards` dans `src/design-system/components/cards/`.

Le périmètre comprend la primitive `Card.astro`, la composition `CardDefault.astro` et quatre composants publics : `CardImage.astro`, `CardText.astro`, `CardTags.astro` et `CardActions.astro`.

La primitive `Card.astro` n'impose aucun enfant. `CardText.astro`, `CardImage.astro`, `CardTags.astro` et `CardActions.astro` sont tous optionnels dans cette primitive. `CardDefault.astro` compose ensuite un cas d'usage documenté à partir de ces briques.

`src/design-system/components/Card.astro` est l'ancienne API publique. Elle reste à sa place et n'entre pas dans cette réorganisation.

## POUR QUI

Pour les futures vues du design system et ses sites consommateurs qui ont besoin de cartes plus souples, plus composables et plus stables.

La famille doit fournir :

- `Card.astro` comme cadre neutre et composable ;
- `CardDefault.astro` comme composition prête à l'emploi pour une carte de liste ;
- quatre primitives publiques optionnelles : image, texte, tags et actions ;
- une séparation nette entre structure visuelle, contenu fourni par l'appelant et comportement interactif.

La nouvelle famille ne doit pas connaître un site consommateur, une page métier, une liste d'oeuvres ou des données propres à une application.

## FIGMA

À valider avant l'implémentation.

Les composants doivent être rattachés à leurs noeuds Figma respectifs. La structure des fichiers ne doit pas devenir une source de vérité concurrente de Figma.

Si le besoin n'est pas encore dessiné dans Figma, le travail s'arrête à la proposition d'organisation et aux contrats à valider. Aucun composant ne doit être créé uniquement pour anticiper un futur usage.

## CONTEXTE ACTUEL

L'ancien `src/design-system/components/Card.astro` contient déjà une fiche historique composée avec :

- une image optionnelle ;
- un titre, un sous-titre et une meta ;
- le slot `tags-top` ;
- le slot `tags` ;
- le slot `actions`.

La nouvelle famille `cards/` adopte une autre frontière : `Card.astro` devient le cadre neutre, tandis que `CardDefault.astro` assemble une carte de liste avec :

- une image ou une image de remplacement ;
- un titre lié ou une zone d'actions ;
- les slots `tags-top`, `tags-bottom` et `actions` ;
- des contraintes explicites entre `href` et `actions` ;
- un agencement responsive fondé sur la largeur propre de la carte.

Ces deux contrats ne doivent pas être fusionnés. L'ancien `components/Card.astro` reste une API legacy isolée. La nouvelle primitive `cards/Card.astro` devient le point de composition neutre et `cards/CardDefault.astro` la composition recommandée pour le cas de liste.

## AUJOURD'HUI

Les composants liés aux cartes sont dispersés directement dans `src/design-system/components/`.

L'ancien `Card.astro`, la primitive `cards/Card.astro` et `cards/CardDefault.astro` portent trois rôles différents. Les chemins d'import et la documentation doivent les distinguer explicitement.

Les éléments internes d'une carte sont encore principalement rendus par le composant parent. Il faut déterminer lesquels méritent réellement de devenir des composants publics.

## ATTENDU

Créer une organisation cohérente sous `src/design-system/components/cards/`.

Organisation cible :

```text
src/design-system/components/
  Card.astro                  # ancienne API legacy, compatibilité
  cards/
    Card.astro                # primitive UI neutre
    CardDefault.astro         # composition de carte de liste
    CardImage.astro           # primitive publique optionnelle
    CardText.astro            # primitive publique optionnelle
    CardTags.astro            # sous-composant public optionnel
    CardActions.astro         # sous-composant public optionnel
```

`Card.astro` n'impose aucun slot. `CardDefault.astro` peut imposer les règles nécessaires à sa composition de carte de liste, mais cette contrainte ne doit pas remonter dans la primitive neutre. `CardText.astro` porte le titre, le sous-titre et la meta ; il distingue le rang sémantique du titre de son apparence visuelle.

Les sous-composants publics optionnels doivent apporter au moins l'un des bénéfices suivants :

- un contrat réutilisé par plusieurs cartes ;
- une responsabilité visuelle ou d'accessibilité isolable ;
- une variation contrôlable sans dupliquer le markup ;
- une stabilité accrue pour les consommateurs.

Un simple déplacement de quelques lignes HTML ne justifie pas un nouveau composant.

## CONVENTIONS DE COMPOSITION

La famille adopte une convention de primitives composables, inspirée du dossier
[Card de fulldotdev/ui](https://github.com/fulldotdev/ui/tree/main/src/components/ui/card), mais adaptée au
présent design system :

- chaque composant public expose un `data-slot` stable correspondant à son rôle (`card`, `card-image`,
  `card-text`, `card-tags`, `card-actions`) ;
- chaque composant accepte `class`, `style` et les attributs HTML complémentaires, puis les transmet à
  sa racine ;
- chaque composant possède les styles de sa propre région ; `CardDefault` ne redessine pas `Tag`,
  `Button`, `CardImage`, `CardText`, `CardTags` ou `CardActions` ;
- `CardTags` organise les `Tag` reçus et `CardActions` organise les `Button` reçus ; aucun des deux ne
  remplace le composant qu'il contient ;
- les relations de structure restent dans `CardDefault` : ordre des régions, comportement du lien,
  container queries et placement de l'image ;
- la convention ne commande ni Tailwind ni une nouvelle dépendance : les styles restent des styles Astro
  scopés et lisent les tokens du système ;
- une future région (`CardHeader`, `CardFooter`, ou autre) ne sera ajoutée que si une vue réelle et un
  contrat Figma la justifient.

## CONTRATS À DÉFINIR

### Carte globale

`Card.astro` est une primitive neutre. Il ne rend aucun contenu obligatoire et ne connaît ni métier, ni titre, ni image, ni mode lien.

Il décide uniquement du cadre : fond, bordure, rayon, ombre, espacement général, `data-slot="card"`, attributs transmis et slot par défaut.

`CardDefault.astro` est une composition au-dessus de cette primitive. Elle peut organiser les régions image, texte, tags et actions et porter les contraintes propres à la carte de liste.

Les régions doivent être nommées de manière cohérente et documentées. La présence d'une région vide ne doit pas créer d'espace inattendu.

Le comportement de lien ne doit pas être déduit par `Card.astro`. Une carte neutre est passive par défaut ; un lien ou une surface cliquable doit être exprimé explicitement par la composition qui en a besoin.

### Image

`CardImage.astro` porte les règles communes de l'image :

- texte alternatif obligatoire lorsque l'image est informative ;
- traitement explicite d'une image décorative ou d'un fallback ;
- dimensions ou ratio permettant d'éviter les sauts de layout ;
- recadrage stable sans déformation ;
- chemin fourni par l'appelant, sans connaissance d'une application.

### Texte

`CardText.astro` est optionnel pour `Card.astro` et porte le titre, le sous-titre et la meta lorsqu'il est utilisé. Il doit distinguer le rang sémantique du titre de son apparence visuelle avec `headingLevel` et `titleSize`.

Le titre est obligatoire ; le sous-titre et la meta sont optionnels et ne doivent pas laisser de conteneur ou d'espacement parasite lorsqu'ils sont absents.

### Tags

`CardTags.astro` ne remplace pas `Tag.astro`. Il porte la disposition, le regroupement et le comportement responsive d'une rangée de tags.

Les tags ne doivent pas devenir interactifs par accident lorsque la carte entière est un lien.

### Actions

`CardActions.astro` ne remplace pas `Button.astro`. Il définit la région et la disposition commune de plusieurs actions.

Une carte entièrement cliquable et une carte contenant des actions indépendantes doivent rester deux comportements incompatibles, afin que le lien de surface ne recouvre pas les boutons.

## NE PAS TOUCHER

- `src/design-system/components/Card.astro` et ses props existantes ;
- les slots existants de l'ancien `Card.astro` : `tags-top`, `tags` et `actions` ;
- les sites consommateurs de l'ancienne API ;
- les composants `Tag.astro` et `Button.astro`, sauf besoin démontré par un contrat de la nouvelle famille ;
- les tokens et les exports générés sans validation de leur source ;
- les données propres aux pages de démonstration dans le design system ;
- les composants métier `CaseStudyCard.astro` et `CaseStudyHeader.astro` tant qu'aucune migration explicite n'est décidée.

## DÉCISIONS À PRENDRE AVANT DE CODER

- La nouvelle famille est créée sur une page vierge dans `cards/`, en s'appuyant sur le comportement de `CardDefault.astro` sans déplacer l'ancien fichier.
- `cards/Card.astro` est la primitive neutre et `cards/CardDefault.astro` la composition spécialisée ; `components/Card.astro` reste inchangé.
- Les slots de la nouvelle famille reprennent les noms historiques : `image`, `tags-top`, `tags-bottom` et `actions`.
- La carte est cliquable via `href` quand le slot `actions` est absent ; quand `actions` est présent, la carte n'est pas cliquable globalement et seuls les boutons restent interactifs.
- `cards/Card.astro` n'impose aucun enfant. `CardImage`, `CardText`, `CardTags` et `CardActions` sont des primitives publiques optionnelles ; `CardDefault.astro` est la composition spécialisée documentée.
- Les fichiers et consommateurs existants ne sont pas migrés dans cette étape. La nouvelle famille est réservée aux nouveaux consommateurs, tandis que les APIs legacy restent compatibles.

Toute décision qui change la frontière publique d'un composant doit être reportée dans la documentation et, si elle est structurante, dans `atelier/decisions.md`.

## DOCUMENTATION À METTRE À JOUR

- `src/pages/components.astro` pour les composants publics et leurs contrats ;
- `src/pages/_component-pages.ts` si une page de composant est ajoutée ou déplacée ;
- `README.md` pour l'arborescence et la liste publique ;
- `LINKS.md` pour les noeuds Figma et les chemins ;
- `atelier/decisions.md` pour une décision de frontière ou de compatibilité ;
- `atelier/arbitrages.md` si un écart avec Figma appelle une action dans Figma.

La documentation doit montrer les vrais composants rendus, pas une copie de leur markup.

## FINI QUAND

- [ ] Le brief et le périmètre de la famille sont validés.
- [ ] Les noeuds Figma et leurs descriptions sont identifiés.
- [ ] L'ancien `Card.astro` reste inchangé et ses imports existants fonctionnent.
- [ ] La nouvelle famille possède des noms et des responsabilités non ambigus.
- [ ] Chaque sous-composant créé possède un contrat public justifié par un usage réel.
- [ ] Les slots de tags et d'actions sont indépendants, conditionnels et documentés.
- [ ] Le mode carte-lien n'entre pas en conflit avec des actions internes.
- [ ] Les images informatives et décoratives ont un comportement accessible défini.
- [ ] Aucun composant de la famille ne connaît un site ou des données métier.
- [ ] Les tokens existants sont réutilisés et aucun token n'est recopié en dur.
- [ ] La documentation `/components` utilise les composants réels.
- [ ] Les imports, `LINKS.md`, `README.md` et les comptes de composants sont cohérents.
- [ ] `npm run check` passe.
- [ ] La page `/components` est vérifiée au clavier, sous 768px et dans une fenêtre courte.
- [ ] Les consommateurs existants de l'ancien `Card.astro` restent fonctionnels.
