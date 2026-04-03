import type { InjectionKey } from 'vue'

export interface AccordionProps {
  /** 受控模式：目前展開的 item value（單選傳 string，多選傳 string[]） */
  modelValue?: string | string[]
  /** 非受控模式：初始展開的 item value */
  defaultValue?: string | string[]
  /** 是否允許同時展開多個 item，預設 false */
  multiple?: boolean
  /** 是否停用整個 accordion，預設 false */
  disabled?: boolean
  /**
   * 已展開的 item 是否可再次點擊收合（僅在 multiple: false 時有效），預設 true
   */
  collapsible?: boolean
}

export interface AccordionItemProps {
  /** 唯一識別鍵，且不可含空格。 */
  value: string
  /** Header 文字（可被 #title slot 覆寫） */
  title?: string
  /** 停用此 item，預設 false */
  disabled?: boolean
}

export interface AccordionContext {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
  disabled: boolean
}

export const ACCORDION_CONTEXT_KEY: InjectionKey<AccordionContext> = Symbol('accordion')
