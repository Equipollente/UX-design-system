import { withBase } from '../design-system/lib/url';

export type ComponentPage = {
  slug: string;
  label: string;
  title: string;
  description: string;
};

export const componentPages: ComponentPage[] = [
  {
    slug: 'card-default',
    label: 'CardDefault',
    title: 'CardDefault',
    description: 'Documentation du composant CardDefault.',
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
