import './assets/styles/main.css'

export { default as Button } from './components/button/Button.vue'
export type { ButtonProps } from './components/button/types'

export { default as Input } from './components/input/Input.vue'
export type { InputProps } from './components/input/types'

export { default as Select } from './components/select/Select.vue'
export type {
  SelectProps,
  SelectOption,
  SelectOptionGroup,
  SelectItem,
} from './components/select/types'

export { default as Icon } from './components/icon/Icon.vue'
export type { IconProps } from './components/icon/types'

export { default as TextArea } from './components/textarea/TextArea.vue'
export type { TextAreaProps } from './components/textarea/types'

export { default as Badge } from './components/badge/Badge.vue'
export type { BadgeProps } from './components/badge/types'

export { default as Card } from './components/card/Card.vue'
export type { CardProps } from './components/card/types'

export { default as Accordion } from './components/accordion/Accordion.vue'
export { default as AccordionItem } from './components/accordion/AccordionItem.vue'
export type { AccordionProps, AccordionItemProps } from './components/accordion/types'

export { default as Modal } from './components/modal/Modal.vue'
export type { ModalProps } from './components/modal/types'

export { default as Checkbox } from './components/checkbox/Checkbox.vue'
export { default as CheckboxGroup } from './components/checkbox/CheckboxGroup.vue'
export type {
  CheckboxProps,
  CheckboxGroupProps,
  CheckboxGroupSlotProps,
} from './components/checkbox/types'
