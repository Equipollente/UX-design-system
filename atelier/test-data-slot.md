# Tester DataSlot avec Popover

Cette fiche décrit une expérimentation de `@data-slot/popover` dans Astro.

Le but est de comprendre le contrat de DataSlot avant de transformer cette expérience en
composant public du design system. La branche de travail est `test-data-slot`.

Cette fiche ne remplace pas la documentation du paquet : les noms d'attributs, les options et
les méthodes restent ceux de la version installee dans le projet.

---

## 1. Installer la primitive

Installer uniquement la primitive Popover :

```sh
npm install @data-slot/popover
```

Verifier ensuite :

- le paquet apparait dans `package.json` ;
- le lockfile est mis a jour ;
- aucune autre dependance de runtime n'a ete ajoutee ;
- la version installee correspond au README consulte.

**Point d'arret :** ne pas creer le composant Astro tant que le contrat du paquet n'est pas lu.

---

## 2. Inspecter le contenu du paquet

Dans PowerShell, lister les fichiers installes :

```powershell
Get-ChildItem node_modules\@data-slot\popover -Recurse
```

Lire les trois surfaces utiles :

```powershell
Get-Content node_modules\@data-slot\popover\README.md
Get-Content node_modules\@data-slot\popover\dist\index.d.ts
Get-Content node_modules\@data-slot\popover\dist\index.js
```

Chaque fichier repond a une question differente :

- `README.md` explique comment utiliser le paquet ;
- `dist/index.d.ts` montre les fonctions, les options et les types publics ;
- `dist/index.js` contient le code JavaScript execute dans le navigateur.

Rechercher rapidement les fonctions et le controleur :

```powershell
Select-String `
	-Path node_modules\@data-slot\popover\dist\index.d.ts `
	-Pattern 'create|PopoverController'
```

Rechercher les parties importantes de la documentation :

```powershell
Select-String `
	-Path node_modules\@data-slot\popover\README.md `
	-Pattern 'Markup|Required Slots|Controller|create'
```

**Effet :** on voit le contrat reel de la version installee, sans deduire les noms des roles ni
les options depuis un autre composant.

**Point d'arret :** relever les noms et comportements dans le README avant de passer au markup.

---

## 3. Importer et appeler `create()`

Importer la fonction `create` depuis la primitive Popover :

```ts
import { create } from '@data-slot/popover';
```

Puis l'appeler dans le script execute dans le navigateur :

```ts
const controllers = create();
```

`create()` parcourt la page et initialise les instances Popover reconnues par les attributs
`data-slot` attendus par le paquet.

Avant cet appel, les attributs `data-slot` ne sont que du HTML : ils decrivent la structure, mais
ils n'ajoutent aucun comportement. Apres l'appel, DataSlot relie les elements de chaque instance et
installe le comportement documente par `@data-slot/popover`.

`controllers` contient les controleurs retournes par la bibliotheque. On les conserve pour pouvoir
les observer ou appeler leur methode `destroy()` si le README du paquet le prevoit. On ne modifie
pas encore l'etat a la main.

**Effet a verifier :** une instance Popover correctement marquee est maintenant prise en charge par
DataSlot. Les details exacts de sa structure et de ses effets se relevent dans l'etape suivante.

---

## 4. Lire le contrat Popover

Relever dans le README du paquet :

- l'element racine attendu ;
- l'attribut `data-slot` du declencheur ;
- l'attribut `data-slot` du contenu ;
- les attributs ARIA ajoutes ou geres ;
- les attributs d'etat exposes au CSS ;
- la fonction `create()` et, si elle existe, la fonction ciblee ;
- les methodes du controleur ;
- le comportement clavier ;
- le positionnement et les options de placement ;
- les conditions de nettoyage avec `destroy()`.

Ne pas deduire ces noms depuis un autre composant DataSlot. Le contrat appartient a
`@data-slot/popover`.

---

## 5. Observer un exemple minimal

Avant l'integration Astro, decrire le plus petit exemple qui permet de verifier :

1. le Popover est ferme au chargement ;
2. le bouton l'ouvre ;
3. le bouton le referme ;
4. `Echap` le ferme ;
5. le focus revient au declencheur ;
6. le contenu reste associe au declencheur ;
7. plusieurs Popovers peuvent coexister sans partager leur etat.

Pour chaque observation, noter le markup et les attributs modifies par DataSlot dans les outils du
navigateur.

---

## 6. Distinguer `data-slot` et `dataset`

`data-slot` est un attribut HTML utilise par la bibliotheque pour reconnaitre les roles de la
structure.

`dataset` est l'API JavaScript qui permet de lire les attributs `data-*` d'un element. Par exemple,
un attribut `data-state` devient une propriete `element.dataset.state`.

Pendant l'experimentation, ne pas modifier les attributs d'etat a la main. Ils appartiennent a
DataSlot. Le navigateur sert seulement a les observer.

---

## 7. Tester dans Astro

Creer une page Astro de test qui contient d'abord la structure Popover :

```astro
<div data-slot="popover">
	<button data-slot="popover-trigger" type="button">
		Ouvrir
	</button>

	<div data-slot="popover-content" hidden>
		<p>Contenu du Popover</p>

		<button data-slot="popover-close" type="button">
			Fermer
		</button>
	</div>
</div>
```

Le contenu porte `hidden` au depart : avant l'initialisation, il est ferme et ne participe pas a
l'interface. Les noms `popover`, `popover-trigger`, `popover-content` et `popover-close` viennent
du README de `@data-slot/popover`.

Ajouter ensuite le script Astro :

```astro
<script>
	import { create } from '@data-slot/popover';

	const controllers = create();
</script>
```

Astro envoie ce script au navigateur sous forme de module. Au chargement de la page, `create()`
cherche toutes les instances `data-slot="popover"` et leur associe le comportement DataSlot.

**Effets a observer dans le navigateur :**

- au chargement, le contenu est ferme ;
- un clic sur `Ouvrir` l'affiche ;
- `Fermer` le masque ;
- `Echap` le ferme ;
- un clic a l'exterieur le ferme ;
- le contenu est positionne par rapport au declencheur ;
- les attributs d'etat sont ajoutes ou retires par DataSlot.

Ne pas ajouter de code qui modifie directement `hidden`, `data-open` ou les attributs ARIA. Le
test sert justement a observer ce que `create()` prend en charge.

**Point d'arret :** verifier cette instance seule avant d'ajouter une deuxieme instance ou une
API de composant.

---

## 8. Monter l'experience dans Astro

Quand le contrat est compris :

- creer une surface de test clairement separee du composant public ;
- reproduire exactement la structure attendue par le paquet ;
- transmettre les attributs HTML de l'appelant ;
- initialiser toutes les instances presentes sur la page ;
- ne pas exposer les options DataSlot comme props sans besoin identifie ;
- ne pas forcer `data-state`, `hidden` ou les attributs ARIA depuis le composant ;
- ajouter uniquement les styles necessaires pour rendre les etats visibles.

**Point d'arret :** lancer `npm run check` avant d'ajouter une page de documentation publique.

---

## 9. Verifier l'accessibilite

Tester au clavier :

- atteindre le declencheur avec `Tab` ;
- ouvrir avec la touche prevue par le paquet ;
- parcourir le contenu ;
- fermer avec `Echap` ;
- constater le retour du focus ;
- verifier que le contenu ne devient pas accessible quand le Popover est ferme.

Tester aussi plusieurs instances, une fenetre etroite et `prefers-reduced-motion`.

---

## 10. Decider si cela devient un composant

A la fin de l'experience, separer les constats :

- ce que DataSlot prend en charge ;
- ce que le composant du systeme doit prendre en charge ;
- ce qui doit rester une responsabilite de l'appelant ;
- les props qui expriment un vrai besoin ;
- les choix qui ne doivent pas devenir une API publique.

Le composant public ne sera cree qu'apres cette decision. Sa documentation devra alors suivre le
workflow d'ajout de composant et reprendre l'interface reelle du fichier Astro.

---

## Etat de l'experience

- [x] Branche `test-data-slot` creee
- [x] Primitive Popover identifiee
- [ ] Paquet installe
- [ ] Contenu du paquet inspecte
- [ ] `create()` importe et appele
- [ ] Test Astro cree
- [ ] README du paquet lu
- [ ] Markup minimal observe
- [ ] Etats et attributs observes
- [ ] Integration Astro testee
- [ ] Parcours clavier verifie
- [ ] Decision sur le composant public prise
