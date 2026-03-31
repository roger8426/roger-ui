# Button

通用按鈕元件，支援自訂顏色、尺寸、outline 模式與停用狀態。

## 使用範例

```vue
<Button label="送出" />
<Button label="取消" outline />
<Button label="刪除" color="oklch(58% 0.22 15)" textColor="white" />
<Button label="大按鈕" size="lg" />
<Button label="停用" disabled />
```

## Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `label` | `string` | — | 按鈕文字（必填） |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `outline` | `boolean` | `false` | Outline 模式（透明背景、主色邊框與文字） |
| `color` | `string` | `var(--color-primary)` | 背景顏色（任意 CSS 色彩值） |
| `textColor` | `string` | `white` | 文字顏色（任意 CSS 色彩值） |
| `borderColor` | `string` | — | 邊框顏色（未設定則無邊框） |
| `disabled` | `boolean` | `false` | 是否停用 |

## Emits

| 事件 | 說明 |
|------|------|
| `press` | 按鈕被點擊時觸發 |

## 預設顏色

| 使用情境 | 色碼 |
|----------|------|
| 一般模式背景 | `var(--color-default)` |
| 一般模式文字 | `white` |
| Outline 模式邊框與文字 | `var(--color-default)` |
| Outline 模式背景 | 全透明 |
