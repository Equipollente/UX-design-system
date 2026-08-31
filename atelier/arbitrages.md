# Écarts en attente d'arbitrage

Ce que le code signale et que **Figma** doit trancher. C'est la liste de travail côté fichier, la
seule chose de ce dossier qui serve au design plutôt qu'au développement.

> **La description de chaque écart vit dans son `<p class="flag">`, pas ici.** Ce tableau dit
> seulement qu'il existe, où il est écrit en toutes lettres, et s'il est réglé. L'étiquette fait
> quelques mots ; si elle en demande plus, c'est le `.flag` qu'il faut relire.

N'entrent ici que les écarts qui appellent un geste **dans Figma**. Les `.flag` du dépôt sont de
trois familles, et une seule entre :

| Famille | Exemple | Sort |
|---|---|---|
| Appelle un geste dans Figma | une mesure à reprendre, une description périmée, une couleur non liée, un token manquant | **entre ici** |
| Énonce une politique | « Figma déclare des variantes que le code n'a pas » | reste dans son `.flag` |
| Explique une décision du code | « le premier écran est une couche », « le carrousel n'accepte que des images » | reste dans son `.flag` |

**Une famille n'est pas un sort définitif.** « Le mobile n'est pas dessiné » a longtemps expliqué une
décision du code, et vient de passer dans le tableau ci-dessous. Le jour où la mesure montre que le
code ne peut plus trancher seul, l'absence de dessin cesse d'être un choix assumé et devient un
manque. C'est le seul chemin d'une famille à l'autre, et il se fait dans ce sens.

Cet écart-là s'est d'ailleurs déplacé deux fois en un jour, ce qui est la meilleure défense de la
méthode : la mesure a d'abord montré un en-tête à 55 % de l'écran, donc un empilement mobile
intenable ; puis la maquette a effacé les tags, l'en-tête est retombé à 35 %, et la carte tient. Ce
qui manque n'est plus une composition d'en-tête mais **l'état empilé lui-même**.

---

## À reprendre dans le fichier

| Objet | Nœud | L'écart | Écrit dans | État |
|---|---|---|---|---|
| Button | `21:47` | `height`, `padding-y` et `icon-size` ne s'accordent pas | /components → Button | ouvert |
| Tag | `19:12` | la variante `Lime` porte un nom de couleur ; sa rampe s'appelle `highlight` | /components → Tag | ouvert |
| Nav | `24:5` | la description décrit encore l'ancienne barre | /components → Nav | ouvert |
| Cards | `334:1129` | le composant n'a aucune description : la doctrine n'engage que le code | /components → Card | ouvert |
| Cards | `334:1129` | le fond blanc n'est lié à aucune variable | /components → Card | ouvert |
| Cards | `392:1075` · `392:1076` | la rangée de tags du haut est un frame « Frame 6 », pas un slot, et n'a pas de nom | /components → Card | ouvert |
| Cards | `334:1129` | les deux rangées de tags portent le même contenu témoin : rien ne dit ce qui va en haut plutôt qu'en bas | /components → Card | ouvert |
| Cards | `334:1130` | l'image de l'horizontale est en hauteur fixe ; le code l'étire — la passer en *fill* | /components → Card | ouvert |
| **Système** | — | **aucune famille de mesures pour la géométrie d'un contrôle** — 18, 22, 5 | /formulaire | *réglé — 27/08, groupe `control`* |
| **Système** | — | **aucune famille d'épaisseurs de trait** (1 · 1,5 · 2) | /formulaire | *réglé — 27/08, groupe `border`* |
| **Système** | — | **aucune échelle d'opacité** (0,4 · 0,5 · 0,6) | /formulaire | *réglé — 27/08, groupe `opacity`* |
| **Chip** | `351:273` | **son trait ne vaut que 1,28:1 sur le blanc** — WCAG 1.4.11 en demande 3 ; c'est une couleur à foncer, pas une épaisseur | /formulaire → Chip | ouvert |
| Select | `340:933` | pas de trait au repos, quand Text Area en a un de 1 — deux champs voisins dessinés différemment | /formulaire → Select | ouvert |
| Button | `21:47` | **aucun état Focused dessiné**, et aucun trait dans tout le composant ; `button/focus-ring-width` ne décrit donc rien | — | ouvert |
| Button | `21:41` · `334:1246` · `334:1296` | le secondaire désactivé n'a aucun fond, quand le code garde le sien à 45 % | — | ouvert |
| Radio | `340:879` | libellé à 14 px / 120 %, quand FieldLabel est à 15 / 112 | /formulaire → Radio | ouvert |
| Checkbox | `340:842` | même écart de libellé, et encre désactivée en `neutral/400` | /formulaire → Checkbox | ouvert |
| Select | `340:933` | **le nœud existait, et le code a été écrit sans lui** — « spécifié en conversation » | /formulaire → Select | ouvert |
| Select | `340:933` | boîte de 36 de haut, quand le code prend les 44 du bouton pour la cible tactile | /formulaire → Select | ouvert |
| Select | `340:933` | chevron de 20, quand le code prend les 24 de `button/icon-size/md` | /formulaire → Select | ouvert |
| Text Area · Select | `343:273` · `340:933` | l'écart libellé ↔ champ | /formulaire → Text Area | *réglé — 27/08, `control/field-gap` = 5* |
| Text Area | `343:273` | casse `TITLE` sur le libellé : elle capitalise le texte de l'appelant | /formulaire → Text Area | ouvert |
| Text Area | `343:273` | le libellé passe en `muted` au survol et au focus — FieldLabel n'a que deux états | /formulaire → Text Area | ouvert |
| Chip | `351:273` | Figma ne distingue pas le choix multiple du choix unique | /formulaire → Chip | ouvert |
| Add Image | `343:315` | la couleur de l'icône est liée à une variable d'une **autre bibliothèque** | /formulaire → Add Image | ouvert |
| Edit Image Gallery | `355:1396` | vignette de 189 × 140 : 140 se compose, 189 non — mais c'est un minimum que la grille étire, donc pas une mesure | /formulaire → Edit Image Gallery | *assumé* |
| Edit Image Gallery | `355:1396` | son « supprimer » est un `secondary` : la variante `Alert` est dessinée dans les trois tailles et n'a aucun emploi | /components → Button | ouvert |
| Case Study Card | `88:131` ↔ `176:1248` | les deux ombres divergent, à réaligner | /components → Case Study Card | ouvert |
| Case Study Card | `176:1248` | trois coquilles : « deployements », « langages », « Raoadmap » | /components → Case Study Card | ouvert |
| Section Header | `88:74` | l'eyebrow en Inter semibold contredit le `h6` du système | /components → Case Study Card | ouvert |
| Carousel | `88:85` | la vignette est figée à 382 px ; le code la laisse céder | /components → Case Study List | ouvert |
| Section.Intro | `209:2348` | trois couleurs tapées à la main, non liées | /components → Intro | ouvert |
| Section.Intro | `142:1354` | la variante mobile ne descend pas au plancher déclaré (320) | /components → Intro | ouvert |
| Style `heading/display` | — | la description annonce « tight », les valeurs disent 1.23 et 0 | /components → Intro | ouvert |
| Page HP | `222:1168` | bloc nav + intro à 668 là où le liseré en demande 744 | /components → Case Study List | ouvert |
| Page HP | `222:1168` | cartes à 814 et 776 là où le comportement en demande 834 | /components → Case Study List | ouvert |
| Case Study List | `222:814` | l'état empilé n'est pas dessiné en mobile, alors que la carte y tiendrait | /components → Case Study List | ouvert |
| Page Icons | `45:395` | le nommage mélange quatre conventions pour onze objets | /icons → Icon | ouvert |
| Icônes | `45:395` | `file-text`, `box-plus`, `mail-edit` s'exportent en aplat | /icons → Icon | ouvert |

## Le reliquat à retirer

| Ce qui reste | Pourquoi il reste | État |
|---|---|---|
| `button/focus-ring-width` = 3 | Plus personne ne le lit : `global.css` et les neuf composants sont passés à `border/width/focus`. Il n'a pas été touché — le brief l'interdisait — mais il ne décrit plus rien, et le Button n'a pas d'état Focused pour le justifier. À supprimer dans Figma, seul, quand tu voudras. | ouvert |

## Tokens qui manquent dans la collection

Chacun oblige aujourd'hui une valeur à vivre en dur, hissée en variable locale. Le jour où Figma la
nomme, le composant n'a qu'une ligne à changer.

| Ce qui manque | Ce qui le remplace en attendant | Écrit dans | État |
|---|---|---|---|
| `icon.size.*` | emprunt à `button.icon-size.*` | /icons → Icon | ouvert |
| les ombres `shadow/md`, `shadow/lg` et `shadow/lg-invert` | — | /components → Card et Case Study Card | *réglé — 27/08, groupe `shadow` (16 variables)* |
| une hauteur de média | `--card-media-height` — 324 et 256, sans token | /components → Card | ouvert |
| une mesure de texte | `--intro-measure`, `--header-title-min` | /components → Intro | ouvert |
| un cran à 90 pour le liseré | `--fold-peek` — `space.layout.96` est à 6 px, et l'écart déplacerait le liseré à chaque cran | /components → Case Study List | ouvert |
| un cran à 33 et un à 10 | `--space-2xl` et `--space-md`, les crans voisins | /components → Case Study Card | ouvert |
| un écart à 10 entre le texte et les boutons d'une modale | `--modal-gap` — ni `space.sm` (8) ni `space.md` (12) ne tombe juste | /components → Modal | ouvert |
| un fond pour le `::backdrop` d'une modale | `--modal-scrim` — `rgb(0 0 0 / 0.5)`, aucune variable `overlay`/`scrim` dans la collection | /components → Modal | ouvert |

## Nommage

| Figma | Code | Pourquoi | État |
|---|---|---|---|
| `Section Header` | `CaseStudyHeader` | tout ce qu'il contient est propre à une étude de cas | ouvert |
| `Section.Intro` | `Intro` | `Section.` est une convention de rangement du fichier | assumé |
| `Cards ` | `Card` | un pluriel avec une espace finale nomme un tiroir, pas un objet | ouvert |
| `Property 1` | `orientation` | le nom de la propriété de variante ne dit pas ce qu'elle commande | ouvert |
| `Modals` | `Modal` | un pluriel nomme un tiroir, pas un objet | ouvert |
| `Property 1` (sur `420:1223`) | `variant` | trois valeurs (`validation`/`alert`/`succes`), pas quatre : `Layout` est le gabarit générique de la maquette, jamais un contenu réel | assumé |

---

## Quand une ligne est tranchée

Elle passe en *réglé — date, hash*, reste un mois, puis s'en va. Le `<p class="flag">` correspondant
disparaît **dans le même commit** que le ré-export : un écart réglé qui reste affiché est un
mensonge à l'écran.

## Pourquoi ce fichier n'est pas généré

La tentation est cohérente avec le dépôt — un script qui lirait les `.flag` et en ferait la liste.
Mais les `.flag` n'ont ni identifiant, ni état, ni marque de famille : rien dans le markup ne dit
si un écart attend Figma ou énonce une politique. Générer exigerait d'ajouter des attributs machine
à la doc **publiée**, au bénéfice d'un fichier d'arrière-boutique — ce qui inverse la priorité.

La ligne écrite à la main coûte moins cher. On y reviendra si le registre dépasse une trentaine de
lignes, ou si un écart est oublié deux fois.
