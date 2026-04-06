---
description: 'Use when writing, editing, or reviewing Vue components. Covers Composition API, script setup, props/emits typing, slots, component API design, and Vue 3 best practices for a UI library.'
applyTo: '**/*.vue'
---

# Vue 元件開發規範

## 基礎結構

- 一律使用 `<script setup lang="ts">`，禁止 Options API 和 `defineComponent`
- 區塊順序：`<template>` → `<script setup>` → `<style scoped>`
- 每個檔案只包含一個元件

```vue
<script setup lang="ts">
// imports → defineOptions → defineProps → defineEmits → composables → logic
</script>

<template>
  <!-- 單一根元素或 Fragment -->
</template>

<style scoped>
/* 僅限無法用 Tailwind 完成的樣式 */
</style>
```

## Props 設計

- 使用 `withDefaults(defineProps<Props>(), {...})` 定義，必須提供完整 TypeScript 型別
- boolean props 使用形容詞，不加 `is` 前綴：`disabled`、`loading`、`readonly`（除非語意不清）
- 提供 `size` 等枚舉型 prop 時，使用 union type 而非 enum
- 顏色樣式可由使用者透過 prop 傳入任意 CSS 色彩字串控制；若元件同時提供 design token 預設值，文件需清楚標示預設行為
- 所有非必填 props 都必須在 `withDefaults` 中提供明確預設值；optional (`?`) 只代表呼叫端可省略，不能取代 runtime 預設值

```ts
interface Props {
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  loading: false,
})
```

## Emits 設計

- 使用 `defineEmits<{...}>()` 型別語法
- 事件名稱使用 camelCase（模板中自動轉為 kebab-case）
- 雙向綁定使用 `update:modelValue` 模式
- 事件不加 `on` 前綴（由 Vue 自動處理）

```ts
const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string, event: Event]
  focus: []
  blur: []
}>()
```

## Slots 設計

- 預設行為優先用 default slot，不要強迫使用者傳 props 給純顯示內容
- 需要傳遞資料給使用者時使用 scoped slot
- 提供 slot 時必須在 story 的 `argTypes` 補充說明
- 不要同時暴露過多 named slot，保持 API 精簡

```vue
<!-- 優先 -->
<slot />

<!-- 需要傳資料時 -->
<slot :item="item" :index="index" />
```

## 圖示使用

- 禁止在 `<template>` 內直接撰寫 inline `<svg>`
- 所有圖示一律以 `.svg` 檔存放於 `src/assets/icons/`，並透過 `Icon` 元件引用
- 新增圖示時先確認 `src/assets/icons/` 內是否已有同功能圖示，避免重複

```vue
<!-- 禁止 -->
<svg viewBox="0 0 16 16">...</svg>

<!-- 正確 -->
<Icon name="chevron-down" :size="16" aria-hidden="true" />
```

## Expose

- 預設不 expose 任何內部狀態
- 僅在元件需要提供命令式 API 時使用 `defineExpose`（如 `focus()`、`scrollTo()`）
- Exposed 方法必須有明確的函式型別

```ts
defineExpose({
  focus: () => inputRef.value?.focus(),
})
```

## 響應式

- 優先使用 `computed` 而非 `watch` 進行衍生狀態計算
- `watch` 只用於副作用（API 呼叫、DOM 操作）
- 避免深層 `reactive`，優先使用多個 `ref`
- 不要在 `<template>` 內執行複雜邏輯，提取為 `computed`

## 向後相容

- 移除 prop 前先標記為棄用（在 TypeScript 型別加上 `@deprecated` JSDoc）
- 不在 patch/minor 版本中做 breaking change
- 新增的非必填 prop 必須提供預設值，確保現有使用者不受影響
