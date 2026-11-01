# Du dessin au composant : qui fait quoi

Le fil entier, d'un besoin de vue à un composant Astro publié — avec les deux métiers côte à côte.
Les autres procédures disent *comment* chaque morceau se fait ; celle-ci dit **dans quel ordre, par
qui, et à quel moment on se passe le relais**. Elle ne répète aucune d'elles : elle y renvoie.

Une seule personne peut porter les deux rôles, ou le rôle dev peut être tenu par l'agent. Le
workflow ne change pas — c'est ce qui le rend utile : chaque relais est un document, pas une
conversation.

## Le principe

```
 BESOIN ─► DESSIN ─► BRIEF ─► CADRAGE ─► CODE ─► REGARD ─► FERMETURE ─► RETOUR FIGMA
 designer  designer  designer   dev       dev    designer     dev         designer
                       ▲                            │
                       └──── écart signalé ◄────────┘
```

- **Figma est la vérité** de ce que l'objet est : forme, états, variables, description.
- **Le brief est le relais** : sept lignes, [brief.md](brief.md).
- **Le code est une traduction**, jamais une source. Quand il ne peut pas suivre, il écrit l'écart
  (`<p class="flag">`) au lieu de corriger en dur.
- **Les deux relais qui reviennent au designer** — le regard, puis le retour Figma — sont ceux qu'on
  oublie. Sans eux, la boucle ne se ferme pas et l'écart devient dette.

---

## 1. Besoin — designer

Une vue a besoin de cet objet **aujourd'hui**. Pas « un jour », pas « ce serait cohérent ». Si la
réponse est non, le composant reste dessiné dans Figma et non intégré
([LINKS.md](../LINKS.md), liste des non-intégrés) ; c'est une position légitime.

Avant de dessiner, une question : un composant existant fait-il déjà 80 % de ça ? Si oui, le besoin
est une **modification** ([modifier-un-composant.md](modifier-un-composant.md)) ou un point de
surcharge, pas un nouvel objet.

## 2. Dessin — designer, dans Figma

Le composant se dessine pour que le code n'ait rien à deviner. Cinq gestes :

1. **Variables, jamais de valeur** : chaque couleur, espacement, rayon, mouvement est lié à une
   variable *de rôle*. Une liaison directe à une rampe est un défaut
   ([architecture-couleurs.md](architecture-couleurs.md)).
2. **Variantes et états réels seulement** : ceux qu'une vue utilise. Une variante dessinée « pour
   plus tard » se signale comme telle dans la description plutôt que de s'ajouter en silence.
3. **Les trois largeurs** : l'objet est regardé sous chaque mode de la collection, pas seulement en
   Desktop. Un objet qui n'a pas été vu en Mobile n'est pas dessiné.
4. **Une description qui dit ce que l'objet est et n'est pas** — avec l'objet à employer à la place.
   Elle devient le pavé de tête du `.astro` ([conventions.md](conventions.md), § 1) : une
   description fausse produit un pavé faux.
5. **Un contenu de vraie longueur** dans le dessin : des mots réels, pas « Titre ». Le code les
   reprendra mot pour mot ([ajouter-un-composant.md](ajouter-un-composant.md), § 5).

Si une valeur n'a pas de variable, ne pas la dessiner en dur « pour avancer » : créer la variable
([ajouter-une-icone-ou-un-token.md](ajouter-une-icone-ou-un-token.md)), puis exporter. L'export
reste un geste du designer.

**Porte de sortie** : le nœud est relevé, sa description est lue à voix haute et ne ment pas, et
aucune liaison n'est restée en rampe ou en dur.

## 3. Brief — designer

Un brief, au gabarit de [brief.md](brief.md). Deux lignes décident de tout et se remplissent avec
soin : **POUR QUI** (la vue, aujourd'hui) et **ATTENDU** (l'intention, jamais la valeur).

`FIGMA` prend une des trois réponses — `fait`, `pas fait`, `le code a raison` — et c'est elle qui
dit au dev s'il code, s'il attend, ou s'il acte un écart.

**Porte de sortie** : le dev peut répondre « c'est clair » sans poser une seule question de
vocabulaire.

## 4. Cadrage — dev

Avant d'écrire une ligne, dans l'ordre de [brief.md](brief.md) (« Ce que le dev fait en face ») : l'arbre,
l'objet, le périmètre, la source — les vérifications bon marché d'abord, puis la section de doc de
l'objet *avant* son fichier. Le détail pour l'agent est dans
[workflow-agent-composant-astro.md](workflow-agent-composant-astro.md).

Le cadrage **rend un plan, pas du code**. Le plan dit en quelques lignes :

- réutiliser, modifier, point de surcharge, ou nouvel objet — et pourquoi ;
- les props pressenties, **tirées de ce que Figma montre** et non de ce qui serait pratique ;
- ce qui, dans le dessin, ne tombera pas juste (valeur sans variable, état non dessiné, description
  périmée).

**Le plan retourne au designer** quand il contient un arbitrage de dessin : deux intentions qui
s'excluent se posent en choix chiffrés, elles ne se tranchent pas dans le code. Sinon, le dev
enchaîne.

**Le dev s'arrête** si `ATTENDU` contredit ce que l'objet est, si le bridge Figma ne répond pas alors
que `FIGMA: fait`, ou si une valeur n'a pas de variable. Il ne comble pas : il écrit dans
[arbitrages.md](arbitrages.md).

## 5. Code — dev

Dans l'ordre de [ajouter-un-composant.md](ajouter-un-composant.md), étapes 2 à 5 :

1. le **pavé doctrinal** d'abord, depuis la description Figma ;
2. l'**`interface Props`** avant le HTML ;
3. le template — balise native, `<slot />` par défaut, slot nommé seulement pour une zone distincte ;
4. des styles scopés, 100 % `var(--*)`, et la valeur Figma comme repli d'un point de surcharge ;
5. pas de script, sauf échec mesuré ([conventions.md](conventions.md), § 8).

Le code ne connaît aucun site : liens, textes, images tombent des props
([CLAUDE.md](../CLAUDE.md)). Si le comportement exige du JavaScript composé,
[creer-un-composant-avec-data-slot.md](creer-un-composant-avec-data-slot.md).

**Première validation, tout de suite** : `npm run check`. Elle est la moins chère et la plus apte à
contredire le plan.

## 6. Regard — designer, devant le vrai rendu

C'est le relais le plus souvent sauté, et le seul qui attrape les défauts que ni le typage ni le
build ne voient.

Le dev montre l'objet sur `/components` (le vrai composant, jamais une copie de son markup). Le
designer le regarde **à côté du nœud Figma**, et vérifie :

- chaque état dessiné répond, au clavier d'abord ;
- les trois largeurs ;
- le contenu long, la prop absente, le slot vide ;
- que ce qui se voit est l'intention de `ATTENDU`, pas seulement une conformité de pixels.

Chaque différence est classée par la boucle ci-dessous. Rien ne se corrige « parce que ça se voit
mieux » sans passer par elle.

### La boucle des écarts

| La différence est… | On fait | Qui |
|---|---|---|
| un défaut du code (le dessin est juste) | le code se corrige | dev |
| un défaut du dessin (le code suit une maquette fausse) | Figma se corrige, puis l'export | designer |
| une valeur sans variable | la variable se crée dans Figma, puis export, puis le code la lit | designer, puis dev |
| deux intentions qui s'excluent | un choix chiffré posé au designer, qui tranche | designer |
| un écart assumé (le code a raison) | `<p class="flag">` dans la doc ; ligne dans `arbitrages.md` **seulement si un geste Figma suit** | dev |

## 7. Fermeture — dev

Dans l'ordre de [ajouter-un-composant.md](ajouter-un-composant.md), étapes 4 à 10 : la ligne de
[LINKS.md](../LINKS.md), les données de démonstration, la section de doc au pattern à sept blocs,
les écarts, les comptes d'`index.astro` et du `README.md`, puis `npm run check`,
`npm run build && npm run preview` si une URL est en jeu, et le commit au style du dépôt.

Le compte rendu final dit : ce qui a été fait, les écarts restants avec leur nœud, **les
vérifications exécutées et celles qui ne l'ont pas été**.

## 8. Retour Figma — designer

Le dernier relais, qui évite que la maquette et le code divergent en silence :

- chaque ligne d'[arbitrages.md](arbitrages.md) ouverte par ce composant est traitée dans Figma, puis
  retirée ;
- la description du composant est mise à jour si le dev a signalé qu'elle était périmée ;
- les variables nées en cours de route sont exportées (`npm run tokens`) et vérifiées.

Le composant est **fini** quand `arbitrages.md` ne retient plus rien à son sujet — pas quand le code
est mergé.

---

## Les deux listes, côte à côte

**Le designer remet** : un nœud dont la description ne ment pas · aucune liaison en rampe ou en
dur · les trois largeurs vues · un contenu réel · un brief aux sept lignes.

**Le dev remet** : un plan avant le code · un composant qui ouvre par son pavé · une doc qui montre
le vrai rendu · des écarts écrits, pas corrigés en dur · des vérifications dites, y compris celles
qui manquent.

## Quand les deux métiers sont une seule personne

Garder les relais, ne pas les fondre. Le cadrage (§ 4) et le regard (§ 6) sont les deux endroits où
un second point de vue attrape quelque chose ; si on les saute parce que « je sais ce que j'ai
voulu », c'est précisément là que le dessin et le code se mettent à diverger.
