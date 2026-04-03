export interface CardProps {
  /** 陰影濃度，預設 'md' */
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  /** 內距（px），預設 16 */
  padding?: number
  /** 圓角（px 數值，或 'full' 表示完整圓形），預設 12 */
  radius?: number | 'full'
  /** 背景顏色（任意 CSS 色彩值，預設使用 --rui-color-card-bg token） */
  bgColor?: string
  /** hover 時是否顯示上浮效果，shadow: 'none' 時僅有位移無陰影增強 */
  hoverable?: boolean
}
