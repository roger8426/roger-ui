export interface ButtonProps {
  /** 按鈕的 HTML type 屬性 */
  type?: 'button' | 'submit' | 'reset'
  /** 背景顏色（任意 CSS 色彩值，預設使用 --color-default token；outline 模式忽略此值，固定為透明） */
  bgColor?: string
  /** 文字顏色（任意 CSS 色彩值，預設白色） */
  textColor?: string
  /** 邊框顏色（任意 CSS 色彩值，未設定則無邊框） */
  borderColor?: string
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 圓角半徑（px 數值，或 'full' 表示完整圓形），預設 'full' */
  radius?: number | 'full'
  /** 是否為 outline 模式（透明背景、主色邊框與文字） */
  outline?: boolean
  /** 是否顯示載入中狀態（自動鎖定互動、顯示 spinner） */
  loading?: boolean
  /** 是否停用 */
  disabled?: boolean
}
