// Met en forme le HTML qu'un composant rend, pour qu'un développeur le lise.
//
// Le composant rendu arrive sur une seule ligne, avec les attributs `data-astro-cid-*` que le
// compilateur pose pour isoler les styles : c'est du bruit, un site qui consomme le système n'a
// rien à en faire. Ce fichier les retire, indente les balises, et ne touche à rien d'autre —
// ce n'est pas un validateur, et le HTML qu'il reçoit est celui des composants du système.
//
// Les icônes sont des `<svg>` inlinés dont le tracé tient sur dix lignes et ne dit rien : elles
// se réduisent à leur balise ouvrante, marquée d'une ellipse.

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

export function formatHtml(source: string): string {
  const propre = source
    .replace(/\sdata-astro-cid-[a-z0-9]+(?:="[^"]*")?/g, '')
    // Astro pose aussi une classe `astro-xxxxxxxx` sur les éléments qui reçoivent des attributs étalés.
    .replace(/\sclass="astro-[a-z0-9]{8}"/g, '')
    .replace(/(\sclass="[^"]*?)\sastro-[a-z0-9]{8}/g, '$1')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg\b([^>]*)>[\s\S]*?<\/svg>/g, '<svg$1>…</svg>');

  const jetons = propre.match(/<[^>]+>|[^<]+/g) ?? [];
  const lignes: string[] = [];
  let profondeur = 0;
  const marge = () => '  '.repeat(profondeur);

  for (let i = 0; i < jetons.length; i++) {
    const jeton = jetons[i];

    if (!jeton.startsWith('<')) {
      const texte = jeton.replace(/\s+/g, ' ').trim();
      if (texte) lignes.push(marge() + texte);
      continue;
    }

    if (jeton.startsWith('</')) {
      profondeur = Math.max(0, profondeur - 1);
      lignes.push(marge() + jeton);
      continue;
    }

    const nom = /^<([a-zA-Z][\w-]*)/.exec(jeton)?.[1] ?? '';
    const autofermante = jeton.endsWith('/>') || VOID.has(nom.toLowerCase());

    // `<p>texte</p>` tient sur une seule ligne.
    const suite = jetons[i + 1];
    if (!autofermante && suite && !suite.startsWith('<') && jetons[i + 2] === `</${nom}>` && suite.trim()) {
      lignes.push(`${marge()}${jeton}${suite.replace(/\s+/g, ' ').trim()}${jetons[i + 2]}`);
      i += 2;
      continue;
    }

    lignes.push(marge() + jeton);
    if (!autofermante) profondeur++;
  }

  return lignes.join('\n');
}
