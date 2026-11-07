---
title: Case à cocher
description: La case à cocher dit oui ou non, seule ou dans une liste où plusieurs choix peuvent être retenus.
figma: https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=954-3642
exemples:
  - titre: Par défaut
    instances:
      - { id: defaut, label: J'accepte les conditions }
  - titre: Cochée
    instances:
      - { id: cochee, label: Recevoir la lettre d'information, checked: true }
  - titre: Indéterminée
    texte: Elle dit que certaines cases d'un groupe le sont, pas toutes. Le premier clic la remplace par cochée ou décochée.
    instances:
      - { id: indeterminee, label: Tout sélectionner, indeterminate: true }
  - titre: Avec une aide
    instances:
      - { id: aide, label: Rendre l'œuvre publique, hint: Elle apparaîtra dans le portfolio. }
  - titre: Obligatoire
    texte: Une case seule peut être obligatoire, comme « J'accepte les conditions ».
    instances:
      - { id: obligatoire, label: J'accepte les conditions, required: true }
  - titre: Désactivée
    instances:
      - { id: desactivee, label: Option indisponible, disabled: true }
      - { id: desactivee-cochee, label: Option imposée, checked: true, disabled: true }
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

Pour plusieurs cases sous une même question, les rassembler dans un `CheckboxGroup`, qui les nomme par une légende.

## Quand ne pas l'utiliser

- Pour un effet immédiat : utiliser un interrupteur (`Toggle`).
- Pour un seul choix parmi plusieurs : utiliser des radios (`Radio`).
