---
title: Label Counter
description: "L'étiquette à trait, sans fond : une icône facultative et un mot."
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=1046-33241
exemples:
  - titre: Avec une icône
    texte: Onze couleurs ; `danger` est réservé à ce qui échoue ou détruit, `warning` dit « à savoir ». Il n'y a pas de `success`, Figma ne le dessine pas.
    disposition: contenu
    instances:
      - { label: primary, icon: book-open }
      - { label: secondary, icon: book-open, variant: secondary }
      - { label: danger, icon: book-open, variant: danger }
      - { label: rose, icon: book-open, variant: rose }
      - { label: sun, icon: book-open, variant: sun }
      - { label: clay, icon: book-open, variant: clay }
      - { label: teal, icon: book-open, variant: teal }
      - { label: highlight, icon: book-open, variant: highlight }
      - { label: neutral, icon: book-open, variant: neutral }
      - { label: info, icon: book-open, variant: info }
      - { label: warning, icon: book-open, variant: warning }
  - titre: Sans icône
    texte: "L'icône est facultative : sans elle l'étiquette se resserre sur son mot."
    disposition: contenu
    instances:
      - { label: primary }
      - { label: info, variant: info }
      - { label: warning, variant: warning }
  - titre: Tailles
    texte: "L'icône grandit avec le rembourrage : 20, 24 et 28. Le texte reste à 14."
    disposition: contenu
    instances:
      - { label: sm, icon: book-open, size: sm }
      - { label: md, icon: book-open, size: md }
      - { label: lg, icon: book-open, size: lg }
accessibilite:
  - "C'est un texte inerte : elle n'a ni rôle ni état, et se lit comme le mot qu'elle porte. L'icône est décorative et masquée aux lecteurs d'écran."
  - "Le mot doit dire ce qu'il veut dire : la couleur ne porte pas le sens à elle seule (WCAG 1.4.1)."
  - "Le texte et l'icône dépassent 8,44:1 sur blanc, dans les deux thèmes (WCAG 1.4.3). Le trait est plus faible, voir plus bas."
  - "Le mot ne se coupe jamais : un mot long déborde plutôt que de perdre sa forme."
voirAussi:
  - { nom: LabelPill, texte: L'étiquette à fond. }
  - { nom: IconLabel, texte: L'icône seule dans un carré. }
---

Utiliser une étiquette à trait pour un mot qui qualifie un contenu voisin sans le charger d'un aplat : une rubrique, un
statut discret. Le trait et le texte portent la couleur, le fond reste celui de la page.

## Quand ne pas l'utiliser

- Pour un statut qui doit se voir en premier : utiliser `Label` en fond plein.
- Pour déclencher une action : utiliser un bouton (`Button`).
- Pour afficher un nombre : le libellé est du texte libre, malgré le « counter » du nom Figma.

## Ce que la maquette ne dit pas

- **Le trait est sous 3:1 pour cinq couleurs.** `sun` et `warning` font 1,75:1, `highlight` 2,20:1 (Default), `teal` et `info`
  2,94:1 — WCAG 1.4.11. Le trait ne dessine pas un contrôle et le mot porte le sens ; le code suit Figma et l'écrit.
- **`iconEnd` est déclaré, jamais dessiné.** Figma a les propriétés `iconEnd` et `iconEnd?`, mais aucun calque ne les porte :
  le code ne les implémente pas.
- **Le trait (1) n'est lié à aucune variable**, alors que `border/width/default` existe.
- **La variante `info` n'a pas ses propriétés liées** : son icône et son texte ne sont pas reliés à `icon` et `label`.
