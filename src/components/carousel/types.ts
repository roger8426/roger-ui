export interface CarouselProps<T> {
  /** 輪播項目資料陣列，泛型 T 由傳入值自動推導 */
  items: T[]
  /** 受控模式：目前顯示的 slide index（0-based）  */
  modelValue?: number
  /** 是否使用淡入淡出切換動畫（預設為水平滑動） */
  fade?: boolean
  /** 是否啟用循環模式（首尾相接） */
  loop?: boolean
  /** 是否自動播放 */
  autoplay?: boolean
  /** 自動播放間隔（毫秒），預設 3000 */
  delay?: number
  /** 滑鼠 hover 時是否暫停自動播放 */
  pauseOnHover?: boolean
  /** 是否顯示前/後箭頭按鈕 */
  showArrows?: boolean
  /** 是否顯示分頁點（dots） */
  showDots?: boolean
  /** dot 的顏色（任意 CSS 色彩值，預設使用 --rui-carousel-dot-color token） */
  dotColor?: string
  /** 輪播區域的 aria-label，用於多輪播並存時的無障礙標示 */
  ariaLabel?: string
}

export interface CarouselEmits {
  /** v-model 同步：當前 slide index */
  'update:modelValue': [index: number]
  /** 每次 slide 切換時觸發，包含新舊 index */
  change: [index: number, prevIndex: number]
}
