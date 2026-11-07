---
title: Champ texte
description: Le champ texte recueille une valeur qui tient sur une seule ligne.
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=936-9502
exemples:
  - titre: Par défaut
    instances:
      - { id: defaut, label: Libellé }
  - titre: Avec un exemple
    texte: L'exemple dit à quoi ressemble une réponse. Il disparaît à la première frappe et ne remplace jamais le libellé.
    instances:
      - { id: exemple, label: Sujet, placeholder: Ce dont vous voulez parler }
  - titre: Obligatoire
    texte: L'astérisque s'ajoute au libellé, et le champ devient obligatoire pour le navigateur.
    instances:
      - { id: obligatoire, label: Libellé, required: true }
  - titre: Tailles
    texte: Adapter la hauteur au contexte. Une petite taille dans un espace compact, une grande quand le champ voisine de grands éléments.
    instances:
      - { id: petit, label: Petit, size: small, value: Valeur }
      - { id: moyen, label: Moyen (par défaut), value: Valeur }
      - { id: grand, label: Grand, size: large, value: Valeur }
  - titre: Avec une aide
    texte: L'aide dit ce que le champ attend, avant que quelqu'un se trompe. Elle reste affichée, même avec un message de validation.
    instances:
      - { id: aide, label: Adresse e-mail, type: email, hint: "Celle de votre compte, pas une adresse de travail." }
  - titre: Erreur
    texte: Le message dit ce qui ne va pas, avec une icône. Le champ passe au rouge et se déclare invalide aux lecteurs d'écran.
    instances:
      - { id: erreur, label: Adresse e-mail, type: email, value: "bonjour@exemple", error: "Il manque l'extension : .fr, .com…", hint: "Celle de votre compte." }
  - titre: Succès
    instances:
      - { id: succes, label: Adresse e-mail, type: email, value: "bonjour@exemple.fr", success: "Cette adresse est disponible." }
  - titre: Désactivé
    texte: Le champ n'accepte plus de saisie et n'est pas envoyé avec le formulaire.
    instances:
      - { id: desactive, label: Libellé, value: Valeur, disabled: true }
  - titre: Recherche
    texte: Le type `search` ajoute une loupe devant le texte et donne au champ le rôle d'un champ de recherche.
    instances:
      - { id: recherche, label: Rechercher une œuvre, type: search, placeholder: Rechercher }
  - titre: Libellé masqué
    texte: À réserver aux champs dont le contexte dit déjà tout, comme une recherche dans un en-tête. Le libellé reste dans le document et nomme le champ pour un lecteur d'écran.
    instances:
      - { id: masque, label: Rechercher dans le site, hideLabel: true, type: search, placeholder: Rechercher }
accessibilite:
  - "Le libellé est relié à la boîte par `id` : un lecteur d'écran l'annonce en entrant dans le champ. `hideLabel` le retire de l'écran, jamais du document."
  - "L'aide et le message de validation sont lus eux aussi : le champ les désigne par `aria-describedby`, le message d'abord."
  - "L'erreur pose `aria-invalid`. Elle et le succès se disent par une icône et un texte, pas par la couleur seule."
  - "L'astérisque est masqué aux lecteurs d'écran : c'est l'attribut `required` du champ qui dit l'obligation. Le formulaire doit ouvrir sur la phrase « Les champs marqués * sont obligatoires »."
  - "Au clavier, un anneau de 2 px entoure la boîte quand elle a le focus."
  - "Le trait de la boîte au repos ne tient pas les 3:1 de contraste que WCAG 1.4.11 demande pour un contrôle d'interface : c'est un écart connu du dessin, que le texte, l'icône et le message compensent."
voirAussi:
  - { nom: Textarea, texte: Le même champ sur plusieurs lignes. }
  - { nom: Select, texte: Un choix dans une liste fermée. }
---

Utiliser un champ texte pour recueillir une réponse courte et libre : un nom, une adresse, un sujet.
C'est ce qui tient sur une ligne et que le système ne peut pas proposer d'avance.

Le champ a toujours un libellé. Un exemple dans la boîte n'en tient pas lieu : il disparaît
à la première frappe.

Tout attribut d'un `<input>` est accepté et posé sur la balise (`maxlength`, `autocomplete`, `inputmode`,
`pattern`, `name`…). Le type est limité aux champs d'une seule ligne : `text`, `email`, `tel`, `url` et `search`.

## Quand ne pas l'utiliser

- Pour un texte sur plusieurs lignes : utiliser la zone de texte (`Textarea`).
- Pour un choix dans une liste fermée : utiliser la liste déroulante (`Select`).
- Pour un oui ou non : utiliser une case (`Checkbox`) ou un interrupteur (`Toggle`).
