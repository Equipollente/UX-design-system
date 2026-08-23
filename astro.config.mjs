// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Le site est servi par GitHub Pages sous le nom du dépôt, pas à la racine du
  // domaine. `base` s'applique au routage — mais pas aux URLs écrites à la main :
  // celles-là passent par withBase(), dans src/design-system/lib/url.ts.
  site: 'https://equipollente.github.io',
  base: '/UX-design-system',
});
