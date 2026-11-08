---
title: Checkbox
description: La case à cocher dit oui ou non, seule ou dans une liste où plusieurs choix peuvent être retenus.
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=954-3642
exemples:
  - titre: Par défaut
    disposition: colonne
    cartes:
      - instances:
          - { id: rest, label: rest }
          - { id: rest-checked, label: rest checked, checked: true }
          - { id: rest-indeterminate, label: rest indeterminate, indeterminate: true }
      - etat: focus
        instances:
          - { id: focus, label: focus }
          - { id: focus-checked, label: focus checked, checked: true }
          - { id: focus-indeterminate, label: focus indeterminate, indeterminate: true }
      - instances:
          - { id: disabled, label: disabled, disabled: true }
          - { id: disabled-checked, label: disabled checked, checked: true, disabled: true }
          - { id: disabled-indeterminate, label: disabled indeterminate, indeterminate: true, disabled: true }
  - titre: Avec une aide
    instances:
      - { id: aide, label: Label text, hint: Caption text }
  - titre: Group vertical
    rangee: groupes
    composant: CheckboxGroup
    instances:
      - { id: vertical, legend: Label text, hideLegend: true, options: [{ value: a, label: Label text }, { value: b, label: Label text }, { value: c, label: Label text }, { value: d, label: Label text }] }
  - titre: Group horizontal
    rangee: groupes
    composant: CheckboxGroup
    instances:
      - { id: horizontal, legend: Label text, hideLegend: true, orientation: horizontal, options: [{ value: a, label: Label text }, { value: b, label: Label text }, { value: c, label: Label text }, { value: d, label: Label text }] }
accessibilite:
  - "C'est un `<input type=\"checkbox\">` natif : la barre d'espace coche et décoche, et le navigateur envoie la valeur avec le formulaire."
  - "Le libellé est relié à la case : cliquer dessus la coche."
  - "L'état indéterminé n'existe qu'en JavaScript dans le navigateur. Un petit script le pose au chargement ; sans lui, la case s'affiche décochée et le lecteur d'écran n'annonce pas « partiellement cochée »."
  - "Un anneau de 2 px entoure la case quand elle a le focus au clavier."
  - "Le survol n'est pas dessiné : seuls le curseur et le focus la distinguent."
voirAussi:
  - { nom: Toggle, texte: Un interrupteur dont l'effet est immédiat. }
  - { nom: Radio, texte: Un seul choix dans une courte liste. }
---

Utiliser une case pour un choix oui ou non. Elle attend l'envoi du formulaire pour compter : c'est ce qui la sépare
de l'interrupteur, dont l'effet est immédiat.

Pour plusieurs cases sous une même question, les rassembler dans un `CheckboxGroup`, qui les nomme par une légende et porte l'aide et le message de validation du groupe. Une case seule n'a ni erreur ni succès.

## Quand ne pas l'utiliser

- Pour un effet immédiat : utiliser un interrupteur (`Toggle`).
- Pour un seul choix parmi plusieurs : utiliser des radios (`Radio`).
