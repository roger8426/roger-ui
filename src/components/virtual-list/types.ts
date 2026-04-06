export interface VirtualListProps<T> {
  /** 資料陣列，泛型 T 由傳入值自動推導 */
  items: T[]
  /** 每個項目在捲動軸上的固定尺寸（px）；垂直方向 = 高度，水平方向 = 寬度 */
  itemSize: number
  /** 捲動方向，預設垂直 */
  direction?: 'vertical' | 'horizontal'
  /** 可視區域外預先渲染的緩衝項目數，預設 3 */
  overscan?: number
  /** 指定產生 :key 的欄位名稱；未設定時會為物件項目建立穩定 key，原始型別則依值與出現順序產生 key */
  keyField?: keyof T
  /** 距離捲動末端多少 px 時觸發 reach-end 事件，預設 0 */
  threshold?: number
  /** true 時抑制重複 reach-end emit，直至 items 長度增加後自動重置 */
  loading?: boolean
  /** 整個列表的無障礙標籤 */
  ariaLabel?: string
}

export interface VirtualListEmits {
  /** 捲動時觸發，回傳目前捲動偏移量（px） */
  scroll: [offset: number, event: Event]
  /** 捲動至接近末端時觸發（由 threshold 控制觸發時機） */
  'reach-end': []
}

export interface VirtualListExpose {
  /** 捲動至指定 index 的項目 */
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void
  /** 捲動至指定偏移量（px） */
  scrollToOffset: (offset: number, behavior?: ScrollBehavior) => void
}
