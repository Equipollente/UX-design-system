# Vérifier la typographie contre ses tokens

Deux familles de variables **ne peuvent pas être liées** à un style de texte dans Figma :
`font/line-height/*` et `font/letter-spacing/*`. La valeur vit donc à deux endroits — la variable,
et le pourcentage tapé dans chaque style. Ce fichier dit pourquoi, et donne le contrôle qui remplace
la relecture à la main.

## Pourquoi elles ne se lient pas

Une variable Figma de type nombre transporte **le nombre, jamais l'unité**. Or un interligne est un
couple `{valeur, unité}` — 120 % et 120 px sont deux choses différentes. Quand on lie la variable,
Figma applique des **pixels**, et il n'existe aucun moyen de lui dire « ces 120 sont des pour-cent ».

Mesuré le 27/08, sur trois nœuds jetables, en partant de trois unités différentes :

| Le nœud était en | Après liaison de `font/line-height/snug` (120) |
|---|---|
| **100 %** | **120 PIXELS** |
| 100 px | 120 PIXELS |
| Auto | 120 PIXELS |

Même en partant d'un pourcentage, Figma force en pixels. L'interlettrage se comporte pareil :
`font/letter-spacing/wider` (8) lié à un nœud à 0 % donne **8 PIXELS**.

C'est le pendant exact du piège de l'opacité, dans l'autre sens : là-bas Figma impose le pourcentage,
ici il impose les pixels. Dans les deux cas l'unité n'est pas dans la variable.

> **La règle : ne jamais lier ces deux familles à un style.** Le pourcentage se tape dans le style.
> Les variables restent — le code les lit, et `npm run tokens` les divise par 100 pour en faire les
> multiplicateurs CSS `1.12`, `1.2`, `1.55`. Le code, lui, ne peut pas diverger.

## Ce que ça coûte, et ce que ça ne coûte pas

**Le code suit tout seul.** Changer un interligne dans Figma, ré-exporter, `npm run tokens` : le site
est à jour. Rien à vérifier de ce côté.

**Le fichier Figma, non.** Les styles gardent leur ancien pourcentage, et rien ne le signale. C'est
là — et seulement là — qu'un contrôle est nécessaire.

## Le contrôle

Il tourne en un appel et couvre tous les styles du fichier. Il demande **Figma ouvert** et le MCP
Figma connecté ; il ne se lance pas depuis `npm`, puisqu'il lit le fichier de dessin et non le dépôt.

À demander tel quel : *« lance l'audit de typographie »*, ou coller ce script :

```js
const vars = await figma.variables.getLocalVariablesAsync('FLOAT');
const mode = '3:0'; // Desktop
const val = (n) => { const v = vars.find(x => x.name === n); return v ? v.valuesByMode[mode] : null; };

const interlignes = { tight: val('font/line-height/tight'), snug: val('font/line-height/snug'), body: val('font/line-height/body') };
const interlettrages = {};
for (const k of ['tight','normal','wide','wider','widest']) interlettrages[k] = val('font/letter-spacing/' + k);

const arrondi = (x) => Math.round(x * 100) / 100;
const trouve = (table, v) => Object.entries(table).find(([, x]) => Math.abs(x - v) < 0.01);

const styles = await figma.getLocalTextStylesAsync();
const ecarts = [];
for (const s of styles) {
  const lhu = s.lineHeight.unit;
  const lhv = lhu === 'AUTO' ? null : arrondi(s.lineHeight.value);
  const lsv = s.letterSpacing ? arrondi(s.letterSpacing.value) : null;
  const lsu = s.letterSpacing ? s.letterSpacing.unit : null;
  const probleme = [];
  if (lhu === 'PIXELS') probleme.push(`interligne en PIXELS (${lhv})`);
  else if (lhu === 'PERCENT' && !trouve(interlignes, lhv)) probleme.push(`interligne ${lhv}% hors vocabulaire`);
  if (lsu === 'PIXELS' && lsv !== 0) probleme.push(`interlettrage en PIXELS (${lsv})`);
  else if (lsu === 'PERCENT' && !trouve(interlettrages, lsv)) probleme.push(`interlettrage ${lsv}% hors vocabulaire`);
  if (probleme.length) ecarts.push({ style: s.name, probleme });
}
return { stylesAudités: styles.length, stylesConformes: styles.length - ecarts.length, écarts: ecarts };
```

Il ne corrige rien : il liste les styles dont l'interligne ou l'interlettrage n'est plus une valeur du
vocabulaire. **Un style en PIXELS est toujours un défaut** — c'est la trace d'une liaison qu'il faut
retirer.

## Quand le lancer — et pourquoi tu n'as pas à y penser

**`npm run tokens` te le dira.** Le script compare les deux familles en pourcentage à leur état
précédent, et si l'une a bougé il l'écrit en clair, avec l'ancienne et la nouvelle valeur :

```
  ⚠️  1 valeur a bougé dans les familles que Figma ne sait pas lier :
      font.line-height.tight : 1.12 → 1.15

      Le code est à jour. Les styles de texte du fichier Figma, non :
      ils portent le pourcentage à la main, et il vient de diverger.
      → lancer l'audit de typographie, atelier/verifier-la-typographie.md
```

Il ne bloque rien et ne corrige rien : il parle au seul moment où la machine voit passer le
changement. Quand rien n'a bougé, il se tait — c'est ce qui fait qu'on le croit quand il parle.

Les deux autres moments, eux, ne se voient pas depuis le dépôt :

- après avoir créé ou dupliqué un style de texte dans Figma ;
- avant un ré-export, si la typographie a bougé — c'est le moment le moins cher.

## L'état au 27/08

22 styles, **19 conformes**. Trois écarts :

| Style | Écart | Sort |
|---|---|---|
| `heading/display` | interligne en **PIXELS (120)** | la seule liaison du fichier, et elle est cassée : sur 42 px l'interligne fait presque le triple du 1,2 voulu |
| `display italic` | 123 % | hors vocabulaire — ligne déjà ouverte dans [arbitrages.md](arbitrages.md) |
| `users` | 123 % | même valeur, même ligne |
