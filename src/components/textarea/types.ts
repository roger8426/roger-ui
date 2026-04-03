export interface TextAreaProps {
  /** textarea 元素 id，用於關聯外部 <label> */
  id?: string
  /** v-model 綁定值 */
  modelValue?: string
  /** 元件尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 佔位文字 */
  placeholder?: string
  /** 初始可見行數 */
  rows?: number
  /** auto-resize 的高度上限 CSS 值（如 '200px'）；未設定則無限撐高 */
  maxHeight?: string
  /** CSS resize handle，預設 'none'（與 auto-resize 並存）*/
  resize?: 'none' | 'vertical' | 'both'
  /** 是否停用 */
  disabled?: boolean
  /** 是否唯讀 */
  readonly?: boolean
  /** 是否為錯誤狀態（固定使用 --rui-color-error 警告色） */
  error?: boolean
  /** 錯誤訊息文字（傳入時自動啟用 error 狀態） */
  errorMsg?: string
  /** 是否顯示邊框 */
  border?: boolean
  /** 邊框顏色（任意 CSS 色彩值，預設 --rui-color-default） */
  borderColor?: string
  /** 文字顏色（任意 CSS 色彩值，預設繼承） */
  color?: string
  /** 最大字元數 */
  maxlength?: number
  /** 是否顯示字元計數（預設 false；建議搭配 maxlength 使用） */
  showCount?: boolean
}
