# Button

通用按鈕元件，支援自訂顏色、尺寸、圓角、outline 模式與停用狀態。

## 使用範例

```vue
<Button>送出</Button>
<Button outline>取消</Button>
<Button bgColor="oklch(58% 0.22 15)" textColor="white">刪除</Button>
<Button size="lg">大按鈕</Button>
<Button :radius="8">輕圓角</Button>
<Button :radius="0">方形</Button>
<Button disabled>停用</Button>
```

## Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML type 屬性 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `radius` | `number \| 'full'` | `'full'` | 圓角半徑（px 數值或 `'full'` 表示完整圓形） |
| `outline` | `boolean` | `false` | Outline 模式（邊框樣式，預設透明背景） |
| `bgColor` | `string` | — | 背景顏色（任意 CSS 色彩值）；outline 模式忽略此值，固定為透明 |
| `textColor` | `string` | — | 文字顏色（任意 CSS 色彩值） |
| `borderColor` | `string` | — | 邊框顏色（任意 CSS 色彩值） |
| `loading` | `boolean` | `false` | 載入中狀態（自動鎖定互動、顯示 spinner） |
| `disabled` | `boolean` | `false` | 是否停用 |

## Slots

| Slot | 說明 |
|------|------|
| `default` | 按鈕內容 |

## 預設顏色

| 使用情境 | 預設值 |
|----------|--------|
| 一般模式背景 | `var(--rui-color-default)` |
| 一般模式文字 | `var(--rui-color-default-foreground)` |
| 一般模式邀框 | 無 |
| Outline 模式背景 | 透明 |
| Outline 模式文字 | `var(--rui-color-default)` |
| Outline 模式邀框 | `var(--rui-color-default)` |
