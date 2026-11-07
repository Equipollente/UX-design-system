---
title: Liste de choix
description: "La liste de choix est ce qui s'ouvre sous un Select : un en-tête, des choix à cocher, un pied. Elle sert un choix ou plusieurs."
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=955-17742
exemples:
  - titre: Un choix
    instances:
      - { id: un, heading: Pays, options: [France, Belgique, Suisse, Canada], value: Belgique }
  - titre: Plusieurs choix
    texte: "`type=multiple` remplace les coches par des cases."
    instances:
      - { id: plusieurs, type: multiple, heading: Techniques, options: [Gouache, Encre, Collage, Fusain], values: [Encre] }
  - titre: En-tête
    texte: Un titre, une phrase qui dit ce qu'on choisit, et la recherche.
    instances:
      - { id: entete, heading: Technique, description: "Celle qui domine dans l'œuvre.", searchable: true, options: [Gouache, Aquarelle, Huile, Encre, Fusain, Collage] }
  - titre: Avec des groupes
    instances:
      - { id: groupes, heading: Technique, options: [{ label: Peinture, options: [Gouache, Aquarelle, Huile] }, { label: Dessin, options: [Encre, Fusain] }, Collage] }
  - titre: Choix épinglés
    texte: "`showSelected` répète en bas les choix faits ; on les décoche de là."
    instances:
      - { id: epingles, type: multiple, showSelected: true, heading: Techniques, options: [Gouache, Encre, Collage, Fusain], values: [Gouache, Collage] }
  - titre: Limite
    texte: "`max` éteint les cases restantes quand la limite est atteinte."
    instances:
      - { id: limite, type: multiple, max: 2, heading: Techniques, options: [Gouache, Encre, Collage, Fusain], values: [Gouache, Collage] }
  - titre: Création
    texte: "La ligne « Créer une option » n'enregistre rien : la liste annonce l'événement `select-create`, et la page décide de garder l'option."
    instances:
      - { id: creation, creatable: true, heading: Technique, options: [Gouache, Encre, Collage] }
  - titre: Tailles
    instances:
      - { id: petite, size: small, heading: Petite, options: [A, B, C] }
      - { id: grande, size: large, heading: Grande, options: [A, B, C] }
  - titre: Désactivée
    instances:
      - { id: desactivee, disabled: true, heading: Pays, options: [France, Belgique], value: France }
accessibilite:
  - "Les lignes sont de vrais radios (un choix) ou de vraies cases (plusieurs) : Tab entre dans la liste, les flèches la parcourent, Espace choisit. C'est le clavier du navigateur, sauf les flèches des cases, que la liste ajoute."
  - "La liste ne suit pas le motif `combobox`, qui demanderait de réécrire ce clavier."
  - "La recherche annonce le nombre de résultats, ou « Aucun résultat », sans interrompre la saisie."
  - "Quand la limite est atteinte, la liste le dit à voix haute et éteint les cases restantes."
  - "Les groupes sont des `<fieldset>` avec leur `<legend>`."
voirAussi:
  - { nom: Select, texte: Une liste déroulante simple, sans recherche. }
  - { nom: CheckboxGroup, texte: Quelques cases affichées d'emblée. }
---

La liste de choix est la partie qui s'ouvre sous un Select. On la pose seule dans la page quand on veut une liste
toujours visible ; dans un Select, elle est un cadre flottant que le navigateur ouvre et ferme.

Elle se règle comme dans Figma : le type (un choix ou plusieurs), la taille, l'en-tête (titre, description,
recherche) et le pied (choix épinglés, limite, création).

## Quand ne pas l'utiliser

- Pour quelques choix : utiliser des radios ou des cases (`RadioGroup`, `CheckboxGroup`).
- Pour un champ de formulaire complet, avec libellé et message : utiliser `Select`.
