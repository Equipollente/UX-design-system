// Ce que le Select et sa liste se partagent : la forme des options, et leur rangement en blocs.
//
// Ce n'est pas un composant : un fichier de logique ne dessine rien. Select et SelectPanel appellent
// `buildBlocks` avec le même `id`, et obtiennent les mêmes identifiants de choix — c'est ce qui permet
// au Select de dire, côté serveur, quel libellé la boîte montre.

/** Un choix : une chaîne vaut pour sa propre valeur. */
export type Option = string | { value: string; label: string; /** Éteint ce choix seul. */ disabled?: boolean };

export interface OptionGroup {
  /** Le nom du groupe. Il range, il ne se choisit pas. */
  label: string;
  options: Option[];
  /** Éteint tout le groupe. */
  disabled?: boolean;
}

export interface Item {
  value: string;
  label: string;
  inputId: string;
  /** Le choix est éteint d'avance, seul ou par son groupe. */
  locked: boolean;
}

export interface Block {
  /** Le nom du groupe, ou `undefined` pour un choix sans groupe. */
  label: string | undefined;
  items: Item[];
}

const isGroup = (o: Option | OptionGroup): o is OptionGroup => typeof o === 'object' && 'options' in o;

/** Les choix rangés en blocs pour s'afficher. Les `id` des contrôles se numérotent d'un bout à l'autre. */
export function buildBlocks(id: string, options: (Option | OptionGroup)[]): { blocks: Block[]; items: Item[] } {
  let index = 0;
  const toItem = (o: Option, locked = false): Item => {
    const base = typeof o === 'string' ? { value: o, label: o, disabled: false } : { disabled: false, ...o };
    return { value: base.value, label: base.label, inputId: `${id}-${index++}`, locked: locked || !!base.disabled };
  };
  const blocks: Block[] = options.map((o) =>
    isGroup(o)
      ? { label: o.label, items: o.options.map((x) => toItem(x, !!o.disabled)) }
      : { label: undefined, items: [toItem(o)] },
  );
  return { blocks, items: blocks.flatMap((b) => b.items) };
}

/**
 * Les valeurs choisies à l'ouverture : une seule en choix unique, la première qu'on donne.
 * Une chaîne vide n'est pas un choix : c'est « rien », comme l'invite du `<select>`.
 */
export function chosenValues(multiple: boolean, value: string | undefined, values: string[] | undefined): string[] {
  const one = value === undefined || value === '' ? undefined : value;
  if (multiple) return values ?? (one !== undefined ? [one] : []);
  return one !== undefined ? [one] : (values ?? []).slice(0, 1);
}
