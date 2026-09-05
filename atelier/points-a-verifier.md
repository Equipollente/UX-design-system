# Points à vérifier

Checklist des questions ouvertes ou des vérifications à refaire avant de considérer un composant
terminé. Ce document ne détient ni valeur de design ni contrat public : les valeurs vivent dans
Figma et les contrats dans les composants concernés.

## Button — focus

- [ ] Dessiner dans Figma l'état `Focused` de `Button`.
- [ ] Vérifier que l'état utilise les tokens de focus du système et reste visible au clavier.
- [ ] Intégrer l'état `:focus-visible` dans `Button.astro`.
- [x] Vérifier que `CardDefault` avec actions réutilise ce focus sans ajouter de règle au niveau
  de la carte.

## Documentation et intégration

- [x] La démonstration montre une carte cliquable et une carte avec actions côte à côte.
- [x] La démonstration vérifie une carte sans image, une carte sans tags et un contenu long.
- [ ] La documentation publique recopie l'interface depuis le composant, sans seconde définition
  des props.
- [ ] Le nœud Figma et les éventuels écarts sont reportés dans `LINKS.md` et `arbitrages.md`.
- [x] Les artefacts temporaires sont supprimés quand la démonstration publique les remplace.

## Validation finale

- [x] `npm run check`
- [x] `npm run build`
- [x] Navigation au clavier et focus visible
- [x] Test sous `768px`
- [x] Vérification des chemins avec le préfixe `/UX-design-system/`
- [x] `git diff --check`
