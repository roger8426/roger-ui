# Input

文字輸入框元件，支援多種 input type、尺寸、錯誤狀態與前後綴插槽。

## 使用範例

```vue
<Input v-model="value" placeholder="請輸入..." />
<Input v-model="value" size="lg" />
<Input v-model="value" :error="true" errorMsg="此欄位為必填" />
<Input v-model="value" type="password" />
<Input v-model="value" disabled />
<Input v-model="value" readonly />

<!-- 前後綴插槽 -->
<Input v-model="value">
  <template #prefix>$</template>
  <template #suffix>.00</template>
</Input>
```

## Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `id` | `string` | — | input 元素 id，用於關聯外部 `<label>` |
| `modelValue` | `string` | `''` | v-model 綁定值 |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'search' \| 'url' \| 'tel'` | `'text'` | input type |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `placeholder` | `string` | `''` | 佔位文字 |
| `disabled` | `boolean` | `false` | 是否停用 |
| `readonly` | `boolean` | `false` | 是否唯讀 |
| `error` | `boolean` | `false` | 是否為錯誤狀態 |
| `errorMsg` | `string` | `''` | 錯誤訊息文字（傳入時自動啟用 error 狀態） |
| `border` | `boolean` | `true` | 是否顯示邊框 |
| `borderColor` | `string` | — | 邊框顏色（任意 CSS 色彩值） |
| `color` | `string` | — | 文字顏色（任意 CSS 色彩值，預設繼承） |

## Emits

| 事件 | 說明 |
|------|------|
| `update:modelValue` | 輸入值變更（v-model） |
| `change` | 輸入完成並失焦時觸發，payload: `(value, event)` |
| `focus` | 取得焦點時觸發 |
| `blur` | 失去焦點時觸發 |

## Slots

| Slot | 說明 |
|------|------|
| `prefix` | 輸入框左側內容（如圖示、單位符號） |
| `suffix` | 輸入框右側內容（如圖示、單位符號） |

## Expose

| 方法 | 說明 |
|------|------|
| `focus()` | 程式化聚焦至 input 元素 |
