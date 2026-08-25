# Le brief

Quatre lignes. Judith les remplit, l'agent exécute sans poser de question.

```
COMPOSANT   
JE VEUX     
FIGMA       
GARDE-FOU   
```

## Ce que chaque ligne doit dire

**COMPOSANT** — son nom de code ou son nœud (`Button`, `21:47`, ou les deux). Si c'est un composant
qui n'existe pas encore, son nom dans Figma suffit.

**JE VEUX** — l'intention, pas la valeur. « Le bouton doit pouvoir être fantôme » plutôt que
« mets `background: transparent` ». La valeur, elle, se lit dans le nœud — c'est le travail de
l'agent d'aller la chercher.

**FIGMA** — la ligne qui décide de tout le reste. Trois réponses possibles :

| Réponse | Ce que fait l'agent |
|---|---|
| `fait` | il lit le nœud et code. **Figma Desktop ouvert**, plugin *Figma Desktop Bridge* lancé |
| `pas fait` | il ne code pas : il répond ce qu'il faut dessiner, et attend |
| `le code a raison` | c'est un arbitrage : il écrit l'écart plutôt que de suivre la maquette |

**GARDE-FOU** — ce qui ne doit pas bouger. Facultatif, mais c'est ce qui empêche un brief de
déborder. `—` si rien.

---

## Trois exemples

Une valeur qui change — l'agent ne touche à aucun composant :

```
COMPOSANT   les tokens de couleur
JE VEUX     l'accent plus sombre, il ne passe pas sur la brume lavande
FIGMA       fait, les 4 modes sont ré-exportés dans tokens/
GARDE-FOU   —
```

Un comportement qui change :

```
COMPOSANT   Button (21:47)
JE VEUX     la variante fantôme, pour la barre de doc
FIGMA       fait, Ghost est dessinée avec ses 4 états
GARDE-FOU   ne pas toucher au primaire ni au secondaire
```

Un désaccord assumé :

```
COMPOSANT   Carousel (88:85)
JE VEUX     que la vignette cède sur les petites fenêtres
FIGMA       le code a raison — la maquette la fige à 382, je ne change pas le fichier
GARDE-FOU   l'image maigrit, elle ne se rogne jamais
```

---

## Ce que l'agent fait ensuite, sans qu'on le lui demande

Il suit [ajouter-un-composant.md](ajouter-un-composant.md) ou
[modifier-un-composant.md](modifier-un-composant.md) selon le cas — donc il répercute la table de
props, le pavé de tête, `LINKS.md`, le compte du sommaire, les `.flag`, et il vérifie avant de
commiter.

**Il rend la main à une seule condition** : que le résultat soit regardé à l'écran, sur
`/components` **et** sur `/templates/home`. Un composant se montre sur la première et vit sur la
seconde ; une régression se voit là, pas dans le fichier.

## Quand le brief ne suffit pas

Deux cas où l'agent doit s'arrêter et demander, plutôt qu'exécuter :

- **`JE VEUX` contredit le pavé de tête du composant** — ce qu'il est, ce qu'il n'est pas. Ce n'est
  alors plus une modification mais une redéfinition, et elle se décide avant d'écrire.
- **`FIGMA: fait` mais le bridge ne répond pas.** Coder de mémoire ferait du code la source. Il le
  dit et attend.
