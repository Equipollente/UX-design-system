---
title: Icon Label
description: "Une icône seule dans un carré arrondi : le repère visuel d'un type ou d'une catégorie."
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=1046-32536
exemples:
  - titre: Fond clair
    texte: L'emphase par défaut. Douze couleurs ; `danger` est réservé à ce qui échoue ou détruit, `warning` dit « à savoir ».
    disposition: contenu
    instances:
      - { icon: book-open }
      - { icon: book-open, variant: secondary }
      - { icon: book-open, variant: danger }
      - { icon: book-open, variant: rose }
      - { icon: book-open, variant: sun }
      - { icon: book-open, variant: clay }
      - { icon: book-open, variant: teal }
      - { icon: book-open, variant: highlight }
      - { icon: book-open, variant: neutral }
      - { icon: book-open, variant: warning }
      - { icon: book-open, variant: success }
      - { icon: book-open, variant: info }
  - titre: Fond plein
    texte: Plus appuyée. L'icône du `warning` n'atteint pas le contraste, voir en bas de page.
    disposition: contenu
    instances:
      - { icon: book-open, emphasis: bold }
      - { icon: book-open, emphasis: bold, variant: secondary }
      - { icon: book-open, emphasis: bold, variant: danger }
      - { icon: book-open, emphasis: bold, variant: rose }
      - { icon: book-open, emphasis: bold, variant: sun }
      - { icon: book-open, emphasis: bold, variant: clay }
      - { icon: book-open, emphasis: bold, variant: teal }
      - { icon: book-open, emphasis: bold, variant: highlight }
      - { icon: book-open, emphasis: bold, variant: neutral }
      - { icon: book-open, emphasis: bold, variant: warning }
      - { icon: book-open, emphasis: bold, variant: success }
      - { icon: book-open, emphasis: bold, variant: info }
  - titre: Tailles
    texte: "Le carré et l'icône grandissent ensemble : 44 et 20, 48 et 24, 56 et 28."
    disposition: contenu
    instances:
      - { icon: book-open, size: sm }
      - { icon: book-open, size: md }
      - { icon: book-open, size: lg }
accessibilite:
  - "L'icône est décorative et masquée aux lecteurs d'écran : elle double un mot déjà écrit à côté. Le sens doit toujours être écrit en toutes lettres."
  - "`label` n'est à remplir que lorsque l'icône est seule à porter le sens. Le texte dit alors la chose, pas le dessin : « Brouillon », pas « livre ouvert »."
  - "Ce n'est pas un contrôle : aucun rôle, aucun état, aucun clic. Un carré sur lequel on clique est un IconButton."
  - "La couleur ne porte pas le sens à elle seule (WCAG 1.4.1)."
  - "Contraste de l'icône (WCAG 1.4.11, 3:1) : fond clair, les 24 paires dépassent 7,74:1 ; fond plein, toutes tiennent sauf `warning`."
voirAussi:
  - { nom: LabelPill, texte: L'étiquette avec un mot. }
  - { nom: IconButton, texte: Un carré sur lequel on clique. }
---

Utiliser une icône dans un carré pour repérer d'un coup d'œil le type de ce qui est à côté : une catégorie de contenu, une
rubrique. Elle accompagne un mot, elle ne le remplace pas.

## Quand ne pas l'utiliser

- Pour déclencher une action : utiliser un bouton-icône (`IconButton`).
- Pour une étiquette avec un mot : utiliser `Label`.

## Ce que la maquette ne dit pas

- **Fond plein : l'icône du `warning` fait 1,75:1** sur son fond ambre, dans les deux thèmes. Le code suit Figma : la correction va
  dans la variable `color/icon/warning/on-bold`.
- **La variante `success` s'écrit `sucess` dans Figma**, dans les deux jeux. Le code l'écrit `success`.
