// Données de démonstration des pages de doc. Le préfixe `_` empêche Astro d'en
// faire une route : ce fichier n'est pas une page, c'est ce que /components et
// /templates/home lisent tous les deux pour montrer la même chose.
//
// Le contenu vient mot pour mot de Figma — 209:2348 pour l'intro, 176:1248 pour
// l'étude de cas. Rien ici n'appartient au système : ce sont les mots d'un site,
// et c'est justement pourquoi ils vivent dans src/pages/ et non dans
// src/design-system/.

import { withBase } from '../design-system/lib/url';
import type { IconName } from '../design-system/lib/icons';

/** L'ancre de la pile d'études de cas. Le Nav et l'Intro y mènent, la liste la porte. */
export const projectsAnchor = 'projets';

// Des ancres, pour qu'une démo ne fasse pas quitter la page. Les libellés sont
// ceux d'un site réel — un Nav se juge sur des mots de vraie longueur, pas sur
// des « Item 1 ».
export const demoLinks: { href: string; label: string; icon: IconName }[] = [
  { href: `#${projectsAnchor}`, label: 'Projets', icon: 'box-plus' },
  { href: '#how-i-work', label: 'How I work', icon: 'route' },
  { href: '#about', label: 'About me', icon: 'circle-face-content' },
  { href: '#cv', label: 'CV', icon: 'file-text' },
];

export const demoAction: { label: string; icon: IconName } = {
  label: "Let's chat",
  icon: 'mail-edit',
};

// Les trois vignettes de 176:1248, de largeurs différentes — c'est ce qui prouve
// que la piste les tient.
export const caseStudyImages = [
  {
    src: withBase('/images/case-study/rubika-percevoir.jpg'),
    alt: 'Guide « Percevoir sans lutter » : la page d’ouverture et ses deux principes perceptibles.',
    width: 822,
    height: 382,
  },
  {
    src: withBase('/images/case-study/rubika-agir.jpg'),
    alt: 'Guide « Agir sans difficultés » : les hypothèses de départ et leur vérification.',
    width: 271,
    height: 382,
  },
  {
    src: withBase('/images/case-study/rubika-roadmap.jpg'),
    alt: 'La feuille de route de l’atelier et la liste des participants.',
    width: 600,
    height: 382,
  },
];

// Le contenu du nœud 209:2348, mot pour mot.
export const introDemo = {
  avatar: { src: withBase('/images/avatar-judith.png'), alt: 'Judith Heckmann' },
  greeting: "Hello, I'm Judith",
  headline:
    'I design inclusive digital product experiences in a collaborative continuous discovery loop',
  description: 'From user insights to business impact. Outcomes are what I design for',
  action: { label: 'Some projects I worked on', href: `#${projectsAnchor}` },
};

// L'étude de cas de 176:1248, mot pour mot.
export const caseStudyDemo = {
  eyebrow: '2025 - Rubika',
  title: 'The 4 guides for designing for accessibility',
  impact: 'Faster deployments — Shared UX language — Roadmap alignment • User trust and satisfaction',
  tags: ['Hypothesis Testing', 'Co-design Facilitation', 'Journey Prototyping'],
  action: { label: 'Read the story', href: `#${projectsAnchor}` },
};

// La pile. Figma ne dessine qu'une seule étude : sa « Case-Study Card2 »
// (222:831) est une copie de la première — un emplacement, pas un second
// contenu. Le code fait pareil et répète Rubika.
//
// Il ne faut surtout pas inventer ici des missions au nom d'entreprises réelles.
// Cette page est publiée, rien à l'écran ne distinguerait un remplissage d'une
// vraie étude de cas, et « Read the story » invite à cliquer. Trois exemplaires
// du même projet suffisent à montrer ce que la pile doit montrer : une carte qui
// en recouvre une autre, et un ajout qui n'est qu'une ligne de données.
export const caseStudies = [
  { ...caseStudyDemo, images: caseStudyImages },
  { ...caseStudyDemo, images: caseStudyImages },
  { ...caseStudyDemo, images: caseStudyImages },
];

// La carte de 334:1129. Figma ne lui met que des libellés d'emplacement — « Card
// Title », « Card subtitle », « Card secondary infos » — qui ne disent rien de la
// longueur des vrais mots, et une carte se juge dessus. Le contenu est donc celui
// de l'étude Rubika, déjà dans ce fichier et déjà vrai : rien n'est inventé, et rien
// n'est écrit au nom d'une entreprise réelle qui ne l'ait pas déjà été.
//
// La carte a deux rangées de tags et Figma met la même chose dans les deux —
// « Accent » quatre fois. Une doc qui recopierait ça ne montrerait pas à quoi
// sert d'en avoir deux. La rangée du haut porte donc un mot de catégorie, celle
// du bas les trois méthodes de l'étude : c'est la lecture la plus évidente de
// deux rangées superposées, et elle n'engage que la doc — le composant, lui, ne
// distingue les deux que par la place.
export const cardDemo = {
  title: caseStudyDemo.title,
  subtitle: caseStudyDemo.impact,
  meta: caseStudyDemo.eyebrow,
  image: caseStudyImages[0],
  tagsTop: ['Case study'],
  tags: caseStudyDemo.tags,
  action: caseStudyDemo.action,
};

// Données fournies pour tester CardDefault avec des titres, descriptions et
// images de longueurs différentes. Elles restent dans la page de démonstration,
// jamais dans le design system.
export const cardDefaultWorks = [
  {
    title: 'Nager dans le bonheur',
    description: 'Une petite nageuse, quelques paillettes et des mots qui font du bien',
    creationYear: 2025,
    status: 'in_progress',
    techniques: ['gouache', 'encre', 'papier_mache'],
    image: 'https://drive.google.com/thumbnail?id=14ongVtldZFkLtB2IT-Op4bu0l4m2e8dZ&sz=w1760',
    imageAlt: "Vue principale fictive de l'œuvre Lignes de fuite 01",
  },
  {
    title: 'Broken record',
    description: 'Parce qu’on peut être un peu cassé et rester la chanson préférée de quelqu’un',
    creationYear: 2026,
    status: 'in_progress',
    techniques: ['aquarelle', 'acrylique', 'peinture_bombe', 'crayon_graphite', 'assemblage'],
    image: 'https://drive.google.com/thumbnail?id=1I4-_biqhyEr2VQLN6n5Y-3pwNxt6irDO&sz=w1760',
    imageAlt: "Vue de détail fictive de l'œuvre Lignes de fuite 01",
  },
  {
    title: 'Rewind',
    description: 'Une petite boîte pour rembobiner les souvenirs en musique.',
    creationYear: 2026,
    status: 'in_progress',
    techniques: ['acrylique', 'collage'],
    image: 'https://drive.google.com/thumbnail?id=1LP1vSBz9qXsEgehUwsUqlduMbCcUARar&sz=w1760',
    imageAlt: "Vue de détail fictive de l'œuvre Lignes de fuite 01",
  },
  {
    title: 'Matchbox ballet',
    description: 'Quand les sorcières troquent leurs balais pour le ballet',
    creationYear: 2025,
    status: 'in_progress',
    techniques: ['assemblage', 'soudure'],
    image: 'https://drive.google.com/thumbnail?id=1HjYs4r83ZA8u5NkgHh7AaokpnIplH48r&sz=w2000',
    imageAlt: 'Gemini_Generated_Image_mdl7fdmdl7fdmdl7.jpg',
  },
  {
    title: "Devine combien je t'aime",
    description: 'Une petite boîte, une grande déclaration d’amour',
    creationYear: 2025,
    status: 'in_progress',
    techniques: [],
    image: 'https://drive.google.com/thumbnail?id=1DVoQXtbSTNENG7BZ1TUq7gWqYSRsE8kp&sz=w2000',
    imageAlt: 'IMG-20260506-WA0004.jpg',
  },
  {
    title: 'Petits coeurs de poche',
    description: 'Des coeurs minuscules à glisser dans sa poche pour avoir toujours un peu d’amour sur soi',
    creationYear: 2025,
    status: 'in_progress',
    techniques: ['photocopie'],
    image: 'https://drive.google.com/thumbnail?id=1cCK5YaQM_1nyGOvNdwIdnH-K_XTAeJXT&sz=w2000',
    imageAlt: '20251007_112254.jpg',
  },
  {
    title: 'Poupées vaudoo de poche',
    description: 'À emporter partout pour conjurer les petits tracas du quotidien et autres emmerdements minuscules',
    creationYear: 2025,
    status: 'in_progress',
    techniques: [],
    image: 'https://drive.google.com/thumbnail?id=1-L-nrFLLeMCXj8EhnwWNWXtJm1hMnIdd&sz=w2000',
    imageAlt: 'Gemini_Generated_Image_b7em9cb7em9cb7em.jpg',
  },
  {
    title: 'Liberté, égalité.... Jean Paul Gaultier !',
    description: 'Une petite boîte pour un grand slogan. Détourner les codes de la mode pour célébrer la liberté, l’égalité et le droit d’être soi même.',
    creationYear: 2025,
    status: 'in_progress',
    techniques: ['peinture_bombe', 'fusain'],
    image: 'https://drive.google.com/thumbnail?id=1vmzbCow9BsWw2nki0ffao1XZfx7dFHeM&sz=w2000',
    imageAlt: 'Gemini_Generated_Image_7o6r227o6r227o6r.jpg',
  },
  {
    title: 'Voyage voyage',
    description: 'Un bateau minuscule pour partir très loin, même en restant chez soi.',
    creationYear: 2026,
    status: 'in_progress',
    techniques: [],
    image: 'https://drive.google.com/thumbnail?id=1UqUJELI3mPs7Y9HOc-UhAbpd-jRcKSCg&sz=w2000',
    imageAlt: '112.jpg',
  },
  {
    title: 'Fête de poche',
    description: 'Une fête miniature à déplier, à installer et à célébrer. Même pour rien. Surtout pour rien.',
    creationYear: 2026,
    status: 'in_progress',
    techniques: [],
    image: 'https://drive.google.com/thumbnail?id=14ndAJEWrwhsMo2iRbQZOKRsUopDcAKwT&sz=w2000',
    imageAlt: '8336.jpg',
  },
];

// ── Les champs de /formulaire ────────────────────────────────────────────────
// Figma ne donne qu'un libellé témoin — « Radio label » — et un témoin ne fait
// pas un groupe : un radio ne se juge que contre ses voisins. Les mots ci-dessous
// sont ceux d'un vrai formulaire, de longueurs inégales, parce que c'est là qu'un
// alignement se trahit.

export const demoRadioName = 'format';

export const demoRadioOptions = [
  { id: 'format-atelier', label: 'Atelier en présentiel', value: 'atelier' },
  { id: 'format-visio', label: 'Visioconférence', value: 'visio' },
  { id: 'format-asynchrone', label: 'Échange asynchrone', value: 'asynchrone' },
];

// Figma ne donne là non plus qu'un témoin — « Checkbox label ». Une case affirme
// quelque chose : les mots ci-dessous sont des phrases, pas des étiquettes.
export const demoCheckboxOptions = [
  { id: 'envoi-compte-rendu', label: 'M’envoyer le compte rendu de la séance' },
  { id: 'envoi-relance', label: 'Me relancer si je ne réponds pas sous huit jours' },
  { id: 'envoi-lettre', label: 'M’inscrire à la lettre mensuelle' },
];

// Des filtres de vraie longueur : c'est sur des mots inégaux qu'on voit si la
// rangée de pastilles retombe proprement à la ligne.
export const demoChipOptions = [
  { id: 'chip-recherche', label: 'Recherche utilisateur' },
  { id: 'chip-atelier', label: 'Atelier' },
  { id: 'chip-ds', label: 'Design system' },
  { id: 'chip-accessibilite', label: 'Accessibilité' },
  { id: 'chip-proto', label: 'Prototypage' },
];

// La zone de depot montre les mots du noeud 343:315, tels quels.
export const demoAddImage = {
  label: 'Add image',
  hint: 'PNG, JPG up to 10 MB',
  accept: 'image/png,image/jpeg',
};

// La galerie reprend les images de l'etude de cas : ce sont de vraies planches,
// de proportions differentes, ce qui est justement ce qu'une grille doit tenir.
export const demoGalleryImages = caseStudyImages.map((image, i) => ({
  id: `planche-${i + 1}`,
  src: image.src,
  alt: image.alt,
  href: image.src,
  width: image.width,
  height: image.height,
}));

// Les trois autres étapes du cycle d'AddImage (418:1020).
export const demoAddImageFail = 'le téléchargement a échoué';
export const demoAddImageProgress = 62;
export const demoAddImageSuccess = demoGalleryImages[0];

// ── Modal, 420:1223 ──────────────────────────────────────────────────────────
// « Property 1 » a 4 valeurs dans Figma : Layout (le gabarit, textes de
// remplissage — pas montré ici), Confirmation, Alert, Success. Les mots des
// trois autres viennent du nœud, mot pour mot — y compris la coquille de
// l'Alert, signalée sur /components plutôt que corrigée en dur.
export const modalConfirmationDemo = {
  icon: 'book-open' as const,
  variant: 'validation' as const,
  heading: 'Enregistrer les modifications ?',
  body: 'Les modifications apportées à cette série seront sauvegardées.',
  primary: { label: 'Enregistrer' },
  secondary: { label: 'Annuler' },
};

export const modalAlertDemo = {
  icon: 'trash' as const,
  variant: 'alert' as const,
  heading: 'Supprimer la série ?',
  body: 'Cette action est irréversible. Toutes les œuvres associées ne seront pas supprimer',
  primary: { label: 'Supprimer' },
  secondary: { label: 'Annuler' },
};

export const modalSuccessDemo = {
  icon: 'check' as const,
  variant: 'succes' as const,
  heading: 'Modifications enregistrées !',
  body: 'Les modifications apportées à cette série sont sauvegardées.',
  primary: { label: 'revenir à la liste' },
};
