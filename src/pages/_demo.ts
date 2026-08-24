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

// La pile. Figma ne dessine qu'une seule étude : sa « Case-Study Card2 » (222:831)
// est une copie de la première, un emplacement et non un second contenu. Les deux
// suivantes sont donc des remplissages, titrés autrement pour qu'on voie qu'une
// carte en recouvre une autre — c'est ce que la démo doit prouver.
//
// Elles réutilisent les mêmes vignettes, et gardent leurs alt tels quels : un alt
// décrit l'image, pas la carte qui la porte. Le réécrire pour coller au faux titre
// serait une description fausse.
export const caseStudies = [
  { ...caseStudyDemo, images: caseStudyImages },
  {
    ...caseStudyDemo,
    eyebrow: '2024 - Sopra Steria',
    title: 'Turning a support backlog into a discovery pipeline',
    impact: 'Fewer duplicate tickets — Faster triage • Support and product finally reading the same signal',
    tags: ['Diary Study', 'Service Blueprint', 'Opportunity Mapping'],
    images: caseStudyImages,
  },
  {
    ...caseStudyDemo,
    eyebrow: '2023 - Orange',
    title: 'A design system nobody had to be convinced to use',
    impact: 'Adoption without a mandate — One vocabulary • Accessibility stopped being a late review',
    tags: ['Component Audit', 'Contribution Model', 'Accessibility Review'],
    images: caseStudyImages,
  },
];
