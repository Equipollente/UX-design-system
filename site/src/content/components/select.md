---
title: Select
description: Choisir une seule option dans une liste fermée de choix prévus d'avance.
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=954-6709
exemples:
  - titre: Par défaut
    instances:
      - { id: defaut, label: Libellé, value: Valeur, options: [Valeur, Choix 2, Choix 3] }
  - titre: Taille personnalisée
    texte: Choisir la taille selon la place disponible et le contexte. Les petites tailles pour les espaces serrés, les grandes pour les zones ouvertes, sinon le champ paraît disproportionné à côté de grands éléments.
    instances:
      - { id: petit, label: Small, size: small, value: Valeur, options: [Valeur, Choix 2] }
      - { id: moyen, label: Medium (par défaut), size: medium, value: Valeur, options: [Valeur, Choix 2] }
      - { id: grand, label: Large, size: large, value: Valeur, options: [Valeur, Choix 2] }
  - titre: Avec une aide
    instances:
      - { id: aide, label: Libellé, hint: Texte d'aide, value: Valeur, options: [Valeur, Choix 2] }
  - titre: Avec un placeholder
    texte: Affiche un texte quand aucune option n'est choisie. Il est masqué dans un champ requis dès qu'un choix est fait.
    instances:
      - { id: invite, label: Libellé, placeholder: Aucun choix sélectionné, options: [Valeur, Choix 2] }
  - titre: Avec un message de validation
    instances:
      - { id: erreur, label: Libellé, error: Une erreur s'est produite, value: Valeur, options: [Valeur, Choix 2] }
accessibilite:
  - "C'est le `<select>` du navigateur : le clavier (flèches, saisie de la première lettre, Échap), les lecteurs d'écran et la liste sur mobile viennent du système."
  - "Le libellé est lié au champ par `for` ; l'aide et le message sont désignés par `aria-describedby`."
  - "L'erreur pose `aria-invalid` et se dit par un message avec son icône : la couleur ne porte pas seule le sens."
  - "Les groupes sont de vrais `<optgroup>`, annoncés avec leur nom."
voirAussi:
  - { nom: SelectPanel, texte: Un choix avec recherche, plusieurs valeurs, un en-tête ou un pied. }
  - { nom: RadioGroup, texte: Quelques choix, affichés d'emblée. }
  - { nom: Input, texte: Un champ où l'on écrit sa réponse. }
---

Utiliser une liste déroulante pour choisir une valeur parmi des options connues d'avance, quand elles sont trop
nombreuses pour s'afficher toutes. Pour quatre choix ou moins, des radios se voient d'un coup d'œil et se
choisissent en un clic.

La liste qui s'ouvre est celle du navigateur : elle ne se dessine pas, mais elle est toujours accessible. Dès qu'il
faut chercher, cocher plusieurs valeurs ou créer une option, c'est `SelectPanel`.

## Quand ne pas l'utiliser

- Pour plusieurs choix à la fois, ou une liste qui se cherche : utiliser `SelectPanel`.
- Pour quelques choix : utiliser des radios (`RadioGroup`).
- Pour une réponse libre : utiliser un champ texte (`Input`).
