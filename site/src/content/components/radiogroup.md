---
title: Groupe de radios
description: "Le groupe de radios pose une question et ses réponses : un seul choix peut être retenu."
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=875-53524
exemples:
  - titre: Par défaut
    instances:
      - { id: defaut, legend: Format, options: [{ value: a4, label: A4 }, { value: a3, label: A3 }, { value: a2, label: A2 }] }
  - titre: Un choix retenu
    instances:
      - { id: retenu, legend: Format, value: a4, options: [{ value: a4, label: A4 }, { value: a3, label: A3 }] }
  - titre: Obligatoire
    texte: L'astérisque s'ajoute à la question, et le navigateur attend une réponse.
    instances:
      - { id: obligatoire, legend: Format, required: true, options: [{ value: a4, label: A4 }, { value: a3, label: A3 }] }
  - titre: Avec une aide
    instances:
      - { id: aide, legend: Format, options: [{ value: a4, label: A4 }, { value: a3, label: A3, hint: Pour les grandes œuvres. }] }
  - titre: Horizontal
    instances:
      - { id: horizontal, legend: Orientation, orientation: horizontal, options: [{ value: portrait, label: Portrait }, { value: paysage, label: Paysage }] }
  - titre: Désactivé
    instances:
      - { id: desactive, legend: Format, disabled: true, options: [{ value: a4, label: A4 }, { value: a3, label: A3 }] }
accessibilite:
  - "Le groupe est un `<fieldset>`, nommé par sa `<legend>` : un lecteur d'écran annonce la question avant le premier choix."
  - "Les radios partagent le même `name`, posé par le groupe : c'est ce qui les fait s'exclure."
  - "Au clavier, Tab entre dans le groupe une seule fois, et les flèches le parcourent : c'est le comportement du navigateur."
  - "`required` pose l'attribut sur chaque radio et l'astérisque sur la légende."
voirAussi:
  - { nom: Radio, texte: Un radio seul, ou à placer à la main. }
  - { nom: Select, texte: Beaucoup de choix, ou une liste qui se cherche. }
---

Utiliser un groupe de radios pour une question à réponse unique que l'on veut voir d'un coup d'œil : un format,
une orientation. Au-delà de quatre ou cinq choix, une liste déroulante (`Select`) tient moins de place.

Le groupe prend ses choix par la prop `options`, pas par des enfants : un composant Astro ne peut pas poser le
même `name` sur ce qu'on glisse dans son emplacement.

## Quand ne pas l'utiliser

- Pour plusieurs choix à la fois : utiliser des cases (`CheckboxGroup`).
- Pour beaucoup de choix : utiliser une liste déroulante (`Select`).
