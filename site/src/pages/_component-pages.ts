import { withBase } from 'ux-design-system/lib/url';
import components from 'ux-design-system/data/components.json';

export type ComponentPage = {
  slug: string;
  label: string;
  title: string;
  description: string;
};

// Les pages écrites à la main : chacune a sa propre visualisation.
export const componentPages: ComponentPage[] = [
  {
    slug: 'cardcanonique',
    label: 'Card canonique',
    title: 'CardDefault canonique',
    description: 'Composition canonique de la famille Cards, construite avec des slots.',
  },
];

// ── Les pages fabriquées toutes seules ───────────────────────────────────────
// Un composant a sa page dès que le code dit avec quoi l'essayer : chaque réglage obligatoire
// porte un `@example`. Aucune liste à tenir ici — ajouter les `@example` dans le code suffit.

type Reglage = { nom: string; requis: boolean; exemple?: string };
type Fiche = { description: string; props: Reglage[] };
const fiches = components as unknown as Record<string, Fiche>;

export type GeneratedPage = ComponentPage & { nom: string };

export const generatedPages: GeneratedPage[] = Object.entries(fiches)
  .filter(([nom, fiche]) => {
    if (nom.startsWith('_')) return false; // une pièce interne n'a pas sa page
    const essayable = fiche.props.some((p) => p.exemple !== undefined);
    const complet = fiche.props.every((p) => !p.requis || p.exemple !== undefined);
    return essayable && complet;
  })
  .map(([nom, fiche]) => ({
    nom,
    slug: nom.toLowerCase(),
    label: nom,
    title: nom,
    description: fiche.description,
  }));

export const componentPageGroups = [
  {
    label: 'Composants',
    items: [...componentPages, ...generatedPages].map(({ slug, label }) => ({
      label,
      href: withBase(`/components/${slug}`),
    })),
  },
];
