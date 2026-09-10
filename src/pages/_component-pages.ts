import { withBase } from '../design-system/lib/url';

export type ComponentPage = {
  slug: string;
  label: string;
  title: string;
  description: string;
};

export const componentPages: ComponentPage[] = [
  {
    slug: 'card',
    label: 'Card',
    title: 'Card',
    description: 'Composant de base pour les cartes. Structure générique qui accepte des slots pour construire différentes variantes.',
  },
  {
    slug: 'card-default',
    label: 'CardDefault',
    title: 'CardDefault',
    description: 'Documentation du composant CardDefault.',
  },
  {
    slug: 'cardcanonique',
    label: 'Card canonique',
    title: 'CardDefault canonique',
    description: 'Composition canonique de la famille Cards, construite avec des slots.',
  },
];

export const componentPageGroups = [
  {
    label: 'Composants',
    items: componentPages.map(({ slug, label }) => ({
      label,
      href: withBase(`/components/${slug}`),
    })),
  },
];
