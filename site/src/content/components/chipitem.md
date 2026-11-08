---
title: Chip Item
description: "La pastille se retient ou se relâche d'un clic, et porte une croix tant qu'elle est retenue."
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=1025-6238
exemples:
  - titre: États
    texte: Au repos, retenue, puis désactivée. Le survol, l'appui et le focus se voient en interagissant.
    disposition: contenu
    cartes:
      - instances:
          - { id: repos, label: Value }
      - instances:
          - { id: retenue, label: Value, selected: true }
      - instances:
          - { id: eteinte, label: Value, selected: true, disabled: true }
accessibilite:
  - "C'est une vraie case à cocher : elle se retient au clic comme à la barre d'espace, et son état est lu par les lecteurs d'écran."
  - "La croix n'est pas un second contrôle : cliquer n'importe où sur la pastille la relâche."
  - "Le fond plein et la croix portent l'état retenu : la couleur n'est pas le seul indice (WCAG 1.4.1)."
  - "L'anneau de focus est celui des champs du système, 2 px (WCAG 2.4.7)."
voirAussi:
  - { nom: ChipsField, texte: Les pastilles réunies dans un champ, avec leur compte et un maximum. }
  - { nom: Checkbox, texte: La même case, dessinée en carré. }
---

Utiliser une pastille pour une réponse courte qu'on retient ou qu'on relâche. Seule, elle est une case isolée ;
réunies dans un `ChipsField`, les pastilles partagent leur nom, leur compte et leur maximum.

## Quand ne pas l'utiliser

- Pour déclencher une action : utiliser un bouton (`Button`).
- Pour afficher une catégorie qu'on ne touche pas : utiliser une étiquette (`Tag`).
