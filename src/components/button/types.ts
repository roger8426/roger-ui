export interface ButtonProps {
  /** 背景顏色（任意 CSS 色彩值，預設使用 --color-primary token） */
  color?: string
  /** 文字顏色（任意 CSS 色彩值，預設白色） */
  textColor?: string
  /** 邊框顏色（任意 CSS 色彩值，未設定則無邊框） */
  borderColor?: string
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否為 outline 模式（透明背景、主色邊框與文字） */
  outline?: boolean
  /** 是否停用 */
  disabled?: boolean
}
