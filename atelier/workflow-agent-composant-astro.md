# Workflow de l'agent : créer un composant Astro

Ce document s'adresse à l'agent IA chargé de développer un nouveau composant Astro dans ce dépôt. Il décrit l'ordre des vérifications et des actions. Il ne remplace pas [coder-un-composant.md](coder-un-composant.md), qui explique le raisonnement en langage accessible, ni [ajouter-un-composant.md](ajouter-un-composant.md), qui précise le cas d'un composant issu de Figma.

## Mission

Transformer un besoin confirmé en composant réutilisable, vérifié et documenté, sans inventer son rôle, ses variantes, ses valeurs ou son contenu.

Le composant doit rester indépendant du site qui le consomme. Les textes, liens, images, pages et états propres à une vue doivent venir de ses props ou de ses slots.

## Entrées à vérifier

Avant toute modification, identifier :

- le besoin ou le brief qui demande le composant ;
- la vue qui en a besoin maintenant ;
- la phrase qui décrit ce que le composant fait ;
- les variantes réellement prévues ;
- le nœud Figma et sa description, si le composant est issu de Figma ;
- le composant existant qui s'en approche le plus ;
- les critères qui permettront de dire que le travail est terminé.

Si une de ces informations manque et qu'elle empêche de décider le rôle du composant, poser la question ou s'arrêter. Ne jamais déduire le comportement du nom de fichier.

## Règles Astro impératives

Ces règles viennent du fonctionnement d'Astro. Elles s'appliquent à tout nouveau composant, indépendamment du design du composant.

- Utiliser un fichier `.astro` pour un composant Astro.
- Garder les imports, les types et la préparation des données dans le frontmatter, entre les deux lignes `---`.
- Garder le HTML rendu, les expressions et les composants enfants sous le frontmatter.
- Utiliser `Astro.props` pour lire les données reçues par le composant.
- Déclarer `interface Props` lorsque le composant reçoit des props ; ne pas l'exporter par obligation, Astro la détecte dans le frontmatter.
- Utiliser les expressions Astro entre accolades, par exemple `{title}` ou `{items.map((item) => <li>{item}</li>)}`.
- Utiliser les composants avec une balise en PascalCase (`<Card />`), jamais comme une fonction (`Card()` ou `items.map(Card)`).
- Utiliser `<slot />` pour le contenu enfant et un slot nommé uniquement pour une zone réellement distincte.
- Ne pas supposer qu'un composant Astro est interactif : il produit du HTML sans JavaScript client par défaut.
- Ajouter un `<script>` seulement pour un comportement navigateur nécessaire. Sauf `is:inline`, Astro le traite, le regroupe et déduplique le script lorsqu'un composant est utilisé plusieurs fois.
- Ne pas utiliser `is:inline` sans raison : le script ou le style ne serait plus traité, regroupé ou dédupliqué par Astro.
- Utiliser `client:*` pour hydrater un composant React, Vue ou Svelte uniquement lorsqu'il doit devenir interactif ; une directive `client:*` ne rend pas un composant Astro statique interactif.
- Considérer les styles d'un bloc `<style>` comme scopés au composant. Utiliser `is:global` seulement pour une règle réellement globale.

Si une règle du projet semble contredire une règle Astro, vérifier la documentation Astro et expliciter l'arbitrage avant de coder.

## Ordre obligatoire

### 1. Contrôler le périmètre

Lire l'état du dépôt avec `git status`. Vérifier que les changements déjà présents sont compris et ne pas les annuler.

Lire ensuite, dans cet ordre :

1. [CLAUDE.md](../CLAUDE.md) ;
2. [atelier/README.md](README.md) ;
3. [conventions.md](conventions.md) ;
4. le brief, s'il existe ;
5. [ajouter-un-composant.md](ajouter-un-composant.md) si Figma est concerné.

Ne pas commencer par une lecture large du dépôt. Ces documents définissent le périmètre, les sources de vérité et les validations attendues.

### 2. Trouver le point d'intégration

Chercher dans `src/design-system/components/` un composant déjà proche. Chercher également ses usages, les styles partagés, les tokens et les icônes nécessaires.

Décider ensuite entre :

- réutiliser le composant existant ;
- le modifier, si la demande concerne bien son contrat actuel ;
- créer un nouveau composant ;
- ajouter un point de surcharge plutôt qu'une nouvelle variante.

Une variante qui n'est pas nécessaire à une vue actuelle n'est pas codée par anticipation.

### 3. Lire la source de conception

Si Figma est la source :

- ouvrir le nœud indiqué ;
- lire sa description ;
- relever les variantes et les états montrés ;
- distinguer ce que Figma montre de ce que le code doit décider ;
- signaler tout écart au lieu de le corriger silencieusement.

Si le nœud est inaccessible, ne pas coder de mémoire. Demander l'accès ou documenter le blocage.

### 4. Formuler l'hypothèse locale

Avant la première édition, écrire mentalement ou dans le compte rendu de travail une hypothèse falsifiable :

> « Le besoin est contrôlé par [composant ou fichier], parce que [indice local]. Une vérification rapide dans [test, usage, typecheck ou rendu] peut confirmer ou contredire cette hypothèse. »

L'hypothèse doit conduire à une petite première modification. Si elle ne peut pas être formulée, faire une seule lecture locale supplémentaire de l'abstraction ou de l'usage directement voisin, puis décider. Ne pas cartographier tout le dépôt.

### 5. Créer le composant

Créer `src/design-system/components/Nom.astro`, ou un dossier `Nom/` si plusieurs sous-composants forment un ensemble cohérent. Utiliser un nom PascalCase qui décrit l'objet, pas la page où il apparaît.

Le fichier Astro peut contenir :

- un frontmatter entre `---` pour les imports, les types et la préparation des données ;
- un template HTML sous le frontmatter ;
- un bloc `<style>` pour les styles propres au composant ;
- un bloc `<script>` uniquement si une interaction dans le navigateur est indispensable.

Le commentaire documentaire en tête du fichier doit être fondé sur des informations vérifiées. S'il manque le rôle ou le nœud Figma, laisser cette information à compléter plutôt que l'inventer.

Ne pas ajouter de frontmatter vide. Il est facultatif pour un composant qui ne contient ni import, ni type, ni donnée à préparer.

### 6. Définir l'interface avant le HTML

Écrire l'interface `Props` avant le template. Elle doit contenir uniquement les informations fournies par l'appelant :

```astro
---
interface Props {
  title: string;
  variant?: 'default' | 'featured';
  href?: string;
  class?: string;
}

const { title, variant = 'default', href, class: className, ...rest } = Astro.props;
---
```

Respecter ces règles :

- rendre obligatoires les informations nécessaires ;
- utiliser une union pour limiter les variantes autorisées ;
- donner les valeurs par défaut dans la destructuration ;
- accepter `class` et transmettre `...rest` lorsque le composant doit accepter les attributs complémentaires ;
- réutiliser les types existants, notamment pour les icônes ;
- utiliser un slot pour du contenu libre, et des slots nommés seulement pour des zones réellement distinctes.

Dans le template, ne pas confondre une prop et un slot : une prop est une donnée nommée que le composant interprète ; un slot est du HTML fourni par l'appelant et rendu à l'endroit prévu. Pour un attribut qui doit seulement être transmis à l'élément racine, le récupérer dans `...rest` et l'étaler avec `<element {...rest}>`.

### Règles détaillées pour les slots

Appliquer les règles suivantes lorsqu'un composant reçoit du contenu enfant :

1. Utiliser `<slot />` pour le contenu enfant principal. Tout ce que l'appelant place entre les balises du composant est rendu à cet endroit.
2. Ne créer un slot nommé que pour une zone indépendante du contenu principal : `<slot name="actions" />`, par exemple. Ne pas créer un slot pour chaque petit morceau de texte.
3. Côté appelant, associer le contenu à un slot nommé avec l'attribut `slot` : `<Button slot="actions">Enregistrer</Button>`.
4. Ne pas mélanger un slot par défaut et un slot nommé sans vérifier le résultat attendu : le contenu sans attribut `slot` va dans le slot par défaut, le contenu avec `slot="nom"` va dans le slot nommé.
5. Tester l'absence d'un slot optionnel avec `Astro.slots.has('nom')` avant de rendre son conteneur. Sinon, le composant peut afficher une zone vide, un espace ou un séparateur inutile.
6. Ne pas essayer de lire le contenu d'un slot comme une prop. Un slot fournit du HTML enfant ; une prop fournit une donnée que le composant peut interpréter.
7. Garder les styles du contenu slotté au niveau du parent qui le fournit lorsque les styles scopés du composant ne peuvent pas l'atteindre. Ne pas ajouter `is:global` uniquement pour contourner ce point.

Exemple de composant avec une zone de contenu et une zone d'actions facultative :

```astro
---
const hasActions = Astro.slots.has('actions');
---

<section class="panel">
  <div class="content">
    <slot />
  </div>

  {hasActions && (
    <div class="actions">
      <slot name="actions" />
    </div>
  )}
</section>
```

Appel correspondant :

```astro
<Panel>
  <p>Contenu principal.</p>
  <div slot="actions">
    <Button>Annuler</Button>
  </div>
</Panel>
```

Le composant ne doit pas imposer une structure de slot dont le besoin n'est pas démontré par son usage ou sa maquette.

Ne pas ajouter une prop uniquement pour corriger un cas rencontré pendant la construction. Vérifier d'abord si ce cas appartient réellement au contrat.

### 7. Construire le rendu

Utiliser les éléments HTML qui correspondent au rôle du contenu. Utiliser les props dans le template et les composants enfants avec leur syntaxe Astro (`<Child />`). Rendre les parties facultatives seulement lorsque leur donnée ou leur slot existe.

Respecter la syntaxe de template Astro :

- utiliser `class={classes}` pour une chaîne calculée et `class:list={[...]}` pour combiner des classes ou des conditions ;
- utiliser les attributs HTML avec leur valeur (`aria-label={label}`, `data-state={state}`) ;
- utiliser les commentaires HTML `<!-- ... -->` dans le template et les commentaires JavaScript `//` ou `/* ... */` dans le frontmatter ;
- ne pas écrire de JSX dans un fichier `.astro` en dehors des expressions prévues par Astro ;
- ne pas appeler manuellement un composant Astro comme une fonction.

Les données propres à une page ne doivent pas être écrites dans le composant. Les URLs absolues et les assets suivent les règles de [CLAUDE.md](../CLAUDE.md), notamment `withBase()` lorsque c'est nécessaire.

### 8. Ajouter uniquement le comportement nécessaire

Commencer par vérifier si HTML et CSS suffisent : état natif, `:hover`, `<details>` ou transition.

Si un script est nécessaire :

- l'ajouter au composant ;
- le faire fonctionner pour toutes les instances présentes sur la page ;
- ne pas déplacer le rendu ou la mise en page dans le script ;
- justifier le besoin dans le code ou le compte rendu lorsque ce n'est pas évident.

Pour un composant d'interface React, Svelte ou Vue, choisir la directive `client:*` la moins coûteuse compatible avec le besoin. Ne pas hydrater un composant Astro statique.

Un script de composant doit sélectionner toutes les instances concernées, généralement avec un attribut `data-*` propre au composant et `querySelectorAll`. Les variables préparées dans le frontmatter ne sont pas disponibles directement dans le navigateur : si un script en a besoin, les transmettre explicitement dans des attributs `data-*`.

### 9. Utiliser les tokens et les styles existants

Les couleurs, espacements, dimensions, typographies et mouvements doivent utiliser les tokens du système. Ne pas copier une valeur depuis Figma dans le CSS.

Si aucun token ne convient :

1. ne pas inventer de valeur silencieusement ;
2. signaler l'écart dans la documentation ;
3. suivre la procédure de mise à jour des tokens si une modification Figma est nécessaire.

Les styles propres au composant restent dans un `<style>` scopé, sauf si une règle globale est réellement requise par le système.

Ne pas passer un style local par `is:inline` pour contourner le scope Astro. Si un contenu fourni par un slot doit être stylé, vérifier la limite du scope et placer la règle au niveau du parent approprié plutôt que de supposer que le style du composant atteindra le contenu slotté.

## Première validation obligatoire

Après la première modification substantielle, lancer immédiatement la vérification la moins coûteuse qui peut contredire l'hypothèse :

- `npm run check` pour une modification de structure, de props ou de TypeScript ;
- un test ciblé lorsqu'il existe ;
- le rendu de la page de démonstration pour une modification visuelle ;
- `git diff --check` seulement lorsqu'aucune vérification exécutable plus ciblée n'est disponible.

Ne pas poursuivre une nouvelle série de recherches ou de modifications avant cette validation. Si elle échoue à cause d'un défaut local, corriger le même périmètre et relancer la même vérification.

Pour un problème de syntaxe Astro, commencer par une lecture du message de diagnostic et de la ligne concernée. Ne pas remplacer la syntaxe Astro par une syntaxe de framework sans vérifier que le changement répond bien au besoin.

## Démonstration et intégration

Dans ce dépôt, ajouter ou compléter la démonstration dans `src/pages/components.astro` et utiliser le vrai composant. Montrer les variantes prévues et les cas qui risquent de casser : contenu long, prop absente, slot vide, plusieurs instances et attributs complémentaires.

Importer ensuite le composant dans la vue qui en a besoin et remplacer le markup dupliqué. Vérifier que les données appartiennent à la vue appelante et non au design system.

## Documentation à mettre à jour

Lorsque le composant est confirmé :

- ajouter ou actualiser sa ligne dans [LINKS.md](../LINKS.md) ;
- ajouter les données dans `src/pages/_demo.ts` si nécessaire ;
- documenter ses props à partir de son interface dans `src/pages/components.astro` ;
- signaler les écarts avec Figma dans la documentation ;
- mettre à jour les listes ou comptes indiqués dans `src/pages/index.astro` et `README.md` si nécessaire.

La documentation ne doit pas créer une seconde définition des props ou des tokens.

## Validation finale

L'agent doit fournir les résultats de ces vérifications, selon le périmètre :

1. `npm run check` ;
2. rendu dans le navigateur ;
3. navigation au clavier et focus visible ;
4. vérification sous `768px`, avec contenu long et props absentes ;
5. contraste et sémantique dans les outils d'accessibilité ;
6. `npm run build && npm run preview` lorsqu'une URL, un asset ou le préfixe de publication est concerné.

Ne pas déclarer le travail terminé sans dire quelles vérifications ont été exécutées et lesquelles restent impossibles.

## Conditions d'arrêt

S'arrêter et demander une clarification lorsque :

- le rôle du composant n'est pas défini ;
- Figma est la source mais le nœud ou sa description sont inaccessibles ;
- une variante demandée n'est pas justifiée par une vue actuelle ;
- deux composants existants semblent pouvoir porter le besoin et le choix n'est pas tranché ;
- la demande contredit la documentation ou le contrat d'un composant existant ;
- la modification risque de toucher un autre composant sans validation de son usage.

Ne jamais combler une information manquante par une supposition présentée comme un fait.

## Compte rendu attendu

À la fin, résumer :

- le besoin et le composant retenu ;
- les fichiers modifiés ;
- les décisions prises et les écarts signalés ;
- les vérifications exécutées et leur résultat ;
- les points restant à décider.
