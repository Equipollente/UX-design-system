---
title: Checkbox Group
description: "Le groupe de cases pose une question et ses cases : plusieurs choix peuvent être retenus."
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=876-61534
exemples:
  - titre: Vertical
    instances:
      - { id: vertical, legend: Label text, options: [{ value: a, label: Choice 1 }, { value: b, label: Choice 2 }, { value: c, label: Choice 3 }, { value: d, label: Choice 4 }] }
  - titre: Horizontal
    instances:
      - { id: horizontal, legend: Label text, orientation: horizontal, hint: Caption text, options: [{ value: a, label: Choice 1 }, { value: b, label: Choice 2 }, { value: c, label: Choice 3 }, { value: d, label: Choice 4 }] }
  - titre: Avec une aide
    instances:
      - { id: aide, legend: Label text, hint: Caption text, options: [{ value: a, label: Choice 1 }, { value: b, label: Choice 2 }, { value: c, label: Choice 3 }, { value: d, label: Choice 4 }] }
  - titre: Avec validation
    instances:
      - { id: validation, legend: Label text, success: Validation message, options: [{ value: a, label: Choice 1 }, { value: b, label: Choice 2 }, { value: c, label: Choice 3 }, { value: d, label: Choice 4 }] }
  - titre: Avec une aide
    instances:
      - { id: aide-seule, legend: Label text, hideLegend: true, options: [{ value: a, label: Label text, hint: Caption text }] }
accessibilite:
  - "Le groupe est un `<fieldset>`, nommé par sa `<legend>` : un lecteur d'écran annonce la question avant la première case."
  - "Chaque case garde son propre libellé et son aide, reliés comme pour une case seule."
  - "L'aide et le message sont désignés par `aria-describedby` sur le `<fieldset>`, et lus après la légende."
  - "`hideLegend` retire la légende de l'écran, jamais du document."
voirAussi:
  - { nom: Checkbox, texte: Une case seule, ou à placer à la main. }
  - { nom: RadioGroup, texte: Un seul choix. }
---

Utiliser un groupe de cases pour une question à laquelle on peut répondre plusieurs fois : des techniques, des
disponibilités. Le groupe prend ses choix par la prop `options`, pas par des enfants : Astro ne peut pas poser un
même `name` sur ce qu'on glisse dans un emplacement.

## Quand ne pas l'utiliser

- Pour un seul choix : utiliser des radios (`RadioGroup`).
- Pour un oui ou non seul : utiliser une case (`Checkbox`).
