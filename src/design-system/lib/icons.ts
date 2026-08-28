// Généré par scripts/build-icons.mjs depuis icons/. Ne pas éditer à la main.
//
// Le registre est ce qui fait d'une icône un objet nommé du système plutôt qu'un
// chemin de fichier : `icon="mail-edit"` se vérifie à la compilation, `icon="/icons/mail-edit.svg"`
// ne se vérifiait qu'en production, sur un 404.

import arrowNarrowDown from '../icons/arrow-narrow-down.svg';
import arrowNarrowLeft from '../icons/arrow-narrow-left.svg';
import arrowNarrowRight from '../icons/arrow-narrow-right.svg';
import bookOpen from '../icons/book-open.svg';
import boxPlus from '../icons/box-plus.svg';
import check from '../icons/check.svg';
import chevronDown from '../icons/chevron-down.svg';
import circleFaceContent from '../icons/circle-face-content.svg';
import close from '../icons/close.svg';
import cornerRightDown from '../icons/corner-right-down.svg';
import edit from '../icons/edit.svg';
import filePlus from '../icons/file-plus.svg';
import fileText from '../icons/file-text.svg';
import imagePlus from '../icons/image-plus.svg';
import mailEdit from '../icons/mail-edit.svg';
import menuRight from '../icons/menu-right.svg';
import quoteDown from '../icons/quote-down.svg';
import route from '../icons/route.svg';
import trash from '../icons/trash.svg';

export const icons = {
  'arrow-narrow-down': arrowNarrowDown,
  'arrow-narrow-left': arrowNarrowLeft,
  'arrow-narrow-right': arrowNarrowRight,
  'book-open': bookOpen,
  'box-plus': boxPlus,
  'check': check,
  'chevron-down': chevronDown,
  'circle-face-content': circleFaceContent,
  'close': close,
  'corner-right-down': cornerRightDown,
  'edit': edit,
  'file-plus': filePlus,
  'file-text': fileText,
  'image-plus': imagePlus,
  'mail-edit': mailEdit,
  'menu-right': menuRight,
  'quote-down': quoteDown,
  'route': route,
  'trash': trash,
} as const;

/** Les noms qu'un appelant a le droit d'écrire. */
export type IconName = keyof typeof icons;

/** L'ordre du registre, pour la planche de /icons : aucune liste tenue en double. */
export const iconNames = Object.keys(icons) as IconName[];
