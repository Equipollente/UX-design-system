// Les types du champ texte. Ils vivent à part pour que le composant ne montre que
// sa structure : ici, ce qu'on peut lui demander ; dans le composant, ce qu'il fait.
//
// Les réglages sont ceux du `_FormGroup` de Figma — mêmes noms, mêmes valeurs :
//   · `status` et `size` sont ses deux variantes ;
//   · `label`, `hint`, `message` sont ses textes ;
//   · `counter` est son interrupteur.
// Tout le reste — `value`, `placeholder`, `maxlength`, `required`, `autocomplete`,
// `inputmode`… — est un attribut natif de `<input>` : on ne le recopie pas, on
// l'hérite de `HTMLAttributes<'input'>`, que fournit Astro.

import type { HTMLAttributes } from 'astro/types';

/** Où en est le champ. Les quatre valeurs s'excluent : un champ éteint n'a ni erreur ni succès. */
export type InputStatus = 'rest' | 'error' | 'success' | 'disabled';

/** La hauteur de la boîte : elle vient du rembourrage, pas d'une hauteur fixée. */
export type InputSize = 'small' | 'medium' | 'large';

/** Les types d'un champ d'une seule ligne, et eux seuls. */
export type InputType = 'text' | 'email' | 'tel' | 'url' | 'search' | 'password';

// `type`, `size` et `disabled` existent déjà dans les attributs natifs, avec un autre
// sens (`size` y est un nombre de caractères) : on les écarte pour poser les nôtres.
type NativeAttributes = Omit<HTMLAttributes<'input'>, 'type' | 'size' | 'disabled'>;

export interface InputProps extends NativeAttributes {
  /** Lie le libellé à la boîte. Obligatoire : c'est ce que les lecteurs d'écran annoncent. */
  id: string;
  /** Le texte du libellé. */
  label: string;
  type?: InputType;
  status?: InputStatus;
  size?: InputSize;
  /** L'aide : ce que le champ attend. Reste affichée, même en erreur. */
  hint?: string;
  /** Le texte qui accompagne `status="error"` ou `status="success"`. */
  message?: string;
  /** Affiche « 12/500 ». Demande `maxlength`. */
  counter?: boolean;
}
