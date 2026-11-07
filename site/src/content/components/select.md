---
title: Liste déroulante
description: La liste déroulante fait choisir une valeur parmi des options connues d'avance, dans la liste du navigateur.
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=954-6709
exemples:
  - titre: Par défaut
    instances:
      - { id: defaut, label: Pays, options: [France, Belgique, Suisse, Canada, Italie] }
  - titre: Avec une valeur
    texte: La boîte montre le choix fait. Sans choix, elle montre l'invite, `Choisir` par défaut.
    instances:
      - { id: valeur, label: Pays, options: [France, Belgique, Suisse], value: Belgique }
      - { id: invite, label: Pays, options: [France, Belgique, Suisse], placeholder: Aucun pays choisi }
  - titre: Avec des groupes
    texte: Un groupe range ses options sous un nom. Il ne s'imbrique pas, et `disabled` l'éteint tout entier.
    instances:
      - { id: groupes, label: Technique, options: [{ label: Peinture, options: [Gouache, Aquarelle, Huile] }, { label: Dessin, options: [Encre, Fusain] }, Collage] }
  - titre: Tailles
    instances:
      - { id: petit, label: Petit, size: small, options: [A, B] }
      - { id: moyen, label: Moyen, size: medium, options: [A, B] }
      - { id: grand, label: Grand, size: large, options: [A, B] }
  - titre: Obligatoire
    texte: L'astérisque s'ajoute au libellé, et l'invite ne peut plus être rechoisie une fois un choix fait.
    instances:
      - { id: obligatoire, label: Pays, required: true, options: [France, Belgique] }
  - titre: Erreur
    instances:
      - { id: erreur, label: Pays, error: Un choix est nécessaire., options: [France, Belgique] }
  - titre: Désactivé
    instances:
      - { id: desactive, label: Pays, disabled: true, value: France, options: [France, Belgique] }
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
