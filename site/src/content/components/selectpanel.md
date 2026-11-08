---
title: Select Panel
description: "Choisir une valeur, ou plusieurs, dans un panneau qui s'ouvre sous une boîte : avec recherche, en-tête et pied."
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=955-17742
exemples:
  - titre: Single select
    texte: Un seul choix. Cliquer une ligne choisit et ferme le panneau.
    instances:
      - { id: un, label: Choix, value: Choix 1, options: [Choix 1, Choix 2, Choix 3] }
  - titre: Multi select
    texte: "`type=multiple` remplace les coches par des cases. La boîte dit les choix faits, séparés par une virgule."
    instances:
      - { id: plusieurs, label: Choix, type: multiple, values: [Choix 1, Choix 2], options: [Choix 1, Choix 2, Choix 3] }
  - titre: Grouped
    texte: Un groupe range ses options sous un nom. Il ne s'imbrique pas, et `disabled` l'éteint tout entier.
    instances:
      - { id: groupes, label: Sélections, type: multiple, values: [Choix 1, Item 2], options: [{ label: Groupe A, options: [Choix 1, Choix 2] }, { label: Groupe B, options: [Item 1, Item 2] }] }
  - titre: With search
    texte: "`searchable` pose un champ de recherche dans l'en-tête, qui filtre les choix."
    instances:
      - { id: recherche, label: Choix, type: multiple, searchable: true, values: [Choix 1, Choix 2], options: [Choix 1, Choix 2, Choix 3, Choix 4] }
  - titre: With create action
    texte: "La ligne « Créer une option » n'enregistre rien : le champ annonce l'événement `select-create`, et la page décide de garder l'option."
    instances:
      - { id: creation, label: Choix, type: multiple, creatable: true, values: [Choix 1, Choix 2], options: [Choix 1, Choix 2, Choix 3] }
  - titre: With selected items
    texte: "`showSelected` répète en bas du panneau les choix faits ; on les décoche de là."
    instances:
      - { id: epingles, label: Choix, type: multiple, searchable: true, showSelected: true, values: [Choix 1, Choix 2], options: [Choix 1, Choix 2, Choix 3] }
  - titre: With selected items and create action
    instances:
      - { id: epingles-creation, label: Choix, type: multiple, searchable: true, showSelected: true, creatable: true, values: [Choix 1, Choix 2], options: [Choix 1, Choix 2, Choix 3] }
accessibilite:
  - "La boîte est un bouton nommé par son libellé. Il ouvre le panneau, et le navigateur annonce qu'il est ouvert."
  - "Les lignes sont de vrais radios (un choix) ou de vraies cases (plusieurs) : Tab entre dans le panneau, les flèches le parcourent, Espace choisit, Échap ferme. À un choix, un clic ferme le panneau."
  - "Le panneau ne suit pas le motif `combobox`, qui demanderait de réécrire ce clavier."
  - "La recherche annonce le nombre de résultats, ou « Aucun résultat », sans interrompre la saisie. La limite atteinte est dite à voix haute."
  - "L'erreur se dit par un message avec son icône. La boîte ne pose pas `aria-invalid` : un bouton ne le porte pas en ARIA."
  - "Sans JavaScript, le panneau s'ouvre et le choix part avec le formulaire, mais la boîte ne montre pas ce qu'on vient de choisir."
voirAussi:
  - { nom: Select, texte: Une liste déroulante simple, celle du navigateur. }
  - { nom: CheckboxGroup, texte: Quelques cases affichées d'emblée. }
  - { nom: RadioGroup, texte: Quelques radios affichés d'emblée. }
---

Utiliser le panneau de sélection quand le choix a besoin de plus que la liste du navigateur : une recherche parmi
beaucoup d'options, plusieurs valeurs à la fois, des choix qu'on veut garder sous les yeux, une option à créer.

Il se règle comme dans Figma : le type (un choix ou plusieurs), la taille, l'en-tête (titre, description,
recherche) et le pied (choix épinglés, limite, création). Le panneau prend la largeur de la boîte et s'ouvre
dessous, ou dessus quand la place manque.

## Quand ne pas l'utiliser

- Pour un seul choix sans recherche : utiliser la liste déroulante (`Select`).
- Pour quelques choix : utiliser des radios ou des cases (`RadioGroup`, `CheckboxGroup`).
- Pour une réponse libre : utiliser un champ texte (`Input`).
