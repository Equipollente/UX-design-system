// Déployé sur GitHub Pages, le site ne vit pas à la racine d'un domaine mais sous
// <user>.github.io/UX-design-system/. Astro applique ce préfixe (`base` dans
// astro.config.mjs) au routage, mais il ne réécrit pas les URLs qu'on écrit à la
// main : un `/icons/fleche.svg` laissé tel quel marche en local et renvoie un 404
// en ligne. Tout chemin absolu — asset de public/ comme lien vers une page — passe
// donc par ici.
//
// Le problème ne peut pas se régler à l'intérieur des composants : Button, Nav et
// Carousel reçoivent leurs icônes en props, la valeur vient toujours de l'appelant.

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return path.startsWith('/') ? base + path : `${base}/${path}`;
}
