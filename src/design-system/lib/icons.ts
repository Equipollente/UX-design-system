// Généré par scripts/build-icons.mjs depuis icons/. Ne pas éditer à la main.
//
// Le registre est ce qui fait d'une icône un objet nommé du système plutôt qu'un
// chemin de fichier : `icon="mail-edit"` se vérifie à la compilation, `icon="/icons/mail-edit.svg"`
// ne se vérifiait qu'en production, sur un 404.

import aiTools from '../icons/ai-tools.svg';
import arrowNarrowDown from '../icons/arrow-narrow-down.svg';
import arrowNarrowLeft from '../icons/arrow-narrow-left.svg';
import arrowNarrowRight from '../icons/arrow-narrow-right.svg';
import arrowNarrowUpRight from '../icons/arrow-narrow-up-right.svg';
import book from '../icons/book.svg';
import bookOpen from '../icons/book-open.svg';
import boxPlus from '../icons/box-plus.svg';
import calendar from '../icons/calendar.svg';
import check from '../icons/check.svg';
import chevronDown from '../icons/chevron-down.svg';
import chevronLeft from '../icons/chevron-left.svg';
import chevronRight from '../icons/chevron-right.svg';
import chevronTop from '../icons/chevron-top.svg';
import circleFaceContent from '../icons/circle-face-content.svg';
import circleInfo from '../icons/circle-info.svg';
import clockForward from '../icons/clock-forward.svg';
import close from '../icons/close.svg';
import codeSnippet from '../icons/code-snippet.svg';
import cornerRightDown from '../icons/corner-right-down.svg';
import disciplines from '../icons/disciplines.svg';
import documentPedagogicalMaterial from '../icons/document-pedagogical-material.svg';
import edit from '../icons/edit.svg';
import expand04 from '../icons/expand-04.svg';
import filePlus from '../icons/file-plus.svg';
import fileText from '../icons/file-text.svg';
import fileTextAttachment from '../icons/file-text-attachment.svg';
import fileTextSend from '../icons/file-text-send.svg';
import fileTextShield from '../icons/file-text-shield.svg';
import folderCheck from '../icons/folder-check.svg';
import globe3 from '../icons/globe-3.svg';
import grid from '../icons/grid.svg';
import imagePlus from '../icons/image-plus.svg';
import institutionalWebsiteLink from '../icons/institutional-website-link.svg';
import knowledge1 from '../icons/knowledge1.svg';
import knowledge2 from '../icons/knowledge2.svg';
import knowledge3 from '../icons/knowledge3.svg';
import link2 from '../icons/link-2.svg';
import list from '../icons/list.svg';
import luggage1 from '../icons/luggage-1.svg';
import luggage2 from '../icons/luggage-2.svg';
import mailEdit from '../icons/mail-edit.svg';
import mainComponent from '../icons/main-component.svg';
import menuRight from '../icons/menu-right.svg';
import passport1 from '../icons/passport-1.svg';
import pin2 from '../icons/pin-2.svg';
import plus from '../icons/plus.svg';
import podcast from '../icons/podcast.svg';
import pressArticleSource from '../icons/press-article-source.svg';
import quoteDown from '../icons/quote-down.svg';
import route from '../icons/route.svg';
import save from '../icons/save.svg';
import search2 from '../icons/search-2.svg';
import siteInstitutionnel from '../icons/site-institutionnel.svg';
import star2 from '../icons/star-2.svg';
import stickyNote from '../icons/sticky-note.svg';
import telescope from '../icons/telescope.svg';
import timeline from '../icons/timeline.svg';
import trash from '../icons/trash.svg';
import usersCheck from '../icons/users-check.svg';

export const icons = {
  'ai-tools': aiTools,
  'arrow-narrow-down': arrowNarrowDown,
  'arrow-narrow-left': arrowNarrowLeft,
  'arrow-narrow-right': arrowNarrowRight,
  'arrow-narrow-up-right': arrowNarrowUpRight,
  'book': book,
  'book-open': bookOpen,
  'box-plus': boxPlus,
  'calendar': calendar,
  'check': check,
  'chevron-down': chevronDown,
  'chevron-left': chevronLeft,
  'chevron-right': chevronRight,
  'chevron-top': chevronTop,
  'circle-face-content': circleFaceContent,
  'circle-info': circleInfo,
  'clock-forward': clockForward,
  'close': close,
  'code-snippet': codeSnippet,
  'corner-right-down': cornerRightDown,
  'disciplines': disciplines,
  'document-pedagogical-material': documentPedagogicalMaterial,
  'edit': edit,
  'expand-04': expand04,
  'file-plus': filePlus,
  'file-text': fileText,
  'file-text-attachment': fileTextAttachment,
  'file-text-send': fileTextSend,
  'file-text-shield': fileTextShield,
  'folder-check': folderCheck,
  'globe-3': globe3,
  'grid': grid,
  'image-plus': imagePlus,
  'institutional-website-link': institutionalWebsiteLink,
  'knowledge1': knowledge1,
  'knowledge2': knowledge2,
  'knowledge3': knowledge3,
  'link-2': link2,
  'list': list,
  'luggage-1': luggage1,
  'luggage-2': luggage2,
  'mail-edit': mailEdit,
  'main-component': mainComponent,
  'menu-right': menuRight,
  'passport-1': passport1,
  'pin-2': pin2,
  'plus': plus,
  'podcast': podcast,
  'press-article-source': pressArticleSource,
  'quote-down': quoteDown,
  'route': route,
  'save': save,
  'search-2': search2,
  'site-institutionnel': siteInstitutionnel,
  'star-2': star2,
  'sticky-note': stickyNote,
  'telescope': telescope,
  'timeline': timeline,
  'trash': trash,
  'users-check': usersCheck,
} as const;

/** Les noms qu'un appelant a le droit d'écrire. */
export type IconName = keyof typeof icons;

/** L'ordre du registre, pour la planche de /icons : aucune liste tenue en double. */
export const iconNames = Object.keys(icons) as IconName[];
