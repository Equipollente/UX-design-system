# Le brief

Sept lignes. Elles ne décrivent pas le travail — **chacune ferme une vérification que le dev fait
de toute façon**, et la ferme moins cher que s'il devait la faire seul.

C'est tout l'intérêt du gabarit : ce n'est pas une formalité, c'est un transfert de coût. Une ligne
écrite ici en dix secondes économise plusieurs centaines de lignes de lecture en face.

```
OBJET
POUR QUI
FIGMA
AUJOURD'HUI
ATTENDU
NE PAS TOUCHER
FINI QUAND
```

---

## Ce que chaque ligne ferme

| Ligne | La vérification qu'elle ferme | Ce qu'elle évite |
|---|---|---|
| **OBJET** | de quoi parle-t-on, en nom de fichier | la lecture exploratoire du dépôt |
| **POUR QUI** | est-ce qu'on intègre, et sous quelle forme | une variante prématurée, un doublon |
| **FIGMA** | où est la vérité | coder de mémoire, donc faire du code la source |
| **AUJOURD'HUI → ATTENDU** | quel est le delta | le déduire, et se tromper |
| **NE PAS TOUCHER** | qui d'autre en dépend | casser un voisin |
| **FINI QUAND** | à quoi on reconnaît que c'est fait | livrer à côté |

### OBJET

Le nom de code, le nœud Figma, ou les deux : `Button`, `21:47`. Pour un composant pas encore
intégré, son nom Figma suffit — il est déjà dans [LINKS.md](../LINKS.md).

C'est la ligne qui rapporte le plus. Sans elle, la première chose que fait le dev est de traduire
des mots en fichiers, et cette traduction se paie en lectures.

### POUR QUI

**Quelle vue en a besoin, aujourd'hui.** La ligne la plus importante du gabarit, et celle qu'on
n'écrit jamais spontanément.

La règle du dépôt est qu'une variante ne s'intègre que le jour où une vue en a besoin — `Ghost`,
`CTA`, les Tag remplies attendent depuis le début. Sans cette ligne, le dev ne peut pas trancher
entre intégrer et attendre, et par défaut il intègre.

Elle décide aussi de la **forme** de la réponse, ce qui est moins évident. Le dépôt traite un besoin
nouveau d'abord comme un **point de surcharge** — une variable CSS que le composant lit et qu'un
appelant peut poser — et seulement ensuite comme une variante. « La barre de doc a besoin d'un
bouton sans fond » et « il faut la variante Ghost » ne produisent pas le même code.

### FIGMA

Trois réponses, et elles produisent trois plans différents :

| | Ce que fait le dev |
|---|---|
| `fait` | il lit le nœud et code. **Figma Desktop ouvert**, plugin *Desktop Bridge* lancé |
| `pas fait` | il ne code pas : il répond ce qu'il faut dessiner, et attend |
| `le code a raison` | c'est un arbitrage assumé : il écrit l'écart plutôt que de suivre la maquette |

### AUJOURD'HUI → ATTENDU

Le delta, en deux lignes. Ce que tu vois, puis ce que tu veux voir.

`AUJOURD'HUI` se saute (`—`) quand l'objet n'existe pas encore, ou quand l'état actuel se lit sur
`/components`.

`ATTENDU` dit **l'intention, jamais la valeur ni la mise en œuvre.** « Le mouvement doit se voir,
pas claquer » plutôt que « 300 ms `ease-out` » : les tokens de mouvement portent une description
qui dit laquelle prendre selon que la chose entre dans l'écran ou s'y déplace. Écrire une valeur
oblige le dev à vérifier si elle existe, puis à la remplacer — deux étapes pour rien.

**Une seule exception** : une contrainte technique entre si elle porte **sa raison**. « Comparer
`scrollY` entre deux frames plutôt qu'écouter `wheel` — parce qu'un saut en haut de page doit
révéler la barre » est une exigence, pas de l'implémentation : elle décrit un cas que le dev ne
devinerait pas. Sans son « parce que », c'est de la mise en œuvre, et la mise en œuvre lui
appartient.

### NE PAS TOUCHER

Ce qui doit rester tel quel. Dans ce dépôt les composants se tiennent par des variables qui
traversent — `--card-height` descend de `CaseStudyList` vers `CaseStudyCard`, qui la répercute sur
`Carousel`.

Tu remplis ce que tu sais ; `—` sinon. **Le reste est calculé, pas demandé** : le dev cherche qui
importe l'objet et qui lui pose des variables avant d'y toucher.

### FINI QUAND

Des cases à cocher, testables à l'écran, une par ligne. C'est la définition du fini **et** la liste
de vérification.

Deux lignes sont toujours implicites et ne s'écrivent pas : ça se regarde sur `/components` **et**
sur `/templates/home`, au clavier, sous 768px.

---

## Ce qu'on n'écrit pas

Trois familles, et elles font la moitié du volume d'un brief spontané :

- **La doctrine permanente.** Tokens obligatoires, aucune valeur en dur, aucune connaissance d'un
  site consommateur, `prefers-reduced-motion`. C'est [CLAUDE.md](../CLAUDE.md) et
  [conventions.md](conventions.md), ça s'applique sans être rappelé — et le rappeler oblige le dev
  à vérifier ce qui est déjà vrai. `tokens.css` met déjà les durées à `0ms` sous `reduced-motion`.
- **L'implémentation.** `transform` plutôt que `top`, le nom d'une propriété CSS. C'est le seul
  endroit où le dev ajoute quelque chose ; le prescrire empêche mieux.
- **Les valeurs.** Elles vivent dans le nœud Figma et dans les tokens. Les recopier crée une
  troisième source, qui périmera.

**Si un token manque**, le dev ne comble pas le trou : il l'écrit dans
[arbitrages.md](arbitrages.md) et la décision se prend à deux.

---

## Ce que le dev fait en face

Le brief est court **parce que** le reste se calcule. Dans cet ordre, et pas un autre :

1. `git status` — l'arbre est-il propre, et les fichiers modifiés touchent-ils l'objet du brief ?
2. `OBJET` → fichier, via [LINKS.md](../LINKS.md).
3. Est-ce que tout atterrit dans ce dépôt ?
4. `FIGMA` → lire le nœud, attendre, ou acter l'écart.
5. **La section de doc de l'objet**, pas son fichier — soixante lignes qui disent ce qu'il est, ses
   props, ses tokens, ses écarts.
6. `grep` de l'objet dans `src/` — qui l'importe, qui lui pose des variables.
7. Puis seulement : le composant, le groupe de tokens concerné, le voisin désigné.
8. Trois questions — est-ce que ça existe déjà, est-ce que ça force une valeur en dur, est-ce que ça
   contredit ce que l'objet **est** ?
9. Le plan.

Les huit premières étapes sont bon marché et peuvent toutes réorienter le travail. C'est pour ça
qu'elles passent avant la moindre lecture longue.

---

## Deux exemples

Une demande complète :

```
OBJET            Button (21:47)
POUR QUI         la barre de doc — aujourd'hui c'est un lien stylé à la main
FIGMA            fait, Ghost est dessinée avec ses quatre états
AUJOURD'HUI      deux variantes, primaire et secondaire, toutes deux avec un fond
ATTENDU          un bouton qui n'a que son libellé et son icône, et qui réagit
                 au survol comme les autres
NE PAS TOUCHER   le primaire et le secondaire, ni leurs quatre états
FINI QUAND       ☐ la barre de doc l'utilise à la place de son lien
                 ☐ les quatre états répondent
                 ☐ le contraste tient au survol comme au repos
```

Ce brief suffit pour que le dev voie que la réponse n'est peut-être pas la variante Ghost mais un
`--btn-bg: transparent` posé par la barre — et qu'il le propose **avant** de coder.

Une retouche, où deux lignes se sautent :

```
OBJET            Tag (19:12)
POUR QUI         les tags d'étude de cas se touchent sur mobile
FIGMA            le code a raison — la maquette pose un écart sous le seuil
AUJOURD'HUI      —
ATTENDU          un écart qui respecte la distance minimale entre deux cibles
NE PAS TOUCHER   —
FINI QUAND       ☐ l'écart tient sous 768px sans casser la ligne
```

---

## Quand le dev s'arrête au lieu d'exécuter

- **`ATTENDU` contredit ce que l'objet est** — son pavé de tête. Ce n'est plus une modification mais
  une redéfinition, et elle se décide avant d'écrire.
- **`FIGMA: fait` mais le bridge ne répond pas.** Coder de mémoire ferait du code la source.
