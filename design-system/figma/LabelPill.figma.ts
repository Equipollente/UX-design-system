// url=https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=1046-30984
// source=design-system/src/components/LabelPill.astro
// component=LabelPill
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('label')

const emphasis = instance.getEnum('emphasis', { subtle: 'subtle', bold: 'bold' })

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
  warning: 'warning',
  success: 'success',
  info: 'info',
})

const size = instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' })

export default {
  example: figma.code`<LabelPill label="${label}" variant="${variant}" emphasis="${emphasis}" size="${size}" />`,
  imports: ['import LabelPill from "ux-design-system/components/LabelPill.astro"'],
  id: 'label-pill',
  metadata: { nestable: true },
}
