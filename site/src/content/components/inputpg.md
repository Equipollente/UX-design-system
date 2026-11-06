---
title: Champ texte
description: Une ligne où quelqu'un tape du texte.
---

## À quoi il sert

Le champ texte recueille une réponse courte : un nom, une adresse, un sujet. C'est ce qui tient
sur une ligne et que le système ne peut pas proposer d'avance.

Il se compose d'un libellé, d'une boîte de saisie, et, dessous, d'un texte d'aide et d'un
message de validation. L'aide dit ce que le champ attend, avant que personne ne se trompe. Le
message dit si ce qui a été tapé est bon ou non. Les deux peuvent s'afficher en même temps.

## Quand l'utiliser

- Pour une réponse courte et libre.
- Avec un libellé toujours visible : un exemple dans la boîte n'en tient pas lieu, il disparaît
  à la première frappe.

## Quand ne pas l'utiliser

- Pour un texte sur plusieurs lignes : utiliser la zone de texte (`Textarea`).
- Pour un choix dans une liste fermée : utiliser la liste déroulante (`Select`).
- Pour un champ de recherche avec des suggestions : la liste qui s'ouvrirait dessous n'existe pas
  dans le système.

## Les états

Le champ a quatre états : au repos, en erreur, en succès, désactivé. Il n'a pas d'état au
survol. Il a trois tailles : petit, moyen, grand.

## Accessibilité

- Le libellé est relié à la boîte : un lecteur d'écran l'annonce en entrant dans le champ.
- L'aide et le message de validation sont lus eux aussi.
- L'erreur et le succès se voient par une icône et un texte, pas par la couleur seule.
- Au clavier, le trait de la boîte change de couleur quand le champ a le focus.
