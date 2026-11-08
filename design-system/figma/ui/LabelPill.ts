// Cible de l'interface « Connect components to code » de Figma, qui refuse le .astro.
// Un seul fichier pour le composant, plusieurs noms dedans : chaque jeu de variantes Figma
// a le sien, comme « Button » et « ButtonDanger » dans la démo de la doc Figma.
// Aucune valeur ici : les types viennent des props du vrai composant.
import type { ComponentProps } from 'astro/types'
import LabelPill from '../../src/components/LabelPill.astro'

export type LabelPillProps = ComponentProps<typeof LabelPill>

/** Jeu Figma `Label-subtle` : fond clair, encre foncée. */
export type LabelSubtle = LabelPillProps & { emphasis?: 'subtle' }

/** Jeu Figma `Label-bold` : fond plein, encre claire. */
export type LabelBold = LabelPillProps & { emphasis: 'bold' }
