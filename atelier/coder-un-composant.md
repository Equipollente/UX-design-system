# Workflow — créer un composant Astro réutilisable

Guide pas à pas. Suis les étapes dans l'ordre : chacune prépare la suivante. Les cases à cocher sont là pour que tu valides toi-même avant de passer à l'étape d'après.

Exemple fil rouge : un composant `Card` (carte de contenu avec titre, contenu libre, lien optionnel).

---

## Étape 1 — Cadrer avant d'écrire

**Objectif :** savoir exactement ce que tu construis avant d'ouvrir un fichier.

Réponds par écrit à ces trois questions :

1. **Que fait ce composant, en une phrase ?**
   Si ta phrase contient « et », c'est probablement deux composants.
   *Exemple : « Affiche un bloc de contenu avec un titre, cliquable ou non. »*

2. **Quelles variantes existent dans les maquettes ?**
   Uniquement celles qui existent aujourd'hui. Pas celles qu'on « pourrait avoir un jour ».
   *Exemple : `default` et `featured` (fond coloré).*

3. **Un composant existant fait-il déjà ça à 80 % ?**
   Ouvre `src/components/` et regarde. Si oui, modifie-le au lieu d'en créer un nouveau.

> **Piège :** coder un composant générique qui anticipe tout. Il finit avec quinze props dont trois sont utilisées. Construis pour les cas réels, ajoute quand le besoin arrive.

- [ ] Phrase de définition écrite
- [ ] Liste des variantes réelles
- [ ] Vérifié qu'aucun composant existant ne couvre le besoin

---

## Étape 2 — Placer et nommer

**Objectif :** que n'importe qui retrouve le composant et comprenne son rôle depuis le nom.

- Emplacement : `src/components/`
- Nom : PascalCase, décrit **ce que c'est**, pas **où ça s'affiche**.

| Bon | Mauvais | Pourquoi |
|---|---|---|
| `Card.astro` | `HomepageBlock.astro` | Le jour où tu réutilises la carte ailleurs, le nom ment. |
| `Button.astro` | `SubmitThing.astro` | Un bouton est un bouton, quel que soit l'usage. |

Si le composant a des parties qui n'ont de sens qu'ensemble, crée un dossier :

```
src/components/Card/
  Card.astro
  CardHeader.astro
  CardFooter.astro
```

- [ ] Fichier créé au bon endroit avec le bon nom

---

## Étape 3 — Typer l'interface avant le HTML

**Objectif :** décider ce que le composant reçoit de l'extérieur, avant d'écrire une seule balise.

Un fichier `.astro` a deux parties :

- Le **frontmatter**, entre les `---` : du TypeScript exécuté au build (jamais dans le navigateur).
- Le **template**, en dessous : du HTML.

Dans le frontmatter, déclare d'abord l'interface :

```astro
---
interface Props {
  title: string;
  variant?: 'default' | 'featured';
  href?: string;
}

const { title, variant = 'default', href } = Astro.props;
---
```

Ce qu'il faut comprendre ligne par ligne :

- `interface Props` — nom réservé. Astro l'utilise pour vérifier que ceux qui appellent ton composant passent les bonnes props.
- `title: string` — obligatoire. Oublier `title` produit une erreur dans l'éditeur.
- `variant?` — le `?` rend la prop optionnelle.
- `'default' | 'featured'` — seules ces deux valeurs sont acceptées. `variant="big"` sera souligné en rouge.
- `variant = 'default'` — valeur par défaut, donnée dans la destructuration de `Astro.props`.

**Pourquoi avant le HTML ?** Si tu écris le HTML d'abord, tu ajoutes les props au fur et à mesure que tu en as besoin, et l'interface devient un tas de rustines. Écrire l'interface d'abord t'oblige à réfléchir à ce qui entre.

- [ ] `interface Props` déclarée
- [ ] Props obligatoires vs optionnelles distinguées
- [ ] Valeurs par défaut explicites

---

## Étape 4 — Écrire le markup et les slots

**Objectif :** un HTML sémantique, avec deux canaux d'entrée clairs.

### Deux façons de faire entrer du contenu

| Canal | Pour quoi | Exemple |
|---|---|---|
| **Prop** | Valeur courte et typée | un titre, une URL, une variante |
| **Slot** | Contenu libre écrit par le parent | un paragraphe, une liste, une image |

### Le template

```astro
<article class="card" data-variant={variant}>
  <h2>{title}</h2>
  <slot />
</article>
```

- `{title}` — insère la valeur de la prop.
- `<slot />` — tout ce que le parent met entre `<Card>` et `</Card>` apparaît ici.
- `data-variant={variant}` — expose la variante au CSS (voir étape 5).

### Utilisation depuis une page

```astro
---
import Card from '../components/Card.astro';
---

<Card title="Hello" variant="featured">
  <p>This is the card body.</p>
</Card>
```

### Slots nommés — seulement si plusieurs zones

```astro
<article class="card">
  <h2>{title}</h2>
  <slot />
  <footer><slot name="footer" /></footer>
</article>
```

```astro
<Card title="Hello">
  <p>Body.</p>
  <p slot="footer">Footer text.</p>
</Card>
```

Règle : un slot par défaut, des slots nommés uniquement si tu as vraiment deux zones distinctes.

### Laisser passer les attributs

Si ton composant enveloppe un élément natif, le parent doit pouvoir ajouter `class`, `aria-label`, `data-*` sans que tu prévoies une prop pour chaque cas :

```astro
---
const { title, variant = 'default', ...rest } = Astro.props;
---

<article class="card" data-variant={variant} {...rest}>
```

### HTML sémantique

Utilise `<article>`, `<section>`, `<nav>`, `<h2>`, `<a>`, `<button>` — pas des `<div>` partout. Tu gagnes l'accessibilité et le référencement gratuitement.

- [ ] Balises sémantiques
- [ ] Un `<slot />` par défaut
- [ ] Slots nommés uniquement si nécessaire
- [ ] `{...rest}` si le composant enveloppe un élément natif

---

## Étape 5 — Styler en scopé

**Objectif :** des styles qui ne fuient pas hors du composant.

Un `<style>` dans un fichier `.astro` est **scopé** : Astro ajoute un attribut unique aux éléments et réécrit les sélecteurs. Ta classe `.card` ne touchera jamais une autre `.card` ailleurs dans le projet.

```astro
<style>
  .card {
    padding: 1rem;
    border: 1px solid var(--color-border);
  }

  .card[data-variant="featured"] {
    background: var(--color-accent);
  }
</style>
```

Deux approches pour les variantes — choisis-en une et reste cohérent :

**A. Attribut `data-*`** (ci-dessus) — lisible dans l'inspecteur, un seul sélecteur par variante.

**B. `class:list`** — ajoute une classe conditionnellement :

```astro
<article class:list={['card', { featured: variant === 'featured' }]}>
```

```css
.card.featured { background: var(--color-accent); }
```

**Ce qu'on ne fait pas :** `is:global` sur les styles d'un composant. Réservé aux vrais globaux (reset, variables CSS, typographie), qui vivent dans un layout ou un fichier CSS global.

- [ ] Styles dans `<style>` scopé
- [ ] Variantes via `data-*` ou `class:list`
- [ ] Aucun `is:global`

---

## Étape 6 — Décider l'interactivité

**Objectif :** zéro JavaScript envoyé au navigateur, sauf si c'est indispensable.

Par défaut, un composant Astro produit du HTML pur. C'est l'argument principal d'Astro. Avant d'ajouter du JS, pose-toi la question dans cet ordre :

### 1. Le CSS suffit-il ?

`:hover`, `:focus-visible`, `<details>`/`<summary>`, transitions. Souvent oui.

### 2. Un petit script suffit-il ?

Une balise `<script>` dans le fichier. Astro le bundle et l'exécute **une fois par page**, même si le composant apparaît dix fois.

```astro
<button class="copy-btn" data-text={text}>Copy</button>

<script>
  document.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.text ?? '');
    });
  });
</script>
```

> **Piège :** `querySelector` (singulier) n'attache le comportement qu'à la première instance. Utilise `querySelectorAll` et boucle.

### 3. Faut-il de l'état réactif ?

Formulaire multi-étapes, panier, filtre dynamique : là, un composant React/Svelte/Vue avec une directive `client:*`. Choisis la moins coûteuse :

| Directive | Quand le JS se charge | Utiliser pour |
|---|---|---|
| `client:visible` | quand l'élément entre à l'écran | tout ce qui est sous la ligne de flottaison |
| `client:idle` | quand le navigateur est libre | interactivité non prioritaire |
| `client:load` | immédiatement | uniquement ce qui doit réagir dès l'arrivée |

Chaque `client:load` inutile, c'est du JS que l'utilisateur télécharge pour rien.

- [ ] Vérifié que le CSS ne suffit pas
- [ ] Si `<script>` : `querySelectorAll`, pas `querySelector`
- [ ] Si framework : directive `client:*` la moins agressive possible

---

## Étape 7 — Tester dans une page de dev

**Objectif :** voir toutes les variantes et tous les cas limites côte à côte.

Crée `src/pages/dev/components.astro` :

```astro
---
import Card from '../../components/Card.astro';
---

<h1>Card</h1>

<h2>default</h2>
<Card title="Default card"><p>Body.</p></Card>

<h2>featured</h2>
<Card title="Featured card" variant="featured"><p>Body.</p></Card>

<h2>with href</h2>
<Card title="Linked card" href="/somewhere"><p>Body.</p></Card>

<h2>long title</h2>
<Card title="A very long title that keeps going and going to check how the layout handles overflow and wrapping">
  <p>Body.</p>
</Card>

<h2>empty slot</h2>
<Card title="No body" />
```

Cas à inclure systématiquement : chaque variante, chaque prop optionnelle absente, un texte très long, un slot vide.

Tester uniquement dans la vraie page du site ne suffit pas : tu ne vois qu'un seul cas, celui qui marche.

- [ ] Page de dev créée
- [ ] Toutes les variantes instanciées
- [ ] Cas limites : texte long, prop absente, slot vide

---

## Étape 8 — Vérifier

**Objectif :** ne pas dire « c'est fini » avant ces trois contrôles.

### Types

```bash
npx astro check
```

Signale un `<Card>` appelé sans `title`, une valeur de `variant` invalide, etc.

### Rendu

Dans le navigateur, sur la page de dev :

- Redimensionne la fenêtre (mobile → desktop).
- Ouvre l'inspecteur : le HTML produit est-il celui attendu ?
- Rien ne saute au chargement (pas de décalage de mise en page).

### Accessibilité

- Navigue au clavier avec `Tab` : le focus est-il visible sur chaque élément interactif ?
- Onglet Accessibilité de l'inspecteur : contraste suffisant, rôles corrects.
- Un lecteur d'écran lirait-il quelque chose de sensé ? (Les balises sémantiques de l'étape 4 font le travail.)

- [ ] `astro check` sans erreur
- [ ] Rendu vérifié en mobile et desktop
- [ ] Focus visible au clavier, contraste OK

---

## Étape 9 — Intégrer et documenter

**Objectif :** remplacer le code dupliqué, laisser une trace claire.

1. Cherche dans le projet les endroits où ce markup était dupliqué. Remplace-les par le composant.
2. Commit à part, message explicite :
   ```
   Extract Card component, replace 4 usages
   ```
3. Si l'usage n'est pas évident, un commentaire JSDoc au-dessus de l'interface. L'éditeur l'affiche au survol :

```astro
---
/** Content card. Pass `href` to make the whole card clickable. */
interface Props {
  title: string;
  variant?: 'default' | 'featured';
  href?: string;
}
---
```

Pas de README séparé pour un composant : la doc qui vit loin du code n'est jamais à jour.

- [ ] Usages dupliqués remplacés
- [ ] Commit atomique
- [ ] JSDoc si l'usage n'est pas évident

---

## Récapitulatif

| # | Étape | Question à se poser |
|---|---|---|
| 1 | Cadrer | Que fait-il, en une phrase ? Quelles variantes réelles ? |
| 2 | Placer et nommer | Le nom dit-il *ce que c'est* ? |
| 3 | Typer l'interface | Qu'est-ce qui entre, obligatoire ou optionnel ? |
| 4 | Markup et slots | Prop ou slot ? Balises sémantiques ? |
| 5 | Styles scopés | Rien ne fuit hors du composant ? |
| 6 | Interactivité | Le CSS suffit-il ? Sinon, le moins de JS possible. |
| 7 | Page de dev | Toutes les variantes et cas limites visibles ? |
| 8 | Vérifier | Types, rendu, accessibilité. |
| 9 | Intégrer | Duplications remplacées, commit clair. |

**Si tu ne retiens qu'une chose :** l'interface avant le HTML. Un composant dont on a réfléchi l'entrée se réutilise ; un composant dont on a d'abord écrit la sortie se rafistole.

---

## Template de fichier

Un fichier `ComponentTemplate.astro` accompagne ce guide. Il est entièrement commenté et reprend les étapes 3 à 8 dans l'ordre. Pour démarrer un composant :

1. Copie `ComponentTemplate.astro` vers `src/components/YourName.astro`.
2. Renomme la classe `component` et adapte l'interface `Props`.
3. Supprime chaque commentaire et chaque section dont tu n'as pas besoin (slot nommé, script). Le fichier final doit être court.

Version minimale, sans commentaires, si tu connais déjà le workflow :

```astro
---
/** One-line description of what this component does. */
interface Props {
  requiredProp: string;
  optionalProp?: 'a' | 'b';
}

const { requiredProp, optionalProp = 'a', ...rest } = Astro.props;
---

<div class="component" data-variant={optionalProp} {...rest}>
  <span>{requiredProp}</span>
  <slot />
</div>

<style>
  .component {
    /* base styles */
  }

  .component[data-variant="b"] {
    /* variant styles */
  }
</style>
```