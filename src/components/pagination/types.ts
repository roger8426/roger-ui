export interface PaginationProps {
  /** 資料總筆數 */
  total: number
  /** 每頁筆數，預設 10 */
  pageSize?: number
  /** 目前所在頁碼（從 1 開始），支援 v-model */
  currentPage?: number
  /** 頁碼視窗顯示的頁碼數量，預設 5 */
  visiblePages?: number
  /** 是否為頁碼按鈕顯示外框 */
  border?: boolean
  /** 頁碼顏色，同時套用於 active 文字與外框（任意 CSS 色彩值） */
  color?: string
}

export interface PaginationEmits {
  'update:currentPage': [page: number]
  change: [page: number]
}
