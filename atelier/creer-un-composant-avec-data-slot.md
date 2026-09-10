# Créer un composant avec DataSlot

De « ce comportement demande du JavaScript » à un composant Astro réutilisable, sans faire de
DataSlot une seconde surface publique du design system. Cette procédure décrit le geste ; les
slots, options et événements exacts vivent dans la documentation du paquet choisi.

Lire [conventions.md](conventions.md), puis [ajouter-un-composant.md](ajouter-un-composant.md).
Ce chemin ne remplace ni Figma ni le brief : DataSlot apporte un comportement accessible, pas une
maquette, des tokens ou une API de composant.

---

## 0. Vérifier que DataSlot est le bon coût

Partir du brief. Identifier le comportement qui manque et la vue qui le demande aujourd'hui.

1. Vérifier d'abord si HTML natif et CSS couvrent le besoin : un `<details>` pour une divulgation,
   un `<dialog>` pour une modale simple, ou un contrôle de formulaire natif. Si oui, ne pas ajouter
   DataSlot.
2. Si le besoin exige un comportement composé que le natif ne porte pas raisonnablement -- navigation
   au clavier, piège de focus, sélection, positionnement, gestion d'un état ouvert -- relever le
   paquet DataSlot qui le détient sur [data-slot.com](https://data-slot.com/).
3. Lire le README de ce paquet : structure `data-slot`, options, contrôleur, événements, attributs
   d'état et garanties d'accessibilité. Ne pas déduire son contrat d'un autre paquet.
4. Vérifier qu'aucun composant du système ne produit déjà ce comportement à 80 %. Si oui, modifier
   cet objet selon [modifier-un-composant.md](modifier-un-composant.md) plutôt que créer un doublon.

L'absence de DataSlot dans `package.json` n'est pas une anomalie : l'ajouter répond à un besoin
mesuré, pas à l'envie de constituer une boîte à outils.

## 1. Installer la primitive, pas la collection

Ajouter seulement le paquet choisi à `package.json` avec le gestionnaire du dépôt :

```sh
npm install @data-slot/<primitive>
```

Ne pas installer de méta-paquet « par avance ». Relire ensuite le diff du manifeste et du lockfile :
le nouveau paquet doit être la seule dépendance de runtime introduite par ce geste.

## 2. Décider la surface du composant avant le markup

Le composant du système reste l'objet public ; les attributs `data-slot` ne sont qu'un détail de son
implémentation.

- Écrire le pavé doctrinal et l'`interface Props` conformément à [conventions.md](conventions.md).
- Exposer des props exprimant le besoin du système, non les options brutes du paquet. Une option
  DataSlot ne devient une prop que lorsqu'une vue réelle doit la modifier.
- Garder les identifiants, déclencheurs et contenus propres à une page chez l'appelant ; le composant
  ne connaît ni route, ni texte de démonstration, ni site consommateur.
- Préférer une balise native quand la primitive la prévoit et préserver sa sémantique. Ne pas
  remplacer un bouton, un champ ou un dialogue natif par des `<div>` pour accommoder la bibliothèque.

## 3. Monter DataSlot dans Astro

Rendre la structure demandée par le README dans le template, avec les attributs `data-slot` sur les
éléments attendus. Les styles du système restent des classes du composant : ne pas cibler
`data-slot` globalement, car ces attributs sont partagés par le contrat de la bibliothèque.

Importer et initialiser le paquet dans un `<script>` Astro. Ce script est envoyé au navigateur et
Astro le déduplique : son initialisation doit donc découvrir toutes les instances de la page, ou
recevoir explicitement une racine pour chacune d'elles. Suivre la méthode documentée par le paquet
(`create()` ou son constructeur ciblé) ; ne pas recopier un sélecteur ou un contrôleur d'une autre
primitive.

Quand un contrôleur est nécessaire à une commande propre au composant, le conserver près de sa
racine et appeler sa méthode documentée. Ne pas contourner l'état interne en ajoutant ou retirant
à la main les attributs `data-open`, `data-state`, `hidden` ou ARIA : DataSlot doit rester l'unique
propriétaire de cet état.

Le nettoyage (`destroy()`) ne se justifie que lorsqu'un cycle de montage démontre qu'une instance
peut être remplacée. Sans ce cycle, ne pas ajouter de code de durée de vie préventif.

## 4. Styliser les états sans les inventer

Le paquet expose des attributs d'état et ARIA que le CSS peut lire. Vérifier leurs noms dans son
README, puis les employer sous la classe locale du composant.

- Toutes les valeurs visuelles viennent des tokens, selon [conventions.md](conventions.md).
- Les transitions suivent les tokens de mouvement ; les états de départ et de fin viennent du
  contrat DataSlot, ils ne sont pas simulés en JavaScript.
- Le `z-index`, les dimensions et l'overlay sont des choix du système : ils se dessinent dans les
  styles scopés et passent par Figma et les tokens lorsqu'une valeur manque.
- Pour une primitive qui s'appuie sur `<dialog>`, garder la règle CSS qui ne donne un `display` au
  dialogue que sous `[open]`. Sinon la règle auteur rendrait une boîte fermée visible dans le flux.

## 5. Documenter ce qui est vraiment livré

Suivre les étapes de documentation d'[ajouter-un-composant.md](ajouter-un-composant.md) : registre
Figma, démo avec le vrai composant, props recopiées de l'interface, états et écarts éventuels.

Dans le pavé du composant et dans sa section de doc, nommer le comportement rendu par DataSlot et
l'exception à la règle « pas de script par défaut » : l'échec concret évité et la garantie
d'accessibilité concernée. Ne pas recopier la documentation de la dépendance ; relier vers elle si
le lecteur doit consulter son API.

## 6. Vérifier avant de fermer

- [ ] Le besoin est réel, Figma est la source du dessin, et le natif ne répond pas au comportement.
- [ ] Un seul paquet DataSlot, celui de la primitive, est déclaré dans `package.json`.
- [ ] Les props publiques du composant ne révèlent que les choix utiles aux vues du système.
- [ ] Le script initialise toutes les instances et aucun code ne force les attributs d'état.
- [ ] Le parcours complet au clavier tient : déclencheur, flèches ou Tab selon la primitive, Échap
      quand il est prévu, et retour du focus.
- [ ] Les états ouverts, fermés, désactivés et les erreurs éventuelles se lisent à l'écran, sous
      768px et sur fenêtre courte.
- [ ] `npm run check` passe.
- [ ] `npm run build` passe ; lancer `npm run preview` si l'objet introduit une URL ou un asset.

## 7. Commiter

Le commit explique quel comportement mesuré impose DataSlot, pourquoi le natif ne suffisait pas et
quelle garantie a été vérifiée au clavier. Un écart Figma ou un token absent suit le chemin habituel
vers [arbitrages.md](arbitrages.md), sans être comblé dans le composant.
