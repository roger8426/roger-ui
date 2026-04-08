export type TableSortOrder = 'asc' | 'desc'
export type TableColumnAlign = 'left' | 'center' | 'right'
export type TableRowKey = string | number

export interface TableColumnDef<T> {
  /** 對應資料物件的 key */
  key: keyof T & string
  /** 欄位標題 */
  label: string
  /** 是否可排序 */
  sortable?: boolean
  /** 是否凍結（sticky left），須搭配 width 使用 */
  frozen?: boolean
  /** 欄位寬度（CSS 值，如 '120px'），frozen 欄位必填 */
  width?: string
  /** 欄位對齊 */
  align?: TableColumnAlign
}

export interface TableRowGroup<T> {
  /** 分組標題 */
  group: string
  /** 分組內的資料列 */
  rows: readonly T[]
}

export type TableDataItem<T> = T | TableRowGroup<T>

export function isTableRowGroup<T>(item: TableDataItem<T>): item is TableRowGroup<T> {
  return typeof item === 'object' && item !== null && 'group' in item && 'rows' in item
}

export interface TableProps<T extends Record<string, unknown>> {
  /** 表格可存取名稱，渲染為 <caption class="sr-only">（供螢幕閱讀器識別） */
  caption?: string
  /** 欄位定義 */
  columns: TableColumnDef<T>[]
  /** 資料列，可混用普通列與分組列 */
  rows: readonly TableDataItem<T>[]
  /** 唯一識別資料列的 key */
  rowKey: keyof T & string
  /** 目前排序的欄位 key */
  sortKey?: string
  /** 目前排序方向 */
  sortOrder?: TableSortOrder
  /** 是否啟用 row 選取 */
  selectable?: boolean
  /** 已選取的 rowKey 值（v-model:selectedKeys） */
  selectedKeys?: TableRowKey[]
  /** 是否固定表頭 */
  stickyHeader?: boolean
  /** 表格容器最大高度（CSS 值，stickyHeader 時有效） */
  maxHeight?: string
  /** 載入中狀態 */
  loading?: boolean
  /** 無資料時的提示文字 */
  emptyText?: string
}

export interface TableEmits<T extends Record<string, unknown>> {
  sort: [key: string, order: TableSortOrder | null]
  'update:selectedKeys': [keys: TableRowKey[]]
  rowClick: [row: T]
}
