# Suivi — intégration des composants de formulaire

Document de bord du sprint. Il dit **où on en est**, et surtout **ce qui a été vu dans Figma et
volontairement pas implémenté**. Cette seconde liste est la vraie valeur du document : sans elle,
un écart se relit comme un oubli.

## La règle du sprint, et comment elle a changé en cours de route

Le sprint partait sur une règle unique :

> **Rien de neuf.** Aucun token, aucune icône, aucune valeur en dur. Une propriété vue dans Figma
> qui n'a pas de variable dans le système **ne s'implémente pas** : elle se note ici, et on passe.

Appliquée à la lettre aux trois premiers contrôles, elle a produit l'inverse de ce qu'elle
cherchait. Radio, Checkbox et Toggle sortaient en **contrôles du navigateur** — 13 × 13,
`appearance: auto`, fond transparent, rayon 0 — parce que leur seule mesure manquante, le côté de
la boîte, bloquait tout le dessin. Rien n'était inventé, et rien n'était le système non plus.

**Judith a tranché le 27/08 :**

> Quand Figma ne lie aucune variable à une mesure, on prend le **token de la même famille le plus
> proche** ; quand deux tokens la composent exactement, **on les compose**. Chaque substitution est
> notée avec son écart en pixels.

Traits et opacités sont restés hors-jeu jusqu'au bout du sprint, faute de tokens. **Ce n'est plus
vrai depuis le 27/08** : les trois familles ont été créées, et les champs portent leur trait. Voir
plus bas.

Cette règle écrase la convention §4 de [conventions.md](conventions.md), qui autorise à hisser une
valeur sans token en variable locale nommée d'après l'objet. Ce chemin est resté fermé : rien n'a
été écrit en dur, la substitution passe toujours par une variable existante.

Vocabulaire employé, et lui seul : 43 `color`, 10 `space`, 4 `radius`, 27 `font`, 21 `button`,
6 `card`, 1 `nav`, 6 `motion`, plus les 18 icônes de `lib/icons.ts` — et depuis le 27/08,
3 `control`, 2 `border`, 1 `opacity`.

## Où on en est

| # | Composant | Nœud Figma | État | Fait le |
| --- | --- | --- | --- | --- |
| 0 | FieldLabel | — (spécifié en conversation) | ✅ intégré | 27/08 |
| 0 | Select — boîte fermée | [`340-933`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=340-933) | 🟡 partiel — nœud retrouvé, trois écarts non comptés | 27/08 |
| 1 | Radio | [`340-879`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=340-879) | ✅ intégré | 27/08 |
| 2 | Checkbox | [`340-842`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=340-842) | ✅ intégré | 27/08 |
| 3 | Toggle | [`340-912`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=340-912) | ✅ intégré | 27/08 |
| 4 | Text Area | [`343-273`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=343-273) | ✅ intégré | 27/08 |
| 5 | Chip | [`351-273`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=351-273) | ✅ intégré | 27/08 |
| 6 | Add Image | [`343-315`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=343-315) | ✅ intégré | 27/08 |
| 7 | Edit Image Gallery | [`355-1396`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=355-1396) | ✅ intégré | 27/08 |
| 8 | Text field | [`23-29`](https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=23-29) | ✅ intégré | 31/08 |

**Le huitième est arrivé quatre jours après les autres, et il était là depuis le début.** Le sprint
avait relevé ses composants dans la plage `340`–`355` ; `forms/Field` est en `23`, dessiné bien
avant, et il n'apparaissait ni dans les intégrés ni dans les non-intégrés de [LINKS.md](../LINKS.md).
Personne ne l'a cherché parce que personne ne le croyait manquant — c'est le second nœud du fichier
qu'on retrouve ainsi, après celui du Select. Le geste qui l'a fait sortir : chercher `field` dans les
composants du fichier avant de conclure qu'un objet n'existe pas.

Son seul écart de mesure était le rembourrage, 6 / 14, réglé le jour même par le geste du 27/08 —
nœud redessiné à 12 / 16, aucune variable créée. Le tableau des substitutions reste donc vide.

Le doublon de lien signalé entre Chip et Edit Image Gallery n'en était pas un : `355:1396` se lit
sans difficulté, et c'est bien un composant distinct.

## Les substitutions de mesure — le tableau est vide

**Les sept substitutions ont disparu le 27/08.** Trois par une variable nouvelle, trois par un nœud
redessiné, une par une lecture qui manquait. Ce tableau reste, sans lignes : il dit maintenant que
plus aucune mesure des neuf composants n'est approchée.

| Ce qui écartait | Combien | Comment c'est parti |
| --- | --- | --- |
| Radio · Checkbox — boîte 18 | −2 | `control/size` |
| Toggle — piste 22 de haut | +2 | `control/track-height` |
| Text Area — écart au libellé 5 | −1 | `control/field-gap`, et Select le prend aussi |
| Toggle — écart au libellé 10 | −2 | le nœud redessiné à 8, comme ses deux voisins |
| Text Area — rembourrage 14 / 10 | +2 / +2 | le nœud redessiné sur les 12 / 16 du bouton |
| Add Image — trait 1,5 | — | le nœud redessiné à 1, avec Add Folder |
| partout — anneau de focus 2 | +1 | `border/width/focus` |

Et trois mesures que personne n'avait comptées, parce qu'on croyait le Select sans nœud : sa boîte
faisait 44 au lieu de 36, son chevron 24 au lieu de 20, son écart au libellé 8 au lieu de 5. Aucune
n'a demandé de variable — 36 est `space/2xl + space/xs`, 20 est `button/icon-size/sm`.

**Ce qui tombait déjà juste n'a pas bougé**, et c'est la moitié du travail qui n'a pas eu lieu : le
point du Radio, la piste et la pastille du Toggle, le rembourrage et l'icône d'Add Image, la hauteur
d'une vignette. Deux mesures du Toggle sont même passées de composées à **calculées** — son retrait
`(22 − 16) / 2` et sa course `40 − 16 − 3 − 3` se déduisent de la piste et de la pastille, et
suivront donc toutes seules si l'une des deux bouge dans Figma.

**Une seule ligne n'est pas partie par un token** : la vignette de la galerie, 192 pour 189. C'est
un **minimum** que la grille étire aussitôt, sous un maximum de 337 — un minimum que la mise en page
écrase n'est pas une mesure, et il ne méritait pas sa variable.

## Ce qui a été vu dans Figma et pas implémenté

Une ligne par écart. C'est ce qui remonte à Figma maintenant que le sprint est fini.

Quatre lignes en sont sorties le 27/08 : la bordure, l'opacité, et les deux conséquences qu'elles
traînaient. Ce qui reste ci-dessous ne dépend plus d'un token manquant.

| Composant | Propriété vue | Pourquoi pas implémentée |
| --- | --- | --- |
| Select | liste ouverte | dessinée par le système d'exploitation, hors d'atteinte du CSS |
| Select | trait au repos | le nœud n'en dessine pas, quand Text Area en a un — écart ouvert dans Figma |
| FieldLabel | écart astérisque ↔ mot (`0.125em`) | aucune variable ne vaut cette fraction |
| Radio · Checkbox · Toggle | libellé 14 px / 120 %, désactivé `neutral/400` | FieldLabel est à 15 / 112 / `muted`, et c'est lui qui décide de tous les libellés |
| Checkbox | épaisseur `2` du tracé de la coche | c'est l'icône `check` du registre qui sert, avec son propre tracé |
| Text Area | casse `TITLE` du libellé | capitaliserait chaque mot du texte donné par l'appelant |
| Text Area | libellé en `muted` au survol et au focus | FieldLabel n'a que deux états ; arbitrage de dessin |
| Chip | choix multiple ↔ choix unique | Figma ne les distingue pas ; le code fait une case à cocher |
| Add Image | couleur de l'icône | liée à une variable d'une **autre bibliothèque**, étrangère au système |
| Add Image | glisser-déposer | demanderait un script, et son absence n'est pas un échec |
| Edit Image Gallery | voile noir à 20 % | ce n'est pas un désactivé mais un fond, et il n'a pas eu sa variable ; les boutons `secondary` ont leur propre fond opaque, le contraste tient sans lui |
| Edit Image Gallery | largeur maximale `337` | aucune variable, et une vignette qui s'étire est le comportement attendu |

## Ce qui a été touché en dehors des sept

- **`Select.astro`** — les `border` en double, l'anneau de focus à `3px` écrit en dur et
  l'`opacity: 0.6` du désactivé ont été retirés au démarrage du sprint, comme le plan le demandait.
  Le focus prend maintenant l'anneau du système.
- **`Button.astro`** — deux props ajoutées, `name` et `value`. Un `<button type="submit">` les
  accepte nativement, et c'est ce qui permet à Edit Image Gallery de dire quelle image retirer sans
  une ligne de script.
- **`FieldLabel`** n'a pas bougé. C'est voulu : trois composants signalent que sa typographie n'est
  pas celle des nœuds, et la corriger ici trancherait un arbitrage qui revient à Figma.

## Le seul script du dépôt

`TextArea` en porte un, et le pavé du fichier dit lequel : sans lui le compteur afficherait
« 0 / 500 » alors que la boîte en contient quarante — il ne serait pas dégradé, il serait **faux**.
Ce qu'il enrichit reste facultatif : la limite est tenue par `maxlength`, côté navigateur, et le
champ fonctionne entièrement sans lui.

## Ce qui reste ouvert

- **Le dropdown ouvert du Select.** Reporté d'un commun accord. La liste d'un `<select>` natif est
  dessinée par le système d'exploitation et n'est atteignable par aucun CSS : l'afficher au dessin
  de Figma suppose de remplacer le `<select>` par une liste sur mesure, avec son clavier et son
  ARIA à réécrire.
- **Les trois familles de variables qui manquent** — mesures de contrôle, épaisseurs de trait,
  opacités. Elles sont la seule cause de tous les écarts restants. Elles ont été tranchées le 27/08 :
  voir la section suivante.

## Les trois familles — ce qui a été tranché, et ce qu'il faut créer

Tranché le 27/08, après relecture des neuf nœuds au bridge. **Rien n'est codé tant que les
variables n'existent pas dans la collection *Design tokens*.**

### Ce que la relecture a sorti

Trois choses que personne n'avait vues, et la première déplace la question de départ.

- **Le Select a un nœud : `340:933`.** Ce document et [LINKS.md](../LINKS.md) le donnaient tous
  deux comme « spécifié en conversation ». Il porte trois écarts jamais comptés : boîte de **36**
  quand le code prend les 44 du bouton (**+8**, le plus gros des neuf), chevron de **20** quand le
  code prend les 24 (**+4**), et écart au libellé de **5** quand le code écrit 8. Son rembourrage,
  lui, est exact — 12 / 16, les tokens du bouton.
- **Le Button n'a aucun état Focused.** Ses huit variantes sont `Primary`/`Secondary` ×
  `Default`/`Hover`/`Pressed`/`Disabled`, et il ne porte aucun trait dans tout le fichier.
  `button/focus-ring-width` = 3 **ne dessine rien**. Sur les onze traits de 2 du fichier, neuf sont
  des marques de focus ; le seul 3 est celui du Select.
- **La vignette de la galerie ne porte aucun trait.** Le composant en annonçait un de 1,5 : il
  n'existe pas. Ce qui y est, c'est le voile à 20 %, sur le remplissage de l'image. Corrigé.

Le recensement complet des traits, qui a tranché la troisième question :

| Épaisseur | Occurrences | Où |
|---|---|---|
| `1` | 217 | cinq pages — c'est le trait du système |
| `1,5` | 9 | Add Image et Add Folder seulement, la même zone de dépôt |
| `2` | 11 | tous les focus : Radio, Checkbox, Toggle, Chip, Text Area, Field |
| `3` | **1** | Select `State=Focused` — le seul du fichier |

### Les sept arbitrages

| Question | Réponse |
|---|---|
| L'écart libellé ↔ champ vaut 5 ou 8 ? | **un cran à 5** — les deux nœuds disent 5, le 8 n'est nulle part dans Figma |
| L'anneau de focus vaut 2 ou 3 ? | **un cran à 2** ; `button/focus-ring-width` retiré dans une passe séparée |
| 1 et 1,5 : deux crans ou un ? | **un seul, à 1** — Add Image et Add Folder redessinés |
| Le rembourrage de champ (10/14 ou 12/16) ? | **Text Area redessinée à 12/16** — le code est déjà juste |
| L'écart au libellé du Toggle (10 ou 8) ? | **Toggle redessiné à 8** — il lira `space/sm`, comme ses deux voisins |
| Trois opacités de désactivé, ou une ? | **une seule** — valeur à confirmer, 0,5 recommandé |
| La hauteur du Select (44 ou 36) ? | **36** — il se compose en `space/2xl + space/xs`, aucun token |

### Les six variables à créer

En quatre modes, tous à la même valeur : aucune de ces six ne varie par appareil.

| Groupe | Variable | Valeur | Ce qu'elle mesure | Ce qu'elle efface |
|---|---|---|---|---|
| `control` | `control/size` | 18 | le côté de la boîte d'un contrôle compact | Radio −2, Checkbox −2 |
| `control` | `control/track-height` | 22 | la hauteur de la piste d'un interrupteur | Toggle +2 |
| `control` | `control/field-gap` | 5 | l'écart vertical entre un libellé, sa boîte et son compteur | Text Area −1, Select +3 |
| `border` | `border/width/default` | 1 | le trait d'un champ, d'une case, d'une pastille | **le Chip invisible sur fond blanc** |
| `border` | `border/width/focus` | 2 | la marque de focus | l'anneau à +1, partout |
| `opacity` | `opacity/disabled` | 50 | l'atténuation d'un objet désactivé | les cinq désactivés non atténués |

⚠️ **L'opacité se stocke en pourcentage — `50`, pas `0,5`.** C'est ce que la liaison de variable
attend côté dessin, exactement comme pour un interligne : une variable à 0,5 vaut un demi pour cent,
et les onze nœuds désactivés deviennent invisibles. Le détour a été payé. `build-tokens.mjs` divise
donc par 100, sur la ligne voisine de celle qui le fait déjà pour `font/line-height`.

**`control/track-width` n'est pas créée** : 40 = `space/xl` + `space/lg`, exactement. Une
composition juste n'est pas une substitution. Même raison pour tout ce qui tombait déjà juste — le
point du Radio, la course de la pastille, le rembourrage d'Add Image, la hauteur d'une vignette.

Reste en suspens : le **voile à 20 %** de la galerie. Ce n'est pas un désactivé, c'est un fond. Soit
il gagne sa propre variable, soit il reste hors du code — les boutons `secondary` tiennent le
contraste sans lui.

### Ce qu'il faut redessiner dans Figma, sans créer aucune variable

1. **Toggle `340:912`** — écart au libellé 10 → 8, lié à `space/sm`, sur les huit variantes.
2. **Text Area `343:273`** — rembourrage de `Box` 10/14 → 12/16, liés aux deux `button/padding-*-sm`.
3. **Add Image `343:315` et Add Folder** — trait 1,5 → 1, huit variantes plus une instance.
4. **Select `340:933`** — focus 3 → 2, en anneau `OUTSIDE` comme les cinq autres.
5. **Lier ce qui est déjà juste** : les 1, les 2 de focus, les sept opacités, et les 18 · 22 · 5.

### Ce que le code fera ensuite

`build-tokens.mjs` est déjà prêt : les trois groupes sont dans `GROUP_TITLES`, et `toCss()` sait
qu'une opacité est un nombre nu. Le script tourne aujourd'hui sans rien changer aux générés.

Une décision dépasse les neuf composants et attend : `global.css` pose `:focus-visible` **pour tout
le site** avec `button/focus-ring-width`. Si seuls les champs passent à 2, une même page montre deux
anneaux d'épaisseurs différentes.
