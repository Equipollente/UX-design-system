// Ce qu'un champ dit sous sa boîte : une erreur, un succès, ou une aide. Un seul
// message à la fois — c'est la règle de Figma, où `validation` remplace l'aide
// au lieu de s'y ajouter. L'erreur l'emporte sur le succès, qui l'emporte sur
// l'aide : un champ ne peut pas être à la fois fautif et réussi, et le message
// qui annonce la faute ne doit pas être couvert par celui qui rassure.
//
// Ce n'est pas un composant : trois champs en ont besoin, aucun ne doit réécrire
// la priorité, et un fichier de logique ne dessine rien. Le dessin est celui de
// _FieldMessage.

export type FieldMessageType = 'error' | 'success' | 'hint';

export interface FieldMessageInput {
  /** L'aide : ce que le champ attend, dite avant que personne ne se trompe. */
  hint?: string;
  /** L'erreur. Fait passer le champ en invalide. */
  error?: string;
  /** Le succès. */
  success?: string;
}

export interface ResolvedFieldMessage {
  type: FieldMessageType;
  text: string;
}

export function resolveFieldMessage({ hint, error, success }: FieldMessageInput): ResolvedFieldMessage | null {
  if (error) return { type: 'error', text: error };
  if (success) return { type: 'success', text: success };
  if (hint) return { type: 'hint', text: hint };
  return null;
}
