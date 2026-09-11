import { withBase } from '../design-system/lib/url';

export type ComponentPage = {
  slug: string;
  label: string;
  title: string;
  description: string;
};

export const componentPages: ComponentPage[] = [
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
