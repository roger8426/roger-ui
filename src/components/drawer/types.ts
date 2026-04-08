export interface DrawerProps {
  modelValue?: boolean
  defaultOpen?: boolean
  placement?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg'
  title?: string
  description?: string
  showCloseButton?: boolean
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  trapFocus?: boolean
  restoreFocus?: boolean
  lockScroll?: boolean
  teleportTo?: string | HTMLElement
  bgColor?: string
  textColor?: string
  borderColor?: string
}
