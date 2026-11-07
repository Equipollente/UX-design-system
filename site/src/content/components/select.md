---
title: Liste déroulante
description: La liste déroulante fait choisir une valeur parmi des options, quand elles sont trop nombreuses pour être affichées d'emblée.
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=954-6709
exemples:
  - titre: Par défaut
    instances:
      - { id: defaut, label: Pays, options: [France, Belgique, Suisse, Canada, Italie] }
  - titre: Avec une valeur
    texte: La boîte montre le choix fait. Sans choix, elle montre l'invite, `Choisir` par défaut.
    instances:
      - { id: valeur, label: Pays, options: [France, Belgique, Suisse], value: Belgique }
      - { id: invite, label: Pays, options: [France, Belgique, Suisse], placeholder: Choisir un pays }
  - titre: Avec recherche
    texte: Au-delà de sept ou huit options, la recherche aide à retrouver la bonne. Elle masque ce qui ne correspond pas et annonce le nombre de résultats.
    instances:
      - { id: recherche, label: Pays, searchable: true, options: [France, Belgique, Suisse, Canada, Italie, Japon, Portugal, Autriche, Brésil] }
  - titre: Avec des groupes
    texte: Un groupe range ses options sous un nom. Il ne s'imbrique pas, et `disabled` l'éteint tout entier.
    instances:
      - { id: groupes, label: Technique, options: [{ label: Peinture, options: [Gouache, Aquarelle, Huile] }, { label: Dessin, options: [Encre, Fusain] }, Collage] }
  - titre: Avec création
    texte: "La ligne « Créer une option » apparaît quand le texte cherché n'existe pas. Elle n'enregistre rien : le champ annonce l'événement `select-create`, et la page décide de garder l'option."
    instances:
      - { id: creation, label: Technique, creatable: true, placeholder: Choisir une technique, options: [Gouache, Encre, Collage] }
  - titre: Tailles
    instances:
      - { id: petit, label: Petit, size: small, options: [A, B] }
      - { id: grand, label: Grand, size: large, options: [A, B] }
  - titre: Obligatoire
    texte: Si aucun choix n'est fait à l'envoi, la liste s'ouvre à la place du message du navigateur.
    instances:
      - { id: obligatoire, label: Pays, required: true, options: [France, Belgique] }
  - titre: Erreur
    instances:
      - { id: erreur, label: Pays, error: Un choix est nécessaire., options: [France, Belgique] }
  - titre: Désactivé
    instances:
      - { id: desactive, label: Pays, disabled: true, value: France, options: [France, Belgique] }
accessibilite:
  - "La boîte est un bouton nommé par son libellé. Il ouvre la liste, et le navigateur annonce qu'elle est ouverte."
  - "Les choix sont de vrais radios : Tab entre dans la liste, les flèches la parcourent sans la fermer, Entrée choisit et ferme, Échap ferme. C'est le clavier du navigateur."
  - "La liste ne suit pas le motif `combobox`, qui demanderait de réécrire ce clavier."
  - "La recherche annonce le nombre de résultats, ou « Aucun résultat », sans interrompre la saisie."
  - "L'erreur se dit par un message avec son icône. La boîte ne pose pas `aria-invalid` : un bouton ne le porte pas en ARIA."
  - "Sans JavaScript, la liste s'ouvre et le choix part avec le formulaire, mais la boîte ne montre pas ce qu'on vient de choisir."
voirAussi:
  - { nom: RadioGroup, texte: Quelques choix, affichés d'emblée. }
  - { nom: Input, texte: Un champ où l'on écrit sa réponse. }
---

Utiliser une liste déroulante pour choisir une valeur parmi des options connues d'avance, quand elles sont trop
nombreuses pour s'afficher toutes. Pour quatre choix ou moins, des radios se voient d'un coup d'œil et se
choisissent en un clic.

La liste est dessinée par le système : le menu du navigateur est hors d'atteinte du CSS, et ne sait ni chercher,
ni créer une option. Elle prend la largeur de la boîte et s'ouvre dessous, ou dessus quand la place manque.

## Quand ne pas l'utiliser

- Pour plusieurs choix à la fois : le choix multiple est à venir (`MultiSelect`).
- Pour quelques choix : utiliser des radios (`RadioGroup`).
- Pour une réponse libre : utiliser un champ texte (`Input`).
