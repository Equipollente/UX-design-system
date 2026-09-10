## Titre

Fix playground controls styling and slot scoping

## Résumé

Cette PR corrige le style des contrôles du playground en évitant les surcharges globales qui touchent tous les boutons du système.

### Ce qui change

- le conteneur `[data-playground-options]` est maintenant stylé de façon ciblée dans le `ComponentPlayground`
- le style s’applique au bon niveau pour les éléments rendus dans le slot Astro
- la surcharge de `.btn` n’est plus appliquée globalement au playground
- les actions du bloc de boutons restent basées sur le composant `Button` avec `variant="secondary"` et `size="sm"`
- les espacements internes du panneau de contrôles sont stabilisés pour garder une mise en page cohérente

### Pourquoi

Le bug venait d’un sélecteur trop large qui affectait plus de boutons que prévu et écrasait les styles du composant système. En limitant le style au conteneur du playground et en laissant le composant bouton décider de son rendu, on évite les conflits visuels entre les blocs et le système.

## Vérification

- validation du diff Git : 1 fichier modifié, `ComponentPlayground.astro`
- aucun changement de logique métier, uniquement style/layout du playground

## Fichiers touchés

- `src/design-system/layouts/blocks/ComponentPlayground.astro`
