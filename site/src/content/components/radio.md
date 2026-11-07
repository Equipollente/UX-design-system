---
title: Bouton radio
description: Le bouton radio propose un choix dans une courte liste où un seul peut être retenu.
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=876-64956
exemples:
  - titre: Un choix
    texte: Deux radios ne s'excluent que s'ils partagent le même `name`. Un radio seul n'a donc de sens que dans un groupe.
    instances:
      - { id: choix-a, label: A4, name: format }
      - { id: choix-b, label: A3, name: format }
  - titre: Retenu
    instances:
      - { id: retenu, label: A4, name: format-retenu, checked: true }
  - titre: Avec une aide
    instances:
      - { id: aide, label: A3, name: format-aide, hint: Pour les grandes œuvres. }
  - titre: Désactivé
    instances:
      - { id: desactive, label: A2, name: format-desactive, disabled: true }
accessibilite:
  - "C'est un `<input type=\"radio\">` natif. Au clavier, Tab entre dans le groupe une seule fois et les flèches le parcourent : c'est le comportement du navigateur, rien n'est réécrit."
  - "La question posée au groupe n'est pas dans le radio : elle va en légende d'un `<fieldset>`. `RadioGroup` le fait."
  - "Le libellé est relié au rond : cliquer dessus le choisit."
  - "Un anneau de 2 px entoure le rond quand il a le focus au clavier."
  - "Le survol n'est pas dessiné : seuls le curseur et le focus le distinguent."
voirAussi:
  - { nom: Checkbox, texte: Plusieurs choix possibles. }
  - { nom: Select, texte: Une liste longue, ou qui se cherche. }
---

Utiliser des radios pour choisir une réponse dans une courte liste, que l'on veut voir d'un coup d'œil. Au-delà de
quelques choix, une liste déroulante (`Select`) tient moins de place.

Pour la question et ses réponses ensemble, utiliser `RadioGroup`, qui pose la légende et le même `name` sur chaque radio.

## Quand ne pas l'utiliser

- Pour plusieurs choix possibles : utiliser des cases (`Checkbox`).
- Pour un oui ou non : utiliser une case ou un interrupteur.
