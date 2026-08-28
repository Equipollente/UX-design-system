# Modifier un composant

Le geste est court ; ce qui coûte, c'est **ce que le changement oblige à mettre à jour ailleurs**.
Un composant modifié sans sa doc devient un mensonge affiché en ligne.

## Avant de toucher au fichier

Relire son pavé de tête. Il dit ce que l'objet est et ce qu'il n'est pas — si la modification
demandée contredit cette phrase, le geste n'est pas « modifier ce composant » : c'est en écrire un
autre, ou rouvrir la définition. Le pavé se met alors à jour dans le même commit.

**Une valeur qui paraît fausse ne se corrige pas ici.** La source est Figma : la correction va dans
le fichier, puis dans l'export, puis dans `npm run tokens`. Jamais en dur dans un composant — voir
[ajouter-une-icone-ou-un-token.md](ajouter-une-icone-ou-un-token.md).

**Une variante réclamée ne s'intègre que si une vue l'utilise vraiment.** `Ghost` et `CTA` attendent
depuis le début, et c'est voulu.

## Ce que le changement entraîne

| Ce qui change | Ce qui suit, dans le même commit |
|---|---|
| Une prop ajoutée, renommée, supprimée | le tableau de sa section dans [components.astro](../src/pages/components.astro) — l'`interface Props` est la seule définition, la doc la recopie |
| Un slot ajouté, renommé, supprimé | le tableau **Slots** de sa section — c'en est un second, sous celui des props, et on l'oublie parce qu'on ne le cherche pas — plus le `<h3>` qui compte les emplacements, qui ment dès qu'il y en a un de plus. **Un slot ne se renomme pas à la légère** : Astro ne signale pas un nom inconnu, et le contenu disparaît sans erreur chez le consommateur |
| Une variable CSS de surcharge ajoutée | elle est de la surface publique : elle se documente, comme `--card-height` et `--intro-gap` l'ont été |
| Un comportement, un état, un défaut | le pavé de tête du `.astro`, et le `<h3>` correspondant dans la doc |
| Un écart avec Figma résolu | retirer son `<p class="flag">` **et** passer sa ligne d'[arbitrages.md](arbitrages.md) en réglé — un écart réglé qui reste affiché est un mensonge à l'écran |
| Un écart nouveau | un `<p class="flag">`, et une ligne dans `arbitrages.md` s'il appelle un geste dans Figma |
| Le nom du composant | [LINKS.md](../LINKS.md), l'import de `components.astro`, et le `_demo.ts` s'il y figure |
| Un script ajouté | le commit dit **quel échec a été mesuré**, avec son numéro WCAG — et le composant marche toujours sans lui |

Deux points qu'on oublie systématiquement quand un composant en fait bouger un autre : une variable
posée depuis l'extérieur se documente dans la section de **celui qui la reçoit**, pas de celui qui
la pose ; et un composant qui rend son propre `<section>` ne doit pas hériter de la chrome de la
doc — la règle est resserrée en `main > section` pour ça.

## Vérifier

Comme à l'ajout :

- `npm run check` — lui seul type les `.astro`.
- `npm run dev` et regarder : au clavier, sous 768px, et sur une fenêtre courte si l'objet a une
  hauteur.
- `npm run build && npm run preview` dès qu'une URL ou un asset est en jeu.

Et le contrôle propre à la modification : **ouvrir les autres pages**. Un composant modifié se
montre sur `/components` mais vit aussi sur `/templates/home`, et une valeur reprise en variable
locale peut être lue ailleurs sans être déclarée. Une régression se voit là, pas dans le fichier.

## Commiter

Un commit par mouvement, qui se relit seul. **Un défaut antérieur se commite séparément** — c'est
la convention du dépôt, et elle sert précisément à pouvoir reprendre l'un sans l'autre.
