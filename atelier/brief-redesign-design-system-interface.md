# Brief : une page par composant

## Objet

Une nouvelle architecture de documentation du design system : une page dédiée par composant, avec
`CardDefault` (`451:1004`) comme premier cas.

## Pour qui

Les personnes qui consultent, testent et réutilisent le design system. Chaque page doit permettre
de comprendre et d'essayer un composant sans parcourir une page qui les rassemble tous.

## Figma

La base d'interface est le nœud [`481:6970`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=481-6970).
Il présente une navigation latérale, un titre et une description, une bascule « visualiser / code »
et une zone de démonstration. Le composant de référence est
[`451:1004`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=451-1004).
Le contenu final reste à définir.

## Aujourd'hui

La page **Components** rassemble actuellement tous les composants, leurs démonstrations, leurs
propriétés et leurs détails techniques dans une même longue vue. La maquette de la nouvelle page
est identifiée, mais son contenu et la répartition exacte des informations ne sont pas encore fixés.

## Attendu

Une page totalement redesignée et reproductible pour chaque composant. Elle doit reprendre la base
Figma, donner accès à la navigation du système, permettre de basculer entre visualisation et code,
et accueillir progressivement le contenu propre à chaque composant. `CardDefault` sert à valider
le modèle avant de le généraliser.

## Ne pas toucher

Les sites consommateurs, les données métier propres aux exemples, la source de vérité Figma et les
tokens existants. Le contenu détaillé de chaque composant reste ouvert. L'ancienne page
**Components** reste intacte tant que la nouvelle architecture n'est pas validée.

## Fini quand

- [ ] La page suit la base Figma : navigation latérale, en-tête du composant, bascule « visualiser / code » et zone de démonstration.
- [ ] `CardDefault` est accessible sur une page dédiée et sert de premier cas de validation.
- [ ] Le modèle de page peut accueillir chaque autre composant sans refaire sa structure.
- [ ] Le contenu d'une page peut évoluer indépendamment du contenu des autres pages.
- [ ] La navigation entre composants et la page courante sont compréhensibles au clavier, sur mobile et sur desktop.
- [ ] L'ancienne page **Components** n'est pas modifiée pendant cette première étape.
