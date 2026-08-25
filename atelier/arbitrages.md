# Écarts en attente d'arbitrage

Ce que le code signale et que **Figma** doit trancher. C'est la liste de travail côté fichier, la
seule chose de ce dossier qui serve au design plutôt qu'au développement.

> **La description de chaque écart vit dans son `<p class="flag">`, pas ici.** Ce tableau dit
> seulement qu'il existe, où il est écrit en toutes lettres, et s'il est réglé. L'étiquette fait
> quelques mots ; si elle en demande plus, c'est le `.flag` qu'il faut relire.

N'entrent ici que les écarts qui appellent un geste **dans Figma**. Le dépôt porte 31 `.flag`, de
trois familles, et une seule entre :

| Famille | Exemple | Sort |
|---|---|---|
| Appelle un geste dans Figma | une mesure à reprendre, une description périmée, une couleur non liée, un token manquant | **entre ici** |
| Énonce une politique | « Figma déclare des variantes que le code n'a pas » | reste dans son `.flag` |
| Explique une décision du code | « le mobile n'est pas dessiné », « le premier écran est une couche » | reste dans son `.flag` |

---

## À reprendre dans le fichier

| Objet | Nœud | L'écart | Écrit dans | État |
|---|---|---|---|---|
| Button | `21:47` | `height`, `padding-y` et `icon-size` ne s'accordent pas | /components → Button | ouvert |
| Nav | `24:5` | la description décrit encore l'ancienne barre | /components → Nav | ouvert |
| Case Study Card | `88:131` ↔ `176:1248` | les deux ombres divergent, à réaligner | /components → Case Study Card | ouvert |
| Case Study Card | `176:1248` | trois coquilles : « deployements », « langages », « Raoadmap » | /components → Case Study Card | ouvert |
| Section Header | `88:74` | l'eyebrow en Inter semibold contredit le `h6` du système | /components → Case Study Card | ouvert |
| Carousel | `88:85` | la vignette est figée à 382 px ; le code la laisse céder | /components → Case Study List | ouvert |
| Section.Intro | `209:2348` | trois couleurs tapées à la main, non liées | /components → Intro | ouvert |
| Section.Intro | `142:1354` | la variante mobile ne descend pas au plancher déclaré (320) | /components → Intro | ouvert |
| Style `heading/display` | — | la description annonce « tight », les valeurs disent 1.23 et 0 | /components → Intro | ouvert |
| Page HP | `222:1168` | bloc nav + intro à 668 là où le liseré en demande 784 | /components → Case Study List | ouvert |
| Page HP | `222:1168` | cartes à 814 et 776 là où le comportement en demande 834 | /components → Case Study List | ouvert |
| Page Icons | `45:395` | le nommage mélange quatre conventions pour onze objets | /icons → Icon | ouvert |
| Icônes | `45:395` | `file-text`, `box-plus`, `mail-edit` s'exportent en aplat | /icons → Icon | ouvert |

## Tokens qui manquent dans la collection

Chacun oblige aujourd'hui une valeur à vivre en dur, hissée en variable locale. Le jour où Figma la
nomme, le composant n'a qu'une ligne à changer.

| Ce qui manque | Ce qui le remplace en attendant | Écrit dans | État |
|---|---|---|---|
| `icon.size.*` | emprunt à `button.icon-size.*` | /icons → Icon | ouvert |
| les ombres `shadow/lg` et `shadow/lg-invert` | `--card-shadow`, `--carousel-item-shadow` | /components → Case Study Card | ouvert |
| une mesure de texte | `--intro-measure`, `--header-title-min` | /components → Intro | ouvert |
| un cran à 50 pour le liseré | `--fold-peek` — le cran voisin ne tombe pas juste | /components → Case Study List | ouvert |
| un cran à 33 et un à 10 | `--space-2xl` et `--space-md`, les crans voisins | /components → Case Study Card | ouvert |

## Nommage

| Figma | Code | Pourquoi | État |
|---|---|---|---|
| `Section Header` | `CaseStudyHeader` | tout ce qu'il contient est propre à une étude de cas | ouvert |
| `Section.Intro` | `Intro` | `Section.` est une convention de rangement du fichier | assumé |

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
