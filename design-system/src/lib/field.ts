// Ce qu'un champ dit autour de sa boîte, et comment il le relie à elle : le message
// de validation, l'aide, le compteur, les identifiants et `aria-describedby`.
//
// Ce n'est pas un composant : un fichier de logique ne dessine rien. Le dessin est celui
// de `_Field` et de ses pièces. Input, Textarea et Select appellent `resolveField`, posent
// le résultat sur leur propre balise (`aria-describedby`, `aria-invalid`), puis rangent
// cette balise dans `_Field`. Un composant Astro ne peut pas écrire un attribut sur ce
// qu'on glisse dans son emplacement : c'est donc le champ qui câble, pas son conteneur
// (atelier/architecture-formulaires, décisions du 07/11).
//
// Trois règles, toutes venues de Figma (`FormGroup`, 936:9502) :
// — l'erreur l'emporte sur le succès : un champ ne peut pas être fautif et réussi à la fois ;
// — l'aide reste affichée avec un message, elle ne cède pas : Figma les empile ;
// — les identifiants se déduisent de `id`, ce qui rend le câblage identique d'un champ à l'autre.

export type FieldValidation = 'none' | 'error' | 'success';

export interface FieldMessage {
  id: string;
  type: 'error' | 'success';
  text: string;
}

export interface FieldHint {
  id: string;
  text: string;
}

export interface FieldCounter {
  id: string;
  current: number;
  max: number;
}

export interface FieldInput {
  /** L'aide : ce que le champ attend, dite avant que personne ne se trompe. */
  hint?: string;
  /** L'erreur. Fait passer le champ en invalide. */
  error?: string;
  /** Le succès. Cède à l'erreur. */
  success?: string;
  /** Le compteur de caractères : la valeur actuelle et la limite. */
  counter?: { current: number; max: number };
}

export interface ResolvedField {
  validation: FieldValidation;
  /** `true` quand le champ est en erreur : c'est ce qui pose `aria-invalid`. */
  invalid: boolean;
  message?: FieldMessage;
  hint?: FieldHint;
  counter?: FieldCounter;
  /**
   * La valeur d'`aria-describedby` : les éléments qui existent, le message en premier
   * pour qu'une erreur soit lue avant l'aide. `undefined` quand il n'y en a aucun,
   * parce qu'un attribut vide est une faute.
   */
  describedby: string | undefined;
}

export function resolveField(id: string, { hint, error, success, counter }: FieldInput): ResolvedField {
  const message: FieldMessage | undefined = error
    ? { id: `${id}-message`, type: 'error', text: error }
    : success
      ? { id: `${id}-message`, type: 'success', text: success }
      : undefined;

  const resolvedHint: FieldHint | undefined = hint ? { id: `${id}-hint`, text: hint } : undefined;
  const resolvedCounter: FieldCounter | undefined = counter
    ? { id: `${id}-count`, current: counter.current, max: counter.max }
    : undefined;

  const ids = [message?.id, resolvedHint?.id, resolvedCounter?.id].filter(Boolean);

  return {
    validation: message ? message.type : 'none',
    invalid: message?.type === 'error',
    message,
    hint: resolvedHint,
    counter: resolvedCounter,
    describedby: ids.length ? ids.join(' ') : undefined,
  };
}
