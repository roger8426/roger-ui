export interface BadgeProps {
  /** 圓點模式（不顯示文字，僅渲染固定尺寸圓點） */
  dot?: boolean
  /** 計數值（存在時進入計數模式並顯示數字；與 dot 同時設定時 dot 優先） */
  value?: number
  /** 計數上限，超過時顯示 "{max}+"，預設 99 */
  max?: number
  /** 元件尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否為 outline 模式（透明背景、主色邊框與文字） */
  outline?: boolean
  /** 背景顏色（任意 CSS 色彩值，預設使用 --rui-color-default token；outline 模式忽略此值，固定為透明） */
  bgColor?: string
  /** 文字顏色（任意 CSS 色彩值；一般模式預設 --rui-color-default-foreground，outline 模式預設 --rui-color-default） */
  textColor?: string
  /** 邊框顏色（任意 CSS 色彩值，未設定則無邊框） */
  borderColor?: string
  /** 圓角半徑（px 數值，或 'full' 表示完整膠囊形），預設 'full' */
  radius?: number | 'full'
}
