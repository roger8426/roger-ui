export interface SelectOption {
  /** 選項值 */
  value: string | number
  /** 顯示文字 */
  label: string
  /** 是否停用此選項 */
  disabled?: boolean
}

export interface SelectOptionGroup {
  /** 群組標題 */
  group: string
  /** 群組內選項 */
  options: SelectOption[]
}

export type SelectItem = SelectOption | SelectOptionGroup

/** 判斷 SelectItem 是否為群組 */
export function isGroup(item: SelectItem): item is SelectOptionGroup {
  return 'group' in item
}

export interface SelectProps {
  /** input 元素 id，用於關聯外部 <label> */
  id?: string
  /** v-model 綁定值 */
  modelValue?: string | number | null
  /** 選項列表，支援 SelectOption 或 SelectOptionGroup */
  options?: SelectItem[]
  /** 元件尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 佔位文字 */
  placeholder?: string
  /** 是否可搜尋/過濾選項 */
  searchable?: boolean
  /** 是否停用 */
  disabled?: boolean
  /** 是否為錯誤狀態 */
  error?: boolean
  /** 錯誤訊息文字（傳入時自動啟用 error 狀態） */
  errorMsg?: string
  /** 是否顯示邊框 */
  border?: boolean
  /** 邊框顏色（任意 CSS 色彩值） */
  borderColor?: string
  /** 文字顏色（任意 CSS 色彩值，預設繼承） */
  color?: string
  /** 下拉面板背景顏色（任意 CSS 色彩值，預設使用 --color-select-bg token） */
  dropdownBg?: string
}
