export interface ButtonProps {
  /** 按鈕文字 */
  label: string
  /** 外觀變體 */
  variant?: 'primary' | 'secondary'
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否停用 */
  disabled?: boolean
}
