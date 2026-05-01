export type SelectValue = string | number
export type SelectModelValue = SelectValue | SelectValue[] | null

export interface SelectOption {
  /** 選項值 */
  value: SelectValue
  /** 顯示文字 */
  label: string
  /** 是否停用此選項 */
  disabled?: boolean
}

export interface SelectOptionGroup {
  /** 群組標題 */
  group: string
  /** 群組內選項 */
  options: readonly SelectOption[]
}

export type SelectItem = SelectOption | SelectOptionGroup

/** 判斷 SelectItem 是否為群組 */
export function isGroup(item: SelectItem): item is SelectOptionGroup {
  return 'group' in item
}

export interface SelectExpose {
  /** 將焦點移至 Select 控制項（若為 searchable 且展開中則聚焦搜尋欄） */
  focus: () => void
}

export interface SelectProps {
  /** input 元素 id，用於關聯外部 <label> */
  id?: string
  /**
   * v-model 綁定值。
   * - 單選：`SelectValue | null`
   * - 多選（multiple = true）：請傳 `SelectValue[]`
   *
   * 注意：型別為 union 放寬，TS 不會在編譯期檢查與 multiple 一致性，請自行為 ref 標註正確型別。
   */
  modelValue?: SelectModelValue
  /** 選項列表，支援 SelectOption 或 SelectOptionGroup */
  options?: readonly SelectItem[]
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
  /** 下拉面板背景顏色（任意 CSS 色彩值，預設使用 --rui-color-select-bg token） */
  dropdownBg?: string
  /** 選項 hover / keyboard focus 背景顏色（任意 CSS 色彩值，預設使用 --rui-color-surface-hover token） */
  optionHoverColor?: string
  /** 已選中選項的背景顏色（任意 CSS 色彩值，預設使用 --rui-color-select-selected token） */
  optionSelectedColor?: string
  /** 下拉選單是否顯示捲軸（仍可滾動，僅控制視覺） */
  showScrollbar?: boolean
  /**
   * 下拉清單 Teleport 目標。預設 'body'，避免被祖先 overflow 裁切（如 Modal）。
   * 傳 false 維持內嵌渲染（用於需要 listbox 留在原 DOM 結構內的情境）。
   */
  teleport?: boolean | string | HTMLElement
  /**
   * 下拉開啟方向。'auto' 在底部空間不足時自動向上翻轉。
   * @default 'auto'
   */
  placement?: 'bottom' | 'top' | 'auto'
  /**
   * 是否多選；啟用後 modelValue 應為陣列。
   * @default false
   */
  multiple?: boolean
  /** 多選最多可選數量；達上限後其餘未選選項以 disabled 樣式呈現並阻擋點擊 */
  maxSelected?: number
  /**
   * 多選 trigger 顯示格式
   * - 'chips'：以 chip 列出已選 label（預設），固定高度時超出以 +N 截斷
   * - 'count'：顯示「已選 N 項」
   * - 'comma'：以 ", " 串接 label
   * @default 'chips'
   */
  multipleDisplay?: 'chips' | 'count' | 'comma'
}
