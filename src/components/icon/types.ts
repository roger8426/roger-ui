export interface IconProps {
  /** 圖示名稱，對應 assets/icons/{name}.svg */
  name: string
  /** 圖示尺寸（px），預設 20 */
  size?: number
  /** 圖示顏色（任意 CSS 色彩值），未設定則繼承父元素 currentColor */
  color?: string
}
