// url=https://www.figma.com/design/uQ5j90wu2MJSvzsN3Oc0pT/UX-design-system?node-id=854-41729
// source=design-system/src/components/Button.astro
// component=Button
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('label')

const variant = instance.getEnum('variant', {
  primary: 'primary',
  secondary: 'secondary',
  alert: 'alert',
  ghost: 'ghost',
  rose: 'rose',
  sun: 'sun',
  clay: 'clay',
  teal: 'teal',
  accent: 'accent',
  highlight: 'highlight',
  neutral: 'neutral',
})

const size = instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' })

// `state` (default, hover, pressed, disabled, focus) n'a pas de prop : ce sont des états CSS.

// Dans le code, une icône est un nom (IconName), pas un composant : on lit donc
// le nom de l'instance posée, sans passer par executeTemplate().
const icon = instance.getBoolean('icon?') ? instance.getInstanceSwap('icon') : undefined
const iconName = icon && icon.type === 'INSTANCE' ? icon.name : undefined

const iconEnd = instance.getBoolean('iconEnd?') ? instance.getInstanceSwap('iconEnd') : undefined
const iconEndName = iconEnd && iconEnd.type === 'INSTANCE' ? iconEnd.name : undefined

export default {
  example: figma.code`<Button variant="${variant}" size="${size}"${iconName ? figma.code` icon="${iconName}"` : ''}${iconEndName ? figma.code` iconEnd="${iconEndName}"` : ''}>${label}</Button>`,
  imports: ['import Button from "ux-design-system/components/Button.astro"'],
  id: 'button',
  metadata: { nestable: true },
}
