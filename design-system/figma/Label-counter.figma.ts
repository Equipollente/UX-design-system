/// <reference types="@figma/code-connect/figma-types" />
// url=https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=1046-33241
// source=design-system/src/components/LabelCounter.astro
// component=LabelCounter
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('label')

const variant = instance.getEnum('variant', {
  primary: 'primary',
  secondary: 'secondary',
  danger: 'danger',
  rose: 'rose',
  sun: 'sun',
  clay: 'clay',
  teal: 'teal',
  highlight: 'highlight',
  neutral: 'neutral',
  info: 'info',
  warning: 'warning',
})

const size = instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' })

// L'icône n'est pas reprise : dans le code c'est un nom (icon="book-open"), et Figma ne
// donne ici que le nom du calque ("Icon"), pas celui du composant. Mieux vaut l'omettre
// qu'afficher un nom faux — celui qui code pose l'icône lui-même.

export default {
  example: figma.code`<LabelCounter label="${label}" variant="${variant}" size="${size}" />`,
  imports: ['import LabelCounter from "ux-design-system/components/LabelCounter.astro"'],
  id: 'label-counter',
  metadata: { nestable: true },
}
