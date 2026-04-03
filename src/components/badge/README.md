# Badge

徽章元件，可用於顯示計數、狀態標籤或圓點提示，支援 outline 模式與自訂顏色。

## 使用範例

```vue
<!-- 計數模式 -->
<Badge :value="5" />
<Badge :value="100" :max="99" />

<!-- 標籤模式（無 value，使用 slot） -->
<Badge>New</Badge>
<Badge>熱門</Badge>

<!-- 圓點模式 -->
<Badge dot />
<Badge dot size="lg" />

<!-- Outline 模式 -->
<Badge :value="3" outline />

<!-- 自訂顏色 -->
<Badge :value="2" bgColor="oklch(55% 0.2 15)" textColor="white" />

<!-- 自訂尺寸與圓角 -->
<Badge :value="7" size="lg" :radius="4" />
```

## Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `value` | `number` | — | 計數值；存在時進入計數模式並顯示數字 |
| `max` | `number` | `99` | 計數上限，超過時顯示 `"{max}+"` |
| `dot` | `boolean` | `false` | 圓點模式（不顯示文字，僅渲染固定尺寸圓點）；與 `value` 同時設定時優先 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 元件尺寸 |
| `outline` | `boolean` | `false` | Outline 模式（透明背景、主色邊框與文字） |
| `bgColor` | `string` | — | 背景顏色（任意 CSS 色彩值）；outline 模式忽略此值，固定為透明 |
| `textColor` | `string` | — | 文字顏色（任意 CSS 色彩值） |
| `borderColor` | `string` | — | 邊框顏色（任意 CSS 色彩值） |
| `radius` | `number \| 'full'` | `'full'` | 圓角半徑（px 數值或 `'full'` 表示膠囊形） |

## Slots

| Slot | 說明 |
|------|------|
| `default` | 標籤文字（僅在未傳入 `value` 且非 `dot` 模式時渲染） |

## 預設顏色

| 使用情境 | 預設值 |
|----------|--------|
| 一般模式背景 | `var(--rui-color-default)` |
| 一般模式文字 | `var(--rui-color-default-foreground)` |
| Outline 模式背景 | 透明 |
| Outline 模式文字 | `var(--rui-color-default)` |
| Outline 模式邊框 | `var(--rui-color-default)` |

## 無障礙

- 計數模式下自動加上 `role="status"` 與 `aria-label="N 則通知"`，螢幕閱讀器可朗讀數量。
- 圓點模式與純標籤模式不帶語意角色，視為裝飾性元素。
