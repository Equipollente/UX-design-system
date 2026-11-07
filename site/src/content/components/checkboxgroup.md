---
title: Groupe de cases
description: "Le groupe de cases pose une question et ses cases : plusieurs choix peuvent être retenus."
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=876-61534
exemples:
  - titre: Par défaut
    instances:
      - { id: defaut, legend: Techniques, options: [{ value: gouache, label: Gouache }, { value: encre, label: Encre }, { value: collage, label: Collage }] }
  - titre: Cases cochées
    texte: "`values` liste ce qui est coché à l'ouverture."
    instances:
      - { id: cochees, legend: Techniques, values: [gouache, collage], options: [{ value: gouache, label: Gouache }, { value: encre, label: Encre }, { value: collage, label: Collage }] }
  - titre: Avec une aide
    instances:
      - { id: aide, legend: Techniques, options: [{ value: gouache, label: Gouache }, { value: encre, label: Encre, hint: Noire ou de couleur. }] }
  - titre: Horizontal
    instances:
      - { id: horizontal, legend: Disponibilité, orientation: horizontal, options: [{ value: vente, label: En vente }, { value: expose, label: Exposée }] }
  - titre: Désactivé
    texte: "`disabled` éteint tout le groupe ; une option peut aussi s'éteindre seule."
    instances:
      - { id: desactive, legend: Techniques, disabled: true, options: [{ value: gouache, label: Gouache }, { value: encre, label: Encre }] }
accessibilite:
  - "Le groupe est un `<fieldset>`, nommé par sa `<legend>` : un lecteur d'écran annonce la question avant la première case."
  - "Chaque case garde son propre libellé et son aide, reliés comme pour une case seule."
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
