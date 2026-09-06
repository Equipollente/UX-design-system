# Ajouter une page de composant

Cette procédure décrit le passage d'un composant déjà confirmé à sa page de documentation sous
`/components/<slug>`. Elle complète [ajouter-un-composant.md](ajouter-un-composant.md), qui décrit
la création du composant lui-même.

La page de documentation est un consommateur du design system : elle ne déplace aucune donnée de
site ni règle métier dans `src/design-system/`.

---

## 0. Conditions d'entrée

Avant de créer la page, vérifier :

- le composant existe dans `src/design-system/components/` ;
- son interface `Props`, ses slots et son comportement sont documentés dans son fichier `.astro` ;
- une vue a besoin de cette page maintenant ;
- le nom, le slug et la navigation attendus sont connus ;
- le nœud Figma est relevé si le composant en provient.

Si le composant n'existe pas encore, suivre [ajouter-un-composant.md](ajouter-un-composant.md)
d'abord.

## 1. Choisir le type de page

Utiliser une page dédiée dans `src/pages/components/<slug>.astro` lorsque la page a une
visualisation, un exemple ou une explication propres à ce composant.

Utiliser `src/pages/components/[slug].astro` seulement lorsque le contenu peut réellement être
piloté par les données partagées de `src/pages/_component-pages.ts`. Ne pas cacher dans cette page
un grand `if` qui finit par devenir une seconde collection de pages dédiées.

Une page dédiée ne doit pas être générée une seconde fois par `[slug].astro`. Garder son entrée
dans `src/pages/_component-pages.ts` pour la navigation, mais exclure son `slug` de
`getStaticPaths()` de la route dynamique. Le build ne doit pas signaler de conflit entre la route
explicite et la route `[slug]`.

## 2. Composer le layout

Une page dédiée utilise :

- `ComponentDetailLayout` pour le shell de la page ;
- le slot `overview` pour la démonstration et le bloc Visualisation / Code ;
- le slot `playground` pour les essais interactifs ou les cas limites ;
- `componentPageGroups` et `withBase()` pour la navigation publiée.

Le layout connaît la structure commune, pas le composant documenté. Le contenu de la page reste dans
la page ou dans les données de démonstration appropriées.

### Contrat du Playground

`ComponentPlayground` porte la structure commune de toutes les pages : une frame responsive en deux
colonnes, le panneau de configuration à gauche, le rendu live à droite et les onglets
`Visualisation`, `Code` et `HTML`. L'onglet `HTML` produit un export portable du rendu, avec
l'import des tokens et les styles nécessaires, débarrassés des attributs internes d'Astro et du
playground.

La page fournit uniquement les deux contenus propres au composant :

```astro
<ComponentDetailLayout ...>
  <div slot="playground-controls">
    <!-- TextField, Select, Checkbox, etc. propres au composant. -->
  </div>

  <div slot="playground">
    <!-- Le vrai composant, pré-rendu pour le comportement live. -->
  </div>
</ComponentDetailLayout>
```

`ComponentDetailLayout` raccorde ces slots de page aux slots génériques `controls` et `preview` de
`ComponentPlayground`. Un nouveau composant ajoute donc ses réglages et sa synchronisation dans sa
page, sans modifier le bloc partagé.

Chaque instance reçoit un `id` unique, utilisé pour les relations ARIA des onglets et panneaux :

```astro
<ComponentPlayground id="card-playground" code={code}>
  ...
</ComponentPlayground>
```

Le layout fournit cet identifiant lorsqu'il compose une page dédiée. Une page qui compose le bloc
directement doit également en fournir un si plusieurs Playgrounds peuvent coexister.

Dans `playground-controls`, chaque groupe de réglages est un `fieldset`. Les groupes existants
portent leur propre titre (`Buttons`, `Tags`, `Text` ou `Image`) et `ComponentPlayground` applique
le format commun : fond blanc, bordure, rayon, padding et titre typé. La page ne redéclare pas ces
styles.

### Groupes de contrôles réutilisables

Les groupes vivent dans `src/design-system/layouts/blocks/` et ne rendent pas le composant
documenté. Ils rendent uniquement ses contrôles ; la page conserve la lecture des valeurs, la mise
à jour du rendu et la génération du code.

| Groupe | Props | Contenu attendu | Usage |
|---|---|---|---|
| `PlaygroundButtons` | `id`, `actions?` | Aucun slot ; les lignes sont générées par le groupe | Actions configurables, avec libellé, variante et icône ; ajout et suppression de lignes |
| `PlaygroundTags` | `id`, `tags?` | Aucun slot ; les lignes sont générées par le groupe | Une collection de tags ; utiliser une instance par slot ou zone (`tags-top`, `tags-bottom`) |
| `PlaygroundText` | `id`, `label?` | Les `TextField` et `Select` propres au texte | Texte optionnel dont les champs sont fournis par la page |
| `PlaygroundImage` | `id`, `label?` | Les champs propres à l'image, au minimum le texte alternatif | Image optionnelle dont les champs sont fournis par la page |

Le `id` est le contrat de raccordement du groupe : il doit être unique dans le playground et être
réutilisé pour les trois éléments suivants :

```astro
<PlaygroundText id="text">
  <TextField id="card-title" name="text-title" label="Titre" value="Titre" />
</PlaygroundText>

<CardText data-playground-preview="text" ... />
```

Le groupe produit `data-playground-toggle="text"` et `data-playground-options="text"` ; le
`ComponentPlayground` masque ou affiche ces options et la cible portant
`data-playground-preview="text"`. La page doit donc employer exactement le même nom dans le groupe,
dans le sélecteur de preview et dans sa logique de synchronisation.

Pour `PlaygroundButtons` et `PlaygroundTags`, les valeurs sont lues dans les lignes générées avec
les noms réservés `action-label`, `action-variant`, `action-icon`, `tag-label` et `tag-variant`.
Ne pas renommer ces champs sans adapter la logique de la page. Le groupe garantit au moins une
ligne ; la page décide ensuite comment une liste vide ou masquée se traduit dans le composant et
dans le code généré.

Exemple de composition pour une carte :

```astro
<PlaygroundButtons
  id="actions"
  actions={[{ label: 'Modifier', variant: 'secondary' }]}
/>
<PlaygroundTags
  id="tags-top"
  tags={[{ label: 'En cours', variant: 'accent' }]}
/>
<PlaygroundTags
  id="tags-bottom"
  tags={[{ label: 'Gouache', variant: 'outline' }]}
/>
<PlaygroundText id="text">
  <TextField id="card-title" name="text-title" label="Titre" value="Titre" />
</PlaygroundText>
<PlaygroundImage id="image">
  <TextField id="card-alt" name="image-alt" label="Texte alternatif" value="Description" />
</PlaygroundImage>
```

Les cibles correspondantes dans le rendu sont `data-playground-preview="actions"`,
`"tags-top"`, `"tags-bottom"`, `"text"` et `"image"`. Une page peut choisir un autre nom, mais
le même nom doit rester identique de part et d'autre du raccordement.

Pour un composant lié optionnel, utiliser les attributs de comportement partagés :

```astro
<Toggle data-playground-toggle="actions" ... />

<div data-playground-options="actions">
  <!-- réglages propres au composant lié -->
</div>

<CardActions data-playground-preview="actions" ... />
```

`ComponentPlayground` masque ou affiche les options et la cible de preview à partir du toggle.
Le nom (`actions`, `tags`, `image`, `text`, etc.) appartient à la page du composant et ne doit pas
être codé dans le bloc partagé. La page conserve la logique spécifique de création, de composition
et de génération du code.

Structure minimale :

```astro
---
import ComponentDetailLayout from '../../design-system/layouts/ComponentDetailLayout.astro';
import ComponentOverview from '../../design-system/layouts/blocks/ComponentOverview.astro';
import ComponentPlayground from '../../design-system/layouts/blocks/ComponentPlayground.astro';
import { withBase } from '../../design-system/lib/url';
import { componentPageGroups } from '../_component-pages';

const title = 'Nom du composant';
const description = 'Ce que le composant fait et ne fait pas.';
const current = withBase('/components/nom-du-composant');
---

<ComponentDetailLayout
  title={title}
  description={description}
  sidebarGroups={componentPageGroups}
  current={current}
>
  <div slot="overview">
    <ComponentOverview code={code}>
      <!-- Le vrai composant, avec les données de démonstration. -->
    </ComponentOverview>
  </div>

  <div slot="playground-controls">
    <!-- Les contrôles propres à ce composant. -->
  </div>

  <div slot="playground">
    <!-- Le même composant, pré-rendu pour le playground. -->
  </div>
</ComponentDetailLayout>
```

`ComponentDetailLayout` instancie déjà `ComponentOverview` et `ComponentPlayground`. La page dédiée
ne les importe donc pas et ne les instancie pas : elle remplit uniquement les slots
`overview`, `playground-controls` et `playground`. Si un autre layout délègue ces blocs, suivre le
contrat de ce layout plutôt que de les dupliquer dans la page.

## 3. Définir une source de vérité pour l'exemple

Les valeurs de l'exemple ne doivent pas être recopiées séparément dans la visualisation et dans le
code affiché. Préparer un objet de données dans le frontmatter de la page, ou dans `src/pages/_demo.ts`
si plusieurs pages le partagent.

Utiliser cet objet pour :

- les props du vrai composant rendu dans l'onglet Visualisation ;
- les valeurs du code présenté dans l'onglet Code ;
- les cas du Playground lorsque c'est le même exemple.

Le code affiché peut être construit par un template à partir de ces données. Il doit rester du code
Astro copiable, avec ses imports, ses slots et ses expressions réelles : ne pas afficher le HTML
produit par le navigateur à la place.

L'onglet `HTML` est différent : il est produit à partir du rendu live. Ne pas le recopier dans le
code Astro ni l'utiliser comme source de vérité pour l'onglet `Code`.

La structure du template peut rester spécifique à chaque famille de composants. Le layout ne doit
pas tenter de reconstruire universellement les imports et les slots à partir du HTML rendu : ces
informations ne sont plus disponibles après compilation.

## 4. Rendre la visualisation

Utiliser le vrai composant documenté, jamais une copie de son markup. Montrer l'exemple représentatif
qui sera traduit dans l'onglet Code : mêmes valeurs, mêmes props, mêmes slots, même ordre et mêmes
variantes.

Vérifier en particulier :

- les props obligatoires et leurs valeurs par défaut ;
- les slots facultatifs et leur absence ;
- les URLs et assets avec `withBase()` lorsqu'ils sont publiés ;
- les états ou variantes réellement montrés par la maquette ;
- les textes de longueur réaliste.

## 5. Construire l'onglet Code

Le code doit être la traduction de la visualisation, pas un exemple générique parallèle.

Il doit contenir :

- le frontmatter d'import complet ;
- les mêmes composants enfants que la visualisation ;
- les mêmes props et valeurs ;
- les mêmes slots nommés ;
- les mêmes variantes et attributs complémentaires ;
- le même chemin d'asset, avec `withBase()` si nécessaire.

Quand une valeur change, elle doit être modifiée dans la source de vérité de l'exemple, puis
réutilisée dans les deux rendus. Après une modification, comparer visuellement les deux onglets.

## 6. Ajouter la page à la navigation

Mettre à jour les données de navigation dans [../src/pages/_component-pages.ts] si le composant
possède une nouvelle page ou si son slug change. Vérifier le lien courant avec `withBase()`.

Si une page dédiée existe, conserver son entrée pour la sidebar mais empêcher `[slug].astro` de la
produire dans `getStaticPaths()`. Vérifier le résultat avec le build : une route dédiée et sa route
dynamique ne doivent pas être produites simultanément.

Ne pas ajouter une connaissance de cette page dans un composant du design system. La navigation et
les textes de page appartiennent à `src/pages/`.

## 7. Documenter le composant

Si le composant est exposé séparément dans la page générale des composants :

- importer le composant dans `src/pages/components.astro` ;
- ajouter ou mettre à jour son tableau de props depuis `interface Props` ;
- montrer le vrai composant et les cas limites utiles ;
- documenter les slots lorsqu'il en possède ;
- signaler les écarts Figma avec un `p.flag` et un arbitrage si nécessaire.

La page dédiée et la page générale peuvent partager les données de démonstration, mais ne doivent
pas créer deux contrats contradictoires.

## 8. Vérifier

Exécuter :

```bash
npm run check
npm run build
```

Le build doit se terminer sans avertissement de conflit de routes. Vérifier que la page dédiée
apparaît une seule fois dans les routes générées.

Puis vérifier dans le navigateur :

- l'onglet Visualisation ;
- l'onglet Code et la correspondance exacte avec la visualisation ;
- la copie et le retour à la ligne du code long ;
- le clavier et le focus visible ;
- une largeur mobile sous 768px ;
- les assets et liens avec le préfixe de publication.

## Liste de contrôle

- [ ] Le composant existe et son contrat est relu
- [ ] Le type de page est choisi : dédiée ou route dynamique
- [ ] Une page dédiée n'est pas générée aussi par `[slug].astro`
- [ ] `ComponentDetailLayout` et les blocs existants sont réutilisés
- [ ] Les slots `overview`, `playground-controls` et `playground` sont remplis au bon niveau
- [ ] Chaque groupe utilisé reçoit un `id` unique et ses cibles de preview reprennent ce nom
- [ ] Les props et champs réservés des groupes sont conservés ou leur logique est adaptée
- [ ] Les groupes de tags sont séparés quand les slots du composant le sont
- [ ] Une seule source de vérité porte les données de l'exemple
- [ ] La visualisation utilise le vrai composant
- [ ] Le code traduit exactement cette visualisation
- [ ] Les imports, slots, variantes et assets sont cohérents
- [ ] La navigation et le slug sont à jour
- [ ] La page générale est mise à jour si nécessaire
- [ ] `npm run check` passe
- [ ] `npm run build` passe sans avertissement de conflit de routes
- [ ] Le rendu est vérifié au clavier, sur mobile et avec du code long
