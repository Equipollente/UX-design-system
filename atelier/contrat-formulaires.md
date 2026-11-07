# Contrat des composants de formulaire

Phase 2 du passage de Figma au code : pour chaque composant, ce que Figma dit et ce que le code
en fait. Ce fichier ne contient aucune valeur de design ; il dit **quelle propriété Figma devient
quelle prop**, ce que le composant n'est pas, ce qu'il doit à l'accessibilité et quels rôles de
tokens il lit.

Sources, dans l'ordre de priorité : Figma (le dessin et sa description), puis
[decisions.md](decisions.md), puis le code existant, qui est réécrit et ne fait pas autorité. Un
écart se signale, il ne se corrige pas en dur — voir [ajouter-un-composant.md](ajouter-un-composant.md).

Hors périmètre, à la demande de Judith : `MultiSelect`, `Chip`, `AddImage`, `EditImageGallery`.

## Une limite d'Astro qui change le `Field` public

Décidé le 07/11 : le `Field` enveloppe les champs. En écrivant ce contrat, un obstacle est apparu :
**un composant Astro ne peut pas poser d'attribut sur ce qu'on glisse dans son emplacement.** Un
`Field` public ne peut donc pas écrire `aria-describedby` ni `aria-invalid` sur le champ qu'il
contient, et le trait rouge du champ doit lui aussi savoir qu'il y a une erreur. L'appelant devrait
dire la validation deux fois :

```astro
<Field id="mail" label="Courriel" error="Adresse invalide">
  <Input id="mail" validation="error" aria-describedby="mail-message" />
</Field>
```

Ce contrat retient donc une variante qui garde ce que le `Field` apportait :

- **`_Field`, une pièce interne.** Elle range libellé, champ, compteur, message et aide, dans cet
  ordre, une seule fois pour tout le système. Changer l'écart libellé ↔ champ se fait à un seul endroit.
- **`Input`, `Textarea` et `Select` la posent eux-mêmes** et reçoivent `label`, `hint`, `error`,
  `success` et `counter` en props. L'appelant écrit une seule balise, et le câblage ARIA reste
  rendu côté serveur, sans script.
- **`FormGroup` dans Figma ne change pas** : c'est la maquette de cette pile, et `type` dit quel
  champ elle contient.

C'est le seul point du contrat qui revient sur une décision. **Validé par Judith le 07/11 :** pièce
interne `_Field`, pas de `Field` public.

## Le vocabulaire commun

Décidé le 07/11 ([decisions.md](decisions.md)). Rappel de ce qui devient une prop :

| Dans Figma | Dans le code |
| --- | --- |
| `state=disabled` | prop `disabled` |
| `state=rest`, `hover`, `focus` | CSS (`:hover`, `:focus-visible`), pas de prop |
| `validation=error`, `success` | props `error` et `success`, qui portent le message |
| `size` | prop `size` |
| `checked`, `indeterminate` | props du même nom |
| `orientation` | prop du même nom |
| `label?`, `hint?`, `counter?` | `label` (masqué si `hideLabel`), `hint`, `counter` |
| `type` de `FormGroup` | le composant : `Input` (`text`, `search`), `Select`, `Textarea` |

## Règles communes aux champs

Elles valent pour `Input`, `Textarea` et `Select`.

- **Un seul message de validation à la fois.** `error` l'emporte sur `success`. Figma dessine l'aide
  sous le message, et le texte de l'aide peut rester affiché avec lui : le code suit Figma
  (question 2).
- **Les identifiants se déduisent de `id`** : `${id}-hint`, `${id}-message`, `${id}-count`. Le
  champ porte toujours `aria-describedby` vers ceux qui existent.
- **`error` pose `aria-invalid="true"`** sur le champ, et le trait suit la validation.
- **`required` pose l'attribut natif** et l'astérisque du libellé, que les lecteurs d'écran ne lisent
  pas (`aria-hidden`).
- **`disabled` pose l'attribut natif** et atténue le libellé, le champ et l'aide.
- **Le libellé est obligatoire.** `hideLabel` le masque à l'écran sans le retirer : c'est `label?`
  éteint dans Figma. Un champ sans nom accessible est refusé à la compilation.
- **Le focus est visible au clavier** (`:focus-visible`), jamais retiré sans remplaçant.
- Les attributs inconnus passent au champ (`...rest`).

## Les pièces internes

Préfixe `_`, jamais importées par un site.

| Pièce | Nœud Figma | Props | Accessibilité |
| --- | --- | --- | --- |
| `_Field` | `FormGroup` `936:9502` | `id`, `label`, `hideLabel`, `hint`, `error`, `success`, `counter`, `required`, `disabled`, emplacement du champ | Range les pièces ci-dessous dans l'ordre : libellé, champ, compteur, message, aide |
| `_FieldLabel` | `918:2412` | `for`, `as` (`label` ou `legend`), `required`, `disabled` | `label for=id` ; `legend` en tête d'un `fieldset` pour un groupe |
| `_FieldHint` | `938:10734` | `id`, texte | Lue par `aria-describedby` |
| `_FieldMessage` | `918:2405` | `id`, `type` (`error` ou `success`), texte | Lue par `aria-describedby` ; l'icône est décorative |
| `_FieldCounter` | `938:10738` | `id`, `current`, `max` | Lue par `aria-describedby` ; mis à jour à la frappe par un petit script |

`_FieldValue` et `_FieldType` ne sont pas des composants du code : ce sont des morceaux du dessin
du champ (le texte et l'icône de loupe ou de chevron), qui deviennent du CSS et une icône.

## `Input`

Nœuds : `FormGroup` `type=text|search` `936:9502`, boîte `Input fields` `932:7425`.

Ce que c'est : un champ d'une ligne pour un nom, un courriel, un numéro, une recherche. Ce que ce
n'est pas : une zone de texte (c'est `Textarea`), un choix dans une liste (c'est `Select`).

| Prop | Type | Défaut | Vient de |
| --- | --- | --- | --- |
| `id` | `string`, obligatoire | | |
| `label` | `string`, obligatoire | | `label?` et le texte |
| `hideLabel` | `boolean` | `false` | `label?` éteint |
| `type` | `'text' \| 'email' \| 'tel' \| 'url' \| 'search'` | `'text'` | `type` de `FormGroup` |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | `size` |
| `value`, `placeholder`, `name`, `maxlength`, `autocomplete` | | | `text` (`value` ou `placeholder`) |
| `hint`, `error`, `success` | `string` | | `hint?`, `validation` |
| `required`, `disabled` | `boolean` | `false` | `state=disabled` |

Accessibilité : `<input>` natif, rôle porté par le `type` (`search` donne un champ de recherche).
Clavier : celui du navigateur, rien à ajouter. La loupe de `type="search"` est une icône
décorative en tête du champ.

Rôles lus : fond `color/background/base/input` (et `-input-disabled`), fonds de validation
`color/background/danger/subtlest` et `success/subtlest` ; trait `color/border/base/input`,
`-focus`, `-input-disabled`, `danger/default`, `danger/strong`, `success/default`,
`success/strong` ; rembourrage `stack/control/{size}/paddingBlock` et
`stack/control/small/paddingInline/normal` ; rayon `border/radius/small` ; trait
`border/width/default`.

## `Textarea`

Nœuds : `FormGroup` `type=textarea` `936:9502`, boîte `Textarea fields` `979:952`.

Ce que c'est : une zone pour du texte sur plusieurs lignes, la seule à compter ses caractères. Ce que
ce n'est pas : un champ d'une ligne (`Input`), ni un éditeur.

Props : celles d'`Input`, sauf `type`, `size` et `autocomplete`, plus :

| Prop | Type | Défaut | Vient de |
| --- | --- | --- | --- |
| `rows` | `number` | | La hauteur : un nombre de lignes, jamais des pixels |
| `maxlength` | `number` | | La limite |
| `counter` | `boolean` | `false` | `counter?` — sans `maxlength`, il n'y a rien à compter |

Pas de `size` : décidé le 07/11, la hauteur passe par `rows`. `resize: vertical`.

Accessibilité : `<textarea>` natif. Le compteur est lu par `aria-describedby`, et son texte se met à
jour à la frappe (un script de quelques lignes, indispensable ici). Pas d'annonce à chaque lettre : le
compteur n'est pas une région `aria-live`.

Rôles lus : ceux d'`Input`, plus `color/border/neutral/strong` au survol et `color/text/base/muted`
pour l'exemple.

## `Select` (la boîte seulement)

Nœuds : `Select` `954:6709`, `FormGroup` `type=select`.

Ce que c'est : la boîte d'un choix unique. Ce que ce n'est pas : le choix de plusieurs valeurs
(`MultiSelect`, hors périmètre), ni un menu natif.

Props : celles d'`Input` (sans `type` ni `maxlength`), plus `options`, `value` et `placeholder`.

**La liste est le dessin propre de Judith (07/11)**, pas celui de Primer : deux pièces, `_SelectPanel`
(`type` `single` ou `multiple`, interrupteurs `searchable?`, `creatable?`, `showSelected?`, avec la
recherche en `Input fields`) et `_SelectItem` (`type` `multiple`, `single` ou `create`, `selected`,
`state`), plus `_SelectList` et `_SelectGroupLabel`. Six cas sont dessinés dans le cadre « Cas » de la
page ↳ Select Panel. Le comportement (clavier, rôle ARIA de la liste, création) reste à écrire :
c'est la phase 3.

## `Checkbox`

Nœuds : `Checkbox` `954:3642`, la case seule `_CheckboxInput` `873:51724`.

Ce que c'est : un choix oui ou non, seul ou dans une liste où plusieurs peuvent être retenus. Ce
que ce n'est pas : un interrupteur (`Toggle`), un choix exclusif (`Radio`).

| Prop | Type | Défaut | Vient de |
| --- | --- | --- | --- |
| `id`, `label` | `string`, obligatoires | | |
| `name`, `value` | `string` | `name` = `id` | |
| `checked` | `boolean` | `false` | `checked` |
| `indeterminate` | `boolean` | `false` | `indeterminate` — elle l'emporte sur `checked` |
| `hint` | `string` | | `hint?` |
| `required`, `disabled` | `boolean` | `false` | `state=disabled` |

Pas de `error` : Figma ne dessine pas d'erreur pour une case, et la décision est de ne pas inventer
la variante. `<input type="checkbox">` natif. `indeterminate` n'existe qu'en JavaScript dans le DOM :
un script de quelques lignes la pose au chargement, c'est le seul usage de script du composant.
Clavier : Espace coche.

Rôles lus : fond `color/background/base/input`, coché `color/background/primary/bold` ; trait
`color/border/base/input`, `-input-disabled`, `primary/default` ; focus `color/border/base/focus` ;
rayon `border/radius/small` ; écarts `stack/control/xsmall/gap`, `base/8`.

## `CheckboxGroup`

Nœud : `_CheckboxGroup.items` `876:61534`.

| Prop | Type | Défaut | Vient de |
| --- | --- | --- | --- |
| `legend` | `string`, obligatoire | | La question posée au groupe |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | `orientation` |
| emplacement | `Checkbox` | | `Slot` |

`<fieldset>` et `<legend>` (via `_FieldLabel as="legend"`) : c'est ce qui nomme le groupe pour un
lecteur d'écran.

## `Radio` et `RadioGroup`

Nœuds : `Radio` `876:64956`, le rond seul `_RadioInput` `875:53423`, groupe `_RadioGroup.items`
`875:53524`.

Ce que c'est : un choix dans une courte liste où un seul est retenu. Ce que ce n'est pas : une case
(`Checkbox`), une liste longue (`Select`). La question va en légende du groupe, pas dans le radio.

Props de `Radio` : `id`, `label`, **`name` obligatoire** (deux radios ne s'excluent que s'ils le
partagent), `value`, `checked`, `hint`, `disabled`. Pas de `required` sur un radio isolé : il
appartient au groupe.

Props de `RadioGroup` : `legend`, `orientation`, `name` (posé sur chaque radio), `required`.

`<input type="radio">` natif. Clavier : les flèches parcourent le groupe, Tab y entre une seule fois
— c'est le comportement natif des radios de même `name`.

Rôles lus : comme `Checkbox`, plus `color/border/primary/strong` et `border/radius/full`.

## `Toggle`

Nœuds : `Toggle` `878:69950`, la piste seule `_ToggleInput` `878:69938`.

Ce que c'est : un interrupteur dont l'effet est immédiat. Ce que ce n'est pas : une case que l'on
valide ensuite (`Checkbox`), un choix parmi plusieurs (`Radio`).

Props : `id`, `label`, `name`, `checked`, `hint`, `disabled`.

`<input type="checkbox" role="switch">` natif. Clavier : Espace bascule. Le rôle `switch` annonce
« activé » ou « désactivé » au lieu de « coché ».

Rôles lus : piste `color/background/neutral/bold` éteinte et `primary/bold` allumée, désactivée
`neutral/subtle` ; curseur `color/background/base/default` ; focus `color/border/base/focus` ;
rayon `border/radius/full` ; trait `border/width/default` et `thick`.

## Écarts entre Figma et l'ancien code

Le code est réécrit, donc ces écarts ne sont pas à corriger : ils disent ce que le nouveau code ne
reprend pas.

| Écart | Décision du contrat |
| --- | --- |
| `showCount` (ancien code) contre `counter?` (Figma) | `counter`, comme Figma |
| Une erreur remplaçait l'aide | Figma montre les deux : le code suit Figma (question 2) |
| Le survol grisait le fond (ancien dessin) | Le trait fonce, comme dans `Textarea fields` ; pas de `hover` dessiné pour `Checkbox`, `Radio`, `Toggle` |
| Rembourrage, rayon et écarts en tokens `control/*`, `space/*` | Les rôles `stack/control/*` et `border/*` de Figma |
| `xsmall` | Retiré du dessin le 07/11, aucune prop |

## Décisions du 07/11

1. **Pièce interne `_Field`**, pas de `Field` public : la pile est écrite une fois, et chaque champ la
   pose lui-même.
2. **L'aide reste affichée avec un message d'erreur ou de succès**, comme Figma. Les deux sont lus par
   `aria-describedby`.
3. **Le compteur se met à jour à la frappe** : un petit script dans `Textarea`.
4. **Le survol** : pas dessiné pour `Checkbox`, `Radio` et `Toggle`. Seuls le curseur et le focus
   les distinguent.

## Questions ouvertes pour Judith

1. **L'épaisseur de l'anneau de focus** n'a pas de rôle : le dessin lit `border/width/default` (1)
   pour le champ et `thick` (2) pour le rond. Un rôle `border/width/focus` dans `NEW Size` règlerait
   les deux.
