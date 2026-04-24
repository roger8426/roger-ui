export type ToastX = 'left' | 'center' | 'right'
export type ToastY = 'top' | 'center' | 'bottom'

export interface ToastProps {
  /** 受控模式：控制 Toast 顯示/隱藏；undefined 代表非受控模式 */
  modelValue?: boolean
  /** 非受控模式：初始是否顯示，預設 false */
  defaultOpen?: boolean
  /** 水平位置，預設 'center' */
  x?: ToastX
  /** 垂直位置，預設 'center' */
  y?: ToastY
  /** 自動關閉時間（毫秒），預設 3000；傳 0 代表不自動關閉 */
  duration?: number
  /** 是否顯示右上角關閉按鈕，預設 true */
  closable?: boolean
  /** 背景顏色（任意 CSS 色彩值），預設使用 --rui-color-toast-bg token */
  bgColor?: string
  /** 文字顏色（任意 CSS 色彩值），預設使用 --rui-color-toast-text token */
  textColor?: string
  /** 距離視窗邊緣的間距（px），預設 16 */
  offset?: number
  /** 同位置堆疊時，Toast 之間的間距（px），預設 8 */
  gap?: number
  /** Teleport 目標，預設 'body' */
  teleportTo?: string | HTMLElement
  /** 自訂 z-index，預設使用 --rui-z-toast token */
  zIndex?: number | string
}

export interface ToastEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}
