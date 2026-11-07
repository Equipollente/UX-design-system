---
title: Interrupteur
description: L'interrupteur allume ou éteint un réglage, et son effet est immédiat.
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=878-69950
exemples:
  - titre: Éteint
    instances:
      - { id: eteint, label: Notifications }
  - titre: Allumé
    instances:
      - { id: allume, label: Notifications, checked: true }
  - titre: Avec une aide
    instances:
      - { id: aide, label: Mode sombre, hint: Suit le réglage de votre système par défaut. }
  - titre: Désactivé
    instances:
      - { id: desactive, label: Notifications, disabled: true }
      - { id: desactive-allume, label: Notifications, checked: true, disabled: true }
accessibilite:
  - "C'est un `<input type=\"checkbox\" role=\"switch\">` natif : le lecteur d'écran annonce « activé » ou « désactivé » au lieu de « coché », et la barre d'espace bascule."
  - "Le libellé nomme un état, pas une action : « Notifications », pas « Notifier »."
  - "Le curseur glisse sur `motion/duration/quick`, que le système ramène à zéro quand l'utilisateur demande moins de mouvement : le trajet disparaît, pas les états."
  - "Un anneau de 2 px entoure la piste quand elle a le focus au clavier."
  - "Le survol n'est pas dessiné : seuls le curseur et le focus le distinguent."
voirAussi:
  - { nom: Checkbox, texte: Un choix qui attend l'envoi du formulaire. }
---

Utiliser un interrupteur pour un réglage dont l'effet est immédiat : on le bascule, et la page en tient compte tout
de suite, sans bouton d'envoi.

## Quand ne pas l'utiliser

- Pour un choix qui n'a d'effet qu'à l'envoi du formulaire : utiliser une case (`Checkbox`).
- Pour un choix parmi plusieurs : utiliser des radios (`Radio`).
