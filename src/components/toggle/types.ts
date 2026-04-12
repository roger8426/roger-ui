export type ToggleSize = 'sm' | 'md' | 'lg'

export interface ToggleProps {
  modelValue?: boolean
  disabled?: boolean
  size?: ToggleSize
  id?: string
  name?: string
  required?: boolean
  color?: string
  ariaLabel?: string
}
