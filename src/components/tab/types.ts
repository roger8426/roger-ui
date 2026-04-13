import type { InjectionKey } from 'vue'

export type TabActivationMode = 'auto' | 'manual'
export type TabType = 'underline' | 'border' | 'none'

export interface TabsProps {
  /** 受控模式：目前選中的 tab value */
  modelValue?: string
  /** 非受控模式：初始選中的 tab value */
  defaultValue?: string
  /** 停用整個 Tabs */
  disabled?: boolean
  /** tablist 的 aria-label */
  label?: string
  /** 鍵盤導航模式：auto 移焦即切換，manual 需 Enter/Space 確認 */
  activationMode?: TabActivationMode
  /** 覆蓋 active underline 顏色（任意 CSS 色彩字串） */
  activeColor?: string
  /** Tab 外觀模式：underline（預設）| border（border-card）| none（無樣式） */
  type?: TabType
  /** 啟用左右滑動手勢切換 tab */
  swipeable?: boolean
}

export interface TabProps {
  /** 唯一識別鍵 */
  value: string
  /** Tab 按鈕文字，可被 #label scoped slot 覆寫 */
  label?: string
  /** 停用此 tab */
  disabled?: boolean
}

export interface TabsContext {
  tablistId: string
  activeValue: string | undefined
  select: (value: string) => void
  disabled: boolean
  activationMode: TabActivationMode
  activeColor: string | undefined
  type: TabType
}

export const TABS_CONTEXT_KEY: InjectionKey<TabsContext> = Symbol('tabs')
