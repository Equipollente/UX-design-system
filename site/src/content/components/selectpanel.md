---
title: Panneau de sélection
description: "Le panneau de sélection fait choisir une valeur, ou plusieurs, dans un panneau qui s'ouvre sous une boîte : avec recherche, en-tête et pied."
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=955-17742
exemples:
  - titre: Un choix
    instances:
      - { id: un, label: Pays, options: [France, Belgique, Suisse, Canada, Italie] }
      - { id: valeur, label: Pays, options: [France, Belgique, Suisse], value: Belgique }
  - titre: Plusieurs choix
    texte: "`type=multiple` remplace les coches par des cases. La boîte dit les choix faits, séparés par une virgule."
    instances:
      - { id: plusieurs, label: Techniques, type: multiple, options: [Gouache, Encre, Collage, Fusain], values: [Gouache] }
  - titre: En-tête
    texte: Un titre, une phrase qui dit ce qu'on choisit, et la recherche.
    instances:
      - { id: entete, label: Technique, heading: Technique dominante, description: "Celle qui domine dans l'œuvre.", searchable: true, options: [Gouache, Aquarelle, Huile, Encre, Fusain, Collage] }
  - titre: Avec des groupes
    texte: Un groupe range ses options sous un nom. Il ne s'imbrique pas, et `disabled` l'éteint tout entier.
    instances:
      - { id: groupes, label: Technique, options: [{ label: Peinture, options: [Gouache, Aquarelle, Huile] }, { label: Dessin, options: [Encre, Fusain] }, Collage] }
  - titre: Choix épinglés
    texte: "`showSelected` répète en bas du panneau les choix faits ; on les décoche de là."
    instances:
      - { id: epingles, label: Techniques, type: multiple, showSelected: true, options: [Gouache, Encre, Collage, Fusain], values: [Gouache, Collage] }
  - titre: Limite
    texte: "`max` éteint les cases restantes quand la limite est atteinte."
    instances:
      - { id: limite, label: Techniques, type: multiple, max: 2, options: [Gouache, Encre, Collage, Fusain], values: [Gouache, Collage] }
  - titre: Création
    texte: "La ligne « Créer une option » n'enregistre rien : le champ annonce l'événement `select-create`, et la page décide de garder l'option."
    instances:
      - { id: creation, label: Technique, creatable: true, placeholder: Choisir une technique, options: [Gouache, Encre, Collage] }
  - titre: Tailles
    instances:
      - { id: petit, label: Petit, size: small, options: [A, B] }
      - { id: grand, label: Grand, size: large, options: [A, B] }
  - titre: Obligatoire
    texte: Si aucun choix n'est fait à l'envoi, le panneau s'ouvre à la place du message du navigateur.
    instances:
      - { id: obligatoire, label: Pays, required: true, options: [France, Belgique] }
  - titre: Erreur
    instances:
      - { id: erreur, label: Pays, error: Un choix est nécessaire., options: [France, Belgique] }
  - titre: Désactivé
    instances:
      - { id: desactive, label: Pays, disabled: true, value: France, options: [France, Belgique] }
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
