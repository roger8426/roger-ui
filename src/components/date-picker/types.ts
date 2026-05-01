export type DatePickerMode = 'single' | 'range' | 'multiple' | 'datetime'

export type DateRange = [Date | null, Date | null]

export type DatePickerModelValue = Date | null | DateRange | Date[]

export interface DatePickerLocale {
  /** 月份名稱（長度 12，1 月～12 月） */
  months: readonly string[]
  /** 一週短名（長度 7，星期日 ~ 星期六） */
  weekdaysShort: readonly string[]
  /** 「今天」按鈕文字 */
  todayLabel: string
  /** 「清除」按鈕文字 */
  clearLabel: string
  /** 「確定」按鈕文字 */
  confirmLabel: string
}

export const DEFAULT_LOCALE_ZH_TW: DatePickerLocale = {
  months: [
    '1 月',
    '2 月',
    '3 月',
    '4 月',
    '5 月',
    '6 月',
    '7 月',
    '8 月',
    '9 月',
    '10 月',
    '11 月',
    '12 月',
  ],
  weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
  todayLabel: '今天',
  clearLabel: '清除',
  confirmLabel: '確定',
}

export interface DatePickerExpose {
  /** 將焦點移至 trigger（inline 模式時為月曆容器） */
  focus: () => void
  /** 開啟 popover（inline 模式無作用） */
  open: () => void
  /** 關閉 popover（inline 模式無作用） */
  close: () => void
}

export interface DatePickerProps {
  /** trigger 元素 id，用於關聯外部 <label> */
  id?: string
  /** v-model 綁定值，型別依 mode 不同：
   * - single / datetime → Date | null
   * - range → [Date | null, Date | null]
   * - multiple → Date[]
   */
  modelValue?: DatePickerModelValue
  /** 選擇模式 */
  mode?: DatePickerMode
  /** 元件尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 佔位文字 */
  placeholder?: string
  /** 是否停用 */
  disabled?: boolean
  /** 是否唯讀 */
  readonly?: boolean
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
  /** 顯示與解析格式。預設：single/range/multiple = 'YYYY-MM-DD'，datetime = 'YYYY-MM-DD HH:mm' */
  format?: string
  /** 可選最小日期（含當日） */
  minDate?: Date
  /** 可選最大日期（含當日） */
  maxDate?: Date
  /** 自訂判斷某日期是否禁用 */
  disabledDate?: (date: Date) => boolean
  /** 一週起始日，0 = 週日，1 = 週一，預設 1 */
  firstDayOfWeek?: 0 | 1
  /** 本地化文字，預設 zh-TW */
  locale?: DatePickerLocale
  /** 是否可清除已選日期 */
  clearable?: boolean
  /** datetime 模式分鐘步進，預設 1 */
  minuteStep?: number
  /** 永遠展開月曆，不渲染 trigger / popover */
  inline?: boolean
  /**
   * popover Teleport 目標。預設 'body'，避免被祖先 overflow 裁切（如 Modal）。
   * 傳 false 維持內嵌渲染。
   */
  teleport?: boolean | string | HTMLElement
  /**
   * popover 開啟方向。'auto' 在底部空間不足時自動向上翻轉。
   * @default 'auto'
   */
  placement?: 'bottom' | 'top' | 'auto'
}
