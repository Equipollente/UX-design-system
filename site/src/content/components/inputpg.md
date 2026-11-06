---
title: Champ texte
description: Le champ texte recueille une valeur qui tient sur une seule ligne.
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=936-9502
exemples:
  - titre: Par défaut
    instances:
      - { id: defaut, label: Libellé }
  - titre: Obligatoire
    texte: L'astérisque s'ajoute au libellé, et le champ devient obligatoire pour le navigateur.
    instances:
      - { id: obligatoire, label: Libellé, required: true }
  - titre: Tailles
    texte: Adapter la hauteur au contexte. Une petite taille dans un espace compact, une grande quand le champ voisine de grands éléments.
    instances:
      - { id: petit, label: Petit, size: small }
      - { id: moyen, label: Moyen (par défaut) }
      - { id: grand, label: Grand, size: large }
  - titre: Avec une aide
    texte: L'aide dit ce que le champ attend, avant que quelqu'un se trompe. Elle reste affichée.
    instances:
      - { id: aide, label: Adresse e-mail, type: email, hint: "Celle de votre compte, pas une adresse de travail." }
  - titre: Avec un message de validation
    texte: Le message s'ajoute à l'aide, il ne la remplace pas. L'erreur et le succès se voient par une icône et un texte, pas par la couleur seule.
    instances:
      - { id: erreur, label: Adresse e-mail, type: email, value: "bonjour@exemple", status: error, message: "Il manque l'extension : .fr, .com…", hint: "Celle de votre compte." }
      - { id: succes, label: Adresse e-mail, type: email, value: "bonjour@exemple.fr", status: success, message: "Cette adresse est disponible.", hint: "Celle de votre compte." }
  - titre: Désactivé
    texte: Le champ n'accepte plus de saisie et n'est pas envoyé avec le formulaire.
    instances:
      - { id: desactive, label: Libellé, value: Valeur, status: disabled }
  - titre: Avec un compteur
    texte: Le compteur donne le nombre de caractères tapés. Il demande une limite, `maxlength`.
    instances:
      - { id: compteur, label: Sujet, counter: true, maxlength: 40, value: Bonjour }
accessibilite:
  - "Le libellé est relié à la boîte par `id` : un lecteur d'écran l'annonce en entrant dans le champ."
  - "L'aide et le message de validation sont lus eux aussi."
  - "L'erreur et le succès se voient par une icône et un texte, pas par la couleur seule."
  - "Au clavier, le trait de la boîte change de couleur quand le champ a le focus."
voirAussi:
  - { nom: Textarea, texte: Le même champ sur plusieurs lignes. }
  - { nom: Select, texte: Un choix dans une liste fermée. }
---

Utiliser un champ texte pour recueillir une réponse courte et libre : un nom, une adresse, un sujet.
C'est ce qui tient sur une ligne et que le système ne peut pas proposer d'avance.

Le champ a toujours un libellé visible. Un exemple dans la boîte n'en tient pas lieu : il disparaît
à la première frappe.

## Quand ne pas l'utiliser

- Pour un texte sur plusieurs lignes : utiliser la zone de texte (`Textarea`).
- Pour un choix dans une liste fermée : utiliser la liste déroulante (`Select`).
- Pour une recherche avec des suggestions : la liste qui s'ouvrirait dessous n'existe pas dans le système.
