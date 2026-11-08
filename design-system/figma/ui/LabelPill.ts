// Cible de l'interface « Connect components to code » de Figma, qui refuse le .astro.
// Aucune valeur ici : le type vient des props du vrai composant. Figma et le code ont la même
// forme (label, variant, emphasis, size), donc un seul nom suffit.
import type { ComponentProps } from 'astro/types'
import LabelPill from '../../src/components/LabelPill.astro'

export type LabelPillProps = ComponentProps<typeof LabelPill>
