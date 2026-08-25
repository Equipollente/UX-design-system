# Ajouter un composant

De « ce nœud existe dans Figma » au commit sur `main`. Rien ici n'est une valeur ni un nom de
prop : ce fichier décrit un ordre d'opérations. Ce que fait chaque objet est écrit dans l'objet.

Lire [conventions.md](conventions.md) d'abord : ce qui suit ne redit pas comment on écrit un
composant, seulement dans quel ordre on s'y prend et ce qu'on oublie.

---

## 0. Deux conditions d'entrée

Elles ne se contournent pas.

**Le composant existe dans Figma**, son nœud est relevé et sa description est lue. S'il n'existe
pas, le geste n'est pas « ajouter un composant » mais « dessiner un composant », et ça se passe
dans Figma. Le nœud s'écrit `88:131` côté API ; l'URL, elle, affiche `88-131`.

**Une vue en a besoin aujourd'hui.** La liste des composants Figma non intégrés est en bas de la
section Composants de [LINKS.md](../LINKS.md), et elle a le droit de rester longue. On n'intègre
pas par anticipation — c'est la même politique que les variantes.

## 1. Lire la description Figma avant de coder

C'est de là que sortent le « ce qu'il est » et le « ce qu'il n'est pas ». Si elle est fausse ou
périmée, **ne pas la corriger dans le code** : c'est un écart, il se signale à l'étape 7. Le cas
s'est déjà produit — la description du Nav (`24:5`) décrit encore une barre qui n'existe plus.

## 2. Nommer

Le nom du code n'est pas forcément celui de Figma. Deux précédents : `Section Header` est devenu
`CaseStudyHeader` parce que tout ce qu'il contient est propre à une étude de cas, et `Section.Intro`
est devenu `Intro` parce que le préfixe est une convention de rangement du fichier Figma.

Quand les deux noms divergent, la divergence s'écrit — sous le tableau de [LINKS.md](../LINKS.md),
et dans [arbitrages.md](arbitrages.md). Elle ne se règle pas en silence.

## 3. Écrire le composant

`src/design-system/components/<Nom>.astro`, en suivant [conventions.md](conventions.md) : le pavé
doctrinal, l'`interface Props`, les styles scopés sans une valeur en dur, l'a11y argumentée avec
son numéro, et pas de script sauf nécessité mesurée.

Le modèle le plus complet à relire est
[CaseStudyList.astro](../src/design-system/components/CaseStudyList.astro) ; le plus court,
[Tag.astro](../src/design-system/components/Tag.astro).

## 4. Le registre Figma

Une ligne dans le tableau Composants de [LINKS.md](../LINKS.md) — nom, nœud, chemin du fichier —
et le composant **retiré** de la liste des non-intégrés. Avec la note de nommage s'il y a lieu.

## 5. Les données de démonstration

Dans [_demo.ts](../src/pages/_demo.ts) si le composant en a besoin, jamais dans le frontmatter
d'une page : la doc et le gabarit doivent lire la même chose, sinon ils divergeront au premier mot
corrigé. Le fichier vit dans `src/pages/` et non dans le système, parce que ce sont les mots d'un
site — exactement ce que le dépôt interdit de faire descendre dans `src/design-system/`.

Le contenu vient **mot pour mot de Figma**, et le commentaire cite le nœud d'où il tombe.

Deux interdits, chacun payé une fois :

- **Ne jamais inventer de contenu au nom d'une entreprise réelle.** Ces pages sont publiées, et
  rien à l'écran ne distingue un remplissage d'un vrai contenu — un commentaire dans le fichier ne
  suffit pas. Un remplissage répète un contenu existant.
- **Pas de libellés fabriqués** type « Item 1 » : un composant se juge sur des mots de vraie
  longueur.

## 6. La section de doc

Dans [components.astro](../src/pages/components.astro). L'import en haut, le tableau
`const <nom>Props = [...]` recopié de l'`interface Props` dans le frontmatter, puis la section
précédée de son séparateur `<!-- ── Nom ─── -->`, dans l'ordre des autres :

1. `<h2>` le nom du composant.
2. `<p class="section-note">` — **Ce qu'il est.** / **Ce qu'il n'est pas.** puis
   `<span class="source">` avec le nœud Figma. C'est le pavé du composant, remis en phrases pour un
   lecteur.
3. `<div class="demo">` avec le **vrai composant rendu**, jamais une copie de son markup — c'est
   toute la raison d'être de cette page : si le composant change, la page change. Si le cadre
   demande un réglage, il va dans le `<style>` de la page, en `.demo-<objet>`, avec son pourquoi.
4. Les `<h3>` propres à l'objet — ses états, ses comportements, ce qu'il fait quand une prop manque.
5. `<h3>Props` et le tableau Prop / Type / Défaut / Rôle.
6. `<h3>Tokens` si et seulement si des tokens décrivent **cet objet** et pas le système. Ils se
   lisent alors depuis `data/tokens.json`, jamais à la main.
7. `<h3>Ce que la maquette ne dit pas` et les `<p class="flag">`.

Vérifier ensuite que la démo n'hérite de rien qui ne soit pas à elle : la doc ne style que
`main > section`, précisément parce qu'un sélecteur nu atteignait les `<section>` que rendent les
composants montrés.

## 7. Les écarts

Tout désaccord entre la maquette et le code se **signale**, il ne se corrige pas en dur : une mesure
qui ne tombe pas juste, une valeur sans token, une description périmée, une variante déclarée et non
implémentée, une coquille dans le texte de la maquette.

Il s'écrit en `<p class="flag">` dans la section, en clair, avec le raisonnement et l'arbitrage
retenu. Puis, **si et seulement s'il appelle un geste dans Figma**, il gagne une ligne dans
[arbitrages.md](arbitrages.md) — une étiquette, pas une copie du texte.

## 8. Ce qui suit ailleurs, et qu'on oublie

C'est l'étape qui fait perdre le plus de temps quand elle est sautée.

- [index.astro](../src/pages/index.astro) — le sommaire annonce un **nombre** de composants, dans
  son chapeau et dans ses cartes. Il a déjà été faux.
- [README.md](../README.md) — la liste des composants, dans le tableau et dans l'arborescence.
- [DocsLayout.astro](../src/design-system/layouts/DocsLayout.astro) — seulement si l'objet vient
  avec une page à lui.

## 9. Vérifier

- `npm run check` — lui seul type les `.astro`. `npm run build` ne type rien : c'est `check` qui
  refuse un nom d'icône inconnu ou une prop qui n'existe pas.
- `npm run dev` et **regarder**. Au clavier d'abord, en tabulant jusqu'au bout de la démo ; puis
  sous 768px ; puis sur une fenêtre courte si l'objet a une hauteur.
- `npm run build && npm run preview` dès qu'une URL ou un asset est en jeu. Le préfixe `base` ne
  s'observe pas autrement, et un chemin absolu oublié marche en local et donne un 404 en ligne.

## 10. Commiter

Au style du dépôt — voir [conventions.md](conventions.md), § 11. Et si un arbitrage structurant a
été pris, une entrée dans [decisions.md](decisions.md).

---

## Liste de contrôle

- [ ] Le nœud Figma est relevé, la description est lue
- [ ] Une vue en a besoin aujourd'hui
- [ ] Le `.astro` ouvre par son pavé — est / n'est pas / nœud
- [ ] Aucune valeur en dur dans les styles
- [ ] Aucune connaissance d'un site : tout tombe des props
- [ ] `LINKS.md` : ligne ajoutée, entrée retirée des non-intégrés
- [ ] `_demo.ts` si besoin — pas d'entreprise réelle, pas de libellé fabriqué
- [ ] La section de doc, au pattern à 7 blocs, avec le vrai composant rendu
- [ ] Les écarts en `.flag`, et dans `arbitrages.md` s'ils appellent Figma
- [ ] Le compte de composants d'`index.astro` et la liste du `README.md`
- [ ] `npm run check`, puis regarder — clavier, 768px, fenêtre courte
- [ ] `npm run build && npm run preview` si une URL est en jeu
- [ ] Commit au style du dépôt
