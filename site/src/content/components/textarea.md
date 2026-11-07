---
title: Zone de texte
description: La zone de texte recueille une phrase, ou plusieurs, dont on ne connaît que la longueur maximale.
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=979-952
exemples:
  - titre: Par défaut
    instances:
      - { id: defaut, label: Description, placeholder: Décrivez l'œuvre }
  - titre: Hauteur
    texte: La hauteur se règle en lignes, jamais en pixels. La boîte se mesure sur sa propre typographie et grandit avec elle.
    instances:
      - { id: hauteur, label: Message, rows: 8 }
  - titre: Avec un compteur
    texte: Le compteur dit combien de caractères il reste. Il demande une limite (`maxlength`) et se met à jour à chaque frappe.
    instances:
      - { id: compteur, label: Présentation, counter: true, maxlength: 140, value: Un début de texte, hint: Quelques phrases suffisent. }
  - titre: Erreur
    instances:
      - { id: erreur, label: Message, value: Court, error: Le message est trop court. }
  - titre: Succès
    instances:
      - { id: succes, label: Message, value: Un texte complet, success: "Merci, votre message est reçu." }
  - titre: Désactivé
    instances:
      - { id: desactive, label: Message, value: Texte verrouillé, disabled: true }
accessibilite:
  - "Le libellé est relié à la zone par `id` : un lecteur d'écran l'annonce en entrant dans le champ."
  - "L'aide, le message de validation et le compteur sont lus à l'entrée, dans cet ordre de priorité : le message, l'aide, puis le compteur."
  - "Le compteur n'est pas une région vivante : annoncer chaque lettre interromprait la saisie. Sans JavaScript, il garde son nombre de départ ; `maxlength` reste appliqué par le navigateur."
  - "L'erreur pose `aria-invalid`. Elle et le succès se disent par une icône et un texte, pas par la couleur seule."
  - "La zone se redimensionne verticalement, jamais en largeur."
voirAussi:
  - { nom: Input, texte: Le champ pour une seule ligne. }
---

Utiliser une zone de texte pour une phrase, ou plusieurs : une description, un message. C'est le seul champ
du système qui compte ses caractères.

Ce n'est pas un éditeur : rien ici ne met en gras, n'insère de lien ni ne garde de mise en forme.

La zone n'a pas de taille : sa hauteur passe par `rows`, comme celle d'un `<textarea>`.

## Quand ne pas l'utiliser

- Pour une réponse qui tient sur une ligne : utiliser le champ texte (`Input`).
- Pour un texte mis en forme : le système n'a pas d'éditeur.
