export interface ModalProps {
  /** 受控模式：控制 Modal 開/關；undefined 代表非受控模式 */
  modelValue?: boolean
  /** 非受控模式：初始是否開啟，預設 false */
  defaultOpen?: boolean
  /** 標題文字；header slot 存在時此 prop 被忽略 */
  title?: string
  /** 補充說明文字（對應 aria-describedby），不顯示在視覺上 */
  description?: string
  /** Panel 寬度，預設 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** 是否顯示右上角關閉按鈕，預設 true */
  showCloseButton?: boolean
  /** 點擊 Modal 外部是否關閉 Modal，預設 true */
  closeOnClickOutside?: boolean
  /** 按下 Escape 鍵是否關閉 Modal，預設 true */
  closeOnEscape?: boolean
  /** 是否將 Tab 焦點限制在 Panel 內，預設 true */
  trapFocus?: boolean
  /** 關閉後是否將焦點還原至觸發元素，預設 true */
  restoreFocus?: boolean
  /** 開啟時是否鎖住 body scroll（iOS Safari 相容方案），預設 true */
  lockScroll?: boolean
  /** Teleport 目標，預設 'body' */
  teleportTo?: string | HTMLElement
  /** Panel 背景顏色（任意 CSS 色彩值，預設使用 --rui-color-modal-bg token） */
  bgColor?: string
  /** Panel 文字顏色（任意 CSS 色彩值，預設使用 --rui-color-modal-text token） */
  textColor?: string
  /** Panel 邊框與分隔線顏色（任意 CSS 色彩值，預設使用 --rui-color-modal-border token） */
  borderColor?: string
}
