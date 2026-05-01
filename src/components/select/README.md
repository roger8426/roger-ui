# Select

下拉選單元件，支援單選、多選、可搜尋、分組選項、鍵盤導航與錯誤狀態。

## 基本用法

```vue
<Select v-model="value" :options="options" />
```

## Props

| Prop              | 型別                                               | 預設值        | 說明                                                                        |
| ----------------- | -------------------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `modelValue`      | `string \| number \| (string \| number)[] \| null` | `null`        | v-model 綁定值；多選時請傳陣列                                              |
| `options`         | `SelectItem[]`                                     | `[]`          | 選項列表，支援 `SelectOption` 或 `SelectOptionGroup`                        |
| `size`            | `'sm' \| 'md' \| 'lg'`                             | `'md'`        | 元件尺寸                                                                    |
| `placeholder`     | `string`                                           | `'請選擇...'` | 未選取時的佔位文字                                                          |
| `searchable`      | `boolean`                                          | `false`       | 是否可搜尋/過濾選項                                                         |
| `disabled`        | `boolean`                                          | `false`       | 是否停用                                                                    |
| `error`           | `boolean`                                          | `false`       | 是否為錯誤狀態                                                              |
| `errorMsg`        | `string`                                           | `''`          | 錯誤訊息（傳入時自動啟用 error 狀態）                                       |
| `border`          | `boolean`                                          | `true`        | 是否顯示邊框                                                                |
| `showScrollbar`   | `boolean`                                          | `false`       | 下拉選單是否顯示捲軸（仍可滾動，僅控制視覺）                                |
| `borderColor`     | `string`                                           | —             | 邊框顏色（任意 CSS 色彩值，預設使用 `--rui-color-default` token）           |
| `color`           | `string`                                           | —             | 文字顏色（任意 CSS 色彩值，預設繼承）                                       |
| `dropdownBg`      | `string`                                           | —             | 下拉面板背景顏色（任意 CSS 色彩値，預設使用 `--rui-color-select-bg` token） |
| `multiple`        | `boolean`                                          | `false`       | 是否多選                                                                    |
| `maxSelected`     | `number`                                           | —             | 多選時最多可選數量；達上限後其餘未選選項以 disabled 樣式呈現                |
| `multipleDisplay` | `'chips' \| 'count' \| 'comma'`                    | `'chips'`     | 多選 trigger 顯示格式                                                       |
| `id`              | `string`                                           | —             | trigger 的 id，用於關聯外部 `<label>`                                       |

## Emits

| Event               | Payload                                            | 說明                                                             |
| ------------------- | -------------------------------------------------- | ---------------------------------------------------------------- |
| `update:modelValue` | `string \| number \| (string \| number)[] \| null` | 選取值變更（v-model）                                            |
| `change`            | `(value, option)`                                  | 選取值變更，附帶完整 option：單選為 `SelectOption`，多選為其陣列 |

## Expose

| 方法      | 說明                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| `focus()` | 聚焦元件（下拉選單展開且 searchable 為 true 時聚焦搜尋 input，否則聚焦 trigger） |

## 選項型別

```ts
// 一般選項
interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

// 群組選項
interface SelectOptionGroup {
  group: string
  options: SelectOption[]
}

type SelectItem = SelectOption | SelectOptionGroup
```

## 範例

### 基礎選單

```vue
<Select v-model="value" :options="options" />
```

### 可搜尋

```vue
<Select v-model="value" :options="options" searchable placeholder="搜尋或選擇..." />
```

### 分組選項

```vue
<Select
  v-model="value"
  :options="[
    { group: '亞洲', options: [{ value: 'tw', label: '台灣' }] },
    { group: '歐美', options: [{ value: 'us', label: '美國' }] },
  ]"
/>
```

### 錯誤狀態

```vue
<Select v-model="value" :options="options" error-msg="請選擇一個選項" />
```

### 多選

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 多選時請務必標註為陣列型別；TS 不會在編譯期保證 multiple 與 modelValue 一致
const tags = ref<string[]>([])
</script>

<template>
  <Select v-model="tags" :options="options" multiple />
</template>
```

#### 多選 + 搜尋

```vue
<Select v-model="tags" :options="options" multiple searchable />
```

可在搜尋輸入框中輸入關鍵字過濾，連續點選多個選項，dropdown 不會關閉。
搜尋框為空時按 `Backspace` 會移除最後一個已選項目。

> **顯示行為**：當 `multiple` 與 `searchable` 同時啟用時，trigger 不渲染個別 chip，而是顯示 `+N`（已選數量）以避免 chip 干擾輸入焦點與排版。`multipleDisplay` prop 在此組合下不生效。

#### 限制最多選取數量

```vue
<Select v-model="tags" :options="options" multiple :max-selected="3" />
```

選滿 `maxSelected` 個之後，其餘未選的選項會以 disabled 樣式顯示且無法點擊。

#### Trigger 顯示格式

```vue
<!-- chips（預設）：以 chip 列出已選 label，超出寬度時以 +N 截斷 -->
<Select v-model="tags" multiple multiple-display="chips" />

<!-- count：顯示「已選 N 項」 -->
<Select v-model="tags" multiple multiple-display="count" />

<!-- comma：以 ", " 串接 label -->
<Select v-model="tags" multiple multiple-display="comma" />
```

## 鍵盤操作

| 按鍵                              | 行為                                                             |
| --------------------------------- | ---------------------------------------------------------------- |
| `Enter` / `ArrowDown` / `ArrowUp` | 開啟下拉選單                                                     |
| `ArrowDown`                       | 移至下一個選項                                                   |
| `ArrowUp`                         | 移至上一個選項                                                   |
| `Enter`                           | 選取目前焦點選項（多選時為 toggle，不關閉 dropdown）             |
| `Space`                           | 多選模式下 toggle 焦點選項（searchable 時於 listbox 區域才生效） |
| `Backspace`                       | 多選 + searchable 且搜尋框為空時，移除最後一個已選項目           |
| `Escape` / `Tab`                  | 關閉下拉選單                                                     |
