import type { InjectionKey, Ref } from 'vue'

export interface CheckboxProps {
  modelValue?: boolean
  indeterminate?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  value?: unknown
  id?: string
  name?: string
  required?: boolean
  error?: boolean
  errorMsg?: string
  color?: string
  labelColor?: string
}

export interface CheckboxGroupProps {
  modelValue: unknown[]
  disabled?: boolean
  name?: string
}

export interface CheckboxGroupSlotProps {
  allChecked: boolean
  indeterminate: boolean
  toggleAll: () => void
}

export interface CheckboxGroupContext {
  selectedValues: Ref<unknown[]>
  toggle: (value: unknown) => void
  isChecked: (value: unknown) => boolean
  registerOption: (value: unknown) => void
  unregisterOption: (value: unknown) => void
  disabled: Ref<boolean>
  name: Ref<string | undefined>
}

export const CHECKBOX_GROUP_KEY: InjectionKey<CheckboxGroupContext> = Symbol('checkbox-group')
