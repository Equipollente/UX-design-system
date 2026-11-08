---
title: Label
description: "L'étiquette nomme ou classe ce qu'elle accompagne : un statut, une catégorie, un thème. Elle remplace Tag."
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=1046-30984
exemples:
  - titre: Fond clair
    texte: L'emphase par défaut. Douze couleurs ; `danger` est réservé à ce qui échoue ou détruit, `warning` dit « à savoir ».
    disposition: contenu
    instances:
      - { label: primary }
      - { label: secondary, variant: secondary }
      - { label: danger, variant: danger }
      - { label: rose, variant: rose }
      - { label: sun, variant: sun }
      - { label: clay, variant: clay }
      - { label: teal, variant: teal }
      - { label: highlight, variant: highlight }
      - { label: neutral, variant: neutral }
      - { label: warning, variant: warning }
      - { label: success, variant: success }
      - { label: info, variant: info }
  - titre: Fond plein
    texte: Plus appuyée, à réserver à ce qui doit se voir en premier. Voir en bas de page les paires qui n'atteignent pas le contraste.
    disposition: contenu
    instances:
      - { label: primary, emphasis: bold }
      - { label: secondary, emphasis: bold, variant: secondary }
      - { label: danger, emphasis: bold, variant: danger }
      - { label: rose, emphasis: bold, variant: rose }
      - { label: sun, emphasis: bold, variant: sun }
      - { label: clay, emphasis: bold, variant: clay }
      - { label: teal, emphasis: bold, variant: teal }
      - { label: highlight, emphasis: bold, variant: highlight }
      - { label: neutral, emphasis: bold, variant: neutral }
      - { label: warning, emphasis: bold, variant: warning }
      - { label: success, emphasis: bold, variant: success }
      - { label: info, emphasis: bold, variant: info }
  - titre: Tailles
    texte: "Le texte reste à 14 : seule la pastille grandit."
    disposition: contenu
    instances:
      - { label: sm, size: sm }
      - { label: md, size: md }
      - { label: lg, size: lg }
accessibilite:
  - "C'est une pastille de texte, inerte : elle n'a ni rôle ni état, et se lit comme le texte qu'elle porte."
  - "Le mot doit dire ce qu'il veut dire : la couleur ne porte pas le sens à elle seule (WCAG 1.4.1). Un « danger » rouge sans le mot est invisible pour qui ne distingue pas les couleurs."
  - "Le texte ne se coupe jamais : un mot long déborde plutôt que de perdre sa forme de pilule. Choisir des mots courts."
  - "Fond clair : les 24 paires mesurées (12 couleurs, 2 thèmes) dépassent 7,74:1."
  - "Fond plein : 19 paires sur 24 atteignent 4,5:1. Les cinq autres sont listées plus bas."
voirAussi:
  - { nom: Button, texte: Une pastille sur laquelle on clique. }
  - { nom: Tag, texte: "L'ancienne étiquette, que Label remplace. Dépréciée." }
---

Utiliser une étiquette pour un mot court qui qualifie un contenu voisin : « Brouillon » sur un projet, « Nouveau » sur une
fonctionnalité. La couleur accompagne le mot, elle ne le remplace pas.

## Quand ne pas l'utiliser

- Pour déclencher une action ou ouvrir une page : utiliser un bouton (`Button`).
- Pour un mot long ou une phrase : une étiquette ne se coupe pas en deux lignes.

## Ce que la maquette ne dit pas

- **Fond plein : cinq paires n'atteignent pas 4,5:1.** `warning` fait 1,75:1 (texte blanc sur ambre) et `success` 3,02:1, dans les
  deux thèmes ; `rose` fait 4,31:1 en Prof Hub. Le code suit Figma : la correction va dans les variables `color/text/*/on-bold`.
- **Le rembourrage vertical de `md` lit `stack/control/small/gap`.** C'est un écart, lié comme un rembourrage dans Figma : aucune
  variable de rembourrage ne vaut 8 (xsmall 6, small 12).
- **`Tag` disparaît avec sa variante `outline`.** Une pilule à liseré n'existe plus dans le système.
