export interface InputProps {
  /** input 元素 id，用於關聯外部 <label> */
  id?: string
  /** v-model 綁定值 */
  modelValue?: string
  /** input type */
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'tel'
  /** 元件尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 佔位文字 */
  placeholder?: string
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
  /** 邊框顏色 */
  borderColor?: string
  /** 文字顏色（任意 CSS 色彩值，預設繼承） */
  color?: string
}
