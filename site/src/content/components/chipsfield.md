---
title: Chips Field
description: "Le champ à pastilles pose une question et toutes ses réponses possibles : on retient celles qui conviennent, jusqu'à un maximum si on en pose un."
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=1025-26987
exemples:
  - titre: Toutes les options
    texte: La liste complète des options est visible. On retient ou on relâche une pastille d'un clic, et le compte suit.
    instances:
      - { id: libres, legend: Field Label, values: [f, h], options: [{ value: a, label: Choice 1 }, { value: b, label: Choice 2 }, { value: c, label: Choice 3 }, { value: d, label: Choice 4 }, { value: e, label: Choice 5, disabled: true }, { value: f, label: Choice 6 }, { value: g, label: Choice 7 }, { value: h, label: Choice 8 }] }
  - titre: Avec un maximum
    texte: Une fois le maximum atteint, les autres pastilles s'éteignent et le message devient un avertissement. Elles se rallument dès qu'on en relâche une.
    instances:
      - { id: maximum, legend: Field Label, max: 2, values: [f, h], options: [{ value: a, label: Choice 1 }, { value: b, label: Choice 2 }, { value: c, label: Choice 3 }, { value: d, label: Choice 4 }, { value: e, label: Choice 5 }, { value: f, label: Choice 6 }, { value: g, label: Choice 7 }, { value: h, label: Choice 8 }] }
  - titre: Les choix d'un SelectPanel
    texte: Le champ ne montre que ce que le panneau a retenu. Choisir dans le panneau ajoute une pastille ; la croix d'une pastille décoche l'option dans le panneau. `for` porte l'`id` du panneau, et les pastilles ne s'envoient pas avec le formulaire — le panneau porte déjà les mêmes valeurs.
    disposition: colonne
    instances:
      - { composant: SelectPanel, id: choix, label: Choix, type: multiple, values: [f, h], options: [{ value: a, label: Choice 1 }, { value: b, label: Choice 2 }, { value: c, label: Choice 3 }, { value: d, label: Choice 4 }, { value: e, label: Choice 5 }, { value: f, label: Choice 6 }, { value: g, label: Choice 7 }, { value: h, label: Choice 8 }] }
      - { id: retenus, legend: Field Label, selectable: false, for: choix, values: [f, h], options: [{ value: a, label: Choice 1 }, { value: b, label: Choice 2 }, { value: c, label: Choice 3 }, { value: d, label: Choice 4 }, { value: e, label: Choice 5 }, { value: f, label: Choice 6 }, { value: g, label: Choice 7 }, { value: h, label: Choice 8 }] }
accessibilite:
  - "Le champ est un `role=\"group\"` nommé par son libellé : un lecteur d'écran annonce la question avant la première pastille. Ce n'est pas un `<fieldset>`, parce qu'une légende ne peut pas partager sa rangée avec le message."
  - "Chaque pastille est une vraie case à cocher : elle se retient au clic comme à la barre d'espace, et le formulaire envoie les pastilles retenues."
  - "La croix d'une pastille retenue n'est pas un bouton : la pastille entière se relâche, croix comprise."
  - "Le compte est une zone `aria-live` polie : il est annoncé quand il change, sans interrompre ce qu'on lit."
  - "Au maximum, les pastilles non retenues sont désactivées et sortent du parcours au clavier ; celles qui sont retenues restent actives, pour pouvoir être relâchées."
voirAussi:
  - { nom: ChipItem, texte: La pastille seule. }
  - { nom: SelectPanel, texte: Le panneau dont ce champ peut montrer les choix retenus. }
  - { nom: CheckboxGroup, texte: Les mêmes choix multiples, dessinés en cases. }
  - { nom: Select, texte: Quand les options sont trop nombreuses pour être toutes visibles. }
---

Utiliser un champ à pastilles pour une question à plusieurs réponses courtes dont on veut voir toutes les options d'un
coup : des techniques, des thèmes. Le champ prend ses choix par la prop `options`, pas par des enfants : Astro ne peut
pas poser un même `name` sur ce qu'on glisse dans un emplacement, ni compter les pastilles retenues pour les éteindre
au maximum.

## Quand ne pas l'utiliser

- Pour un seul choix : utiliser des radios (`RadioGroup`).
- Pour des options trop nombreuses ou à chercher : utiliser une liste (`Select`).
- Pour des mots longs : une pastille ne se coupe pas en deux lignes.

## Ce que la maquette ne dit pas

- **La largeur minimale de la liste.** Figma la lie à `viewport/width`, qui vaut la largeur de l'écran — 1200 sur
  ordinateur, 390 sur mobile. Le code ne l'applique pas : la liste déborderait d'un champ plus étroit que l'écran.
- **L'avertissement.** `_FieldMessage` n'a pas de variante `warning` dans Figma. Le code lui prête le triangle de
  l'erreur : seule l'encre les sépare, et le mot du message porte la différence (WCAG 1.4.1).
