// Les collections de contenu du site. Une seule pour l'instant : le texte écrit à la main d'une
// page de composant (à quoi il sert, quand l'utiliser). Tout le reste de la page est lu dans le
// code du composant, jamais recopié ici.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const components = defineCollection({
  // Un fichier par composant, nommé comme lui en minuscules : inputpg.md pour InputPG.
  loader: glob({ pattern: '*.md', base: './src/content/components' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { components };
