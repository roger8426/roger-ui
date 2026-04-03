# Select

下拉選單元件，支援單選、可搜尋、分組選項、鍵盤導航與錯誤狀態。

## 基本用法

```vue
<Select v-model="value" :options="options" />
```

## Props

| Prop | 型別 | 預設值 | 說明 |
|---|---|---|---|
| `modelValue` | `string \| number \| null` | `null` | v-model 綁定值 |
| `options` | `SelectItem[]` | `[]` | 選項列表，支援 `SelectOption` 或 `SelectOptionGroup` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 元件尺寸 |
| `placeholder` | `string` | `'請選擇...'` | 未選取時的佔位文字 |
| `searchable` | `boolean` | `false` | 是否可搜尋/過濾選項 |
| `disabled` | `boolean` | `false` | 是否停用 |
| `error` | `boolean` | `false` | 是否為錯誤狀態 |
| `errorMsg` | `string` | `''` | 錯誤訊息（傳入時自動啟用 error 狀態） |
| `border` | `boolean` | `true` | 是否顯示邊框 |
| `borderColor` | `string` | — | 邊框顏色（任意 CSS 色彩值，預設使用 `--rui-color-default` token） |
| `color` | `string` | — | 文字顏色（任意 CSS 色彩值，預設繼承） |
| `dropdownBg` | `string` | — | 下拉面板背景顏色（任意 CSS 色彩値，預設使用 `--rui-color-select-bg` token） |
| `id` | `string` | — | trigger 的 id，用於關聯外部 `<label>` |

## Emits

| Event | Payload | 說明 |
|---|---|---|
| `update:modelValue` | `string \| number \| null` | 選取值變更（v-model） |
| `change` | `(value, option)` | 選取值變更，附帶完整 option 物件 |

## Expose

| 方法 | 說明 |
|---|---|
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

## 鍵盤操作

| 按鍵 | 行為 |
|---|---|
| `Enter` / `ArrowDown` / `ArrowUp` | 開啟下拉選單 |
| `ArrowDown` | 移至下一個選項 |
| `ArrowUp` | 移至上一個選項 |
| `Enter` | 選取目前焦點選項 |
| `Escape` / `Tab` | 關閉下拉選單 |
