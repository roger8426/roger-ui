# TextArea

多行文字輸入元件，支援自動高度調整、字元計數、錯誤狀態與前後綴插槽。

## 使用範例

```vue
<TextArea v-model="value" placeholder="請輸入..." />
<TextArea v-model="value" size="lg" :rows="5" />
<TextArea v-model="value" :error="true" errorMsg="此欄位為必填" />
<TextArea v-model="value" :maxlength="200" showCount />
<TextArea v-model="value" disabled />
<TextArea v-model="value" readonly />

<!-- 自動高度（垂直延展） -->
<TextArea v-model="value" resize="vertical" />

<!-- 高度上限限制 -->
<TextArea v-model="value" maxHeight="200px" />
```

## Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `id` | `string` | — | textarea 元素 id，用於關聯外部 `<label>` |
| `modelValue` | `string` | `''` | v-model 綁定值 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `placeholder` | `string` | `''` | 佔位文字 |
| `rows` | `number` | `3` | 初始可見行數 |
| `maxHeight` | `string` | — | auto-resize 的高度上限 CSS 值（如 `'200px'`）；未設定則無限撐高 |
| `resize` | `'none' \| 'vertical' \| 'both'` | `'none'` | CSS resize handle |
| `disabled` | `boolean` | `false` | 是否停用 |
| `readonly` | `boolean` | `false` | 是否唯讀 |
| `error` | `boolean` | `false` | 是否為錯誤狀態 |
| `errorMsg` | `string` | `''` | 錯誤訊息文字（傳入時自動啟用 error 狀態） |
| `border` | `boolean` | `true` | 是否顯示邊框 |
| `borderColor` | `string` | — | 邊框顏色（任意 CSS 色彩值，預設 `--rui-color-default`） |
| `color` | `string` | — | 文字顏色（任意 CSS 色彩值，預設繼承） |
| `maxlength` | `number` | — | 最大字元數 |
| `showCount` | `boolean` | `false` | 是否顯示字元計數（建議搭配 `maxlength` 使用） |

## Emits

| 事件 | 說明 |
|------|------|
| `update:modelValue` | 輸入值變更（v-model） |
| `change` | 輸入完成並失焦時觸發，payload: `(value, event)` |
| `focus` | 取得焦點時觸發 |
| `blur` | 失去焦點時觸發 |

## Expose

| 方法 | 說明 |
|------|------|
| `focus()` | 程式化聚焦至 textarea 元素 |
