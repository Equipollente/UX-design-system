// Les collections de contenu du site. Une seule pour l'instant : le texte écrit à la main d'une
// page de composant. Tout le reste de la page est lu dans le code du composant, jamais recopié.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// La valeur d'un réglage dans un exemple : un mot, un nombre ou oui / non.
// Une liste (`options` d'un Select, d'un groupe de cases) est aussi une valeur : des mots, ou des objets.
const valeur = z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.record(z.string(), z.any())]))]);

const components = defineCollection({
  // Un fichier par composant, nommé comme lui en minuscules : inputpg.md pour InputPG.
  loader: glob({ pattern: '*.md', base: './src/content/components' }),
  schema: z.object({
    /** Le nom lisible du composant. */
    title: z.string(),
    /** Une phrase qui le définit. */
    description: z.string(),
    /** Le composant dans Figma. */
    figma: z.url().optional(),
    /**
     * Des exemples, comme dans Primer : un titre, une phrase d'usage, puis un ou plusieurs
     * composants posés avec leurs réglages. Le code à copier s'écrit tout seul d'après eux.
     */
    exemples: z
      .array(
        z.object({
          titre: z.string(),
          texte: z.string().optional(),
          instances: z.array(z.record(z.string(), valeur)).min(1),
        }),
      )
      .default([]),
    /** Ce qu'il faut savoir pour que tout le monde puisse s'en servir. */
    accessibilite: z.array(z.string()).default([]),
    /** D'autres composants à regarder. */
    voirAussi: z.array(z.object({ nom: z.string(), texte: z.string() })).default([]),
  }),
});

export const collections = { components };
