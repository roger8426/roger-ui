export type ToggleSize = 'sm' | 'md' | 'lg'

export interface ToggleExpose {
  /** 將焦點移至內部 switch 元素 */
  focus: () => void
}

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
