# Tabs / Tab

可組合的 Tab 導航元件，支援受控/非受控模式、鍵盤操作（ARIA Tabs Pattern）、三種外觀模式。

## 基本用法

```vue
<Tabs default-value="home" label="主要導航">
  <Tab value="home" label="首頁">
    <p>首頁內容</p>
  </Tab>
  <Tab value="profile" label="個人資料">
    <p>個人資料內容</p>
  </Tab>
</Tabs>
```

## 受控模式

```vue
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('home')
</script>

<template>
  <Tabs v-model="active" label="主要導航">
    <Tab value="home" label="首頁"><p>首頁</p></Tab>
    <Tab value="profile" label="個人資料"><p>個人資料</p></Tab>
  </Tabs>
</template>
```

## 外觀模式

```vue
<!-- underline（預設） -->
<Tabs type="underline" default-value="a">...</Tabs>

<!-- border-card -->
<Tabs type="border" default-value="a">...</Tabs>

<!-- 無樣式 -->
<Tabs type="none" default-value="a">...</Tabs>
```

## 自訂 Tab Label

```vue
<Tab value="home">
  <template #label="{ active, disabled }">
    <span>🏠 首頁</span>
  </template>
  <p>首頁內容</p>
</Tab>
```

---

## Tabs Props

| Prop             | 型別                                | 預設值        | 說明                                                                                  |
| ---------------- | ----------------------------------- | ------------- | ------------------------------------------------------------------------------------- |
| `modelValue`     | `string \| undefined`               | `undefined`   | 受控模式：目前選中的 tab value（搭配 `v-model` 使用）                                 |
| `defaultValue`   | `string \| undefined`               | `undefined`   | 非受控模式：初始選中的 tab value                                                      |
| `disabled`       | `boolean`                           | `false`       | 停用整個 Tabs（所有 Tab 均不可點擊）                                                  |
| `label`          | `string \| undefined`               | `undefined`   | tablist 的 `aria-label`，建議提供以提升無障礙性                                       |
| `activationMode` | `'auto' \| 'manual'`                | `'auto'`      | 鍵盤導航模式：`auto` 移焦即切換；`manual` 需 Enter/Space 確認                         |
| `activeColor`    | `string \| undefined`               | `undefined`   | 覆蓋 active 指示器顏色（任意 CSS 色彩字串）；未設定時使用 `--rui-color-tab-indicator` |
| `type`           | `'underline' \| 'border' \| 'none'` | `'underline'` | Tab 外觀模式                                                                          |

## Tabs Emits

| 事件                | Payload                      | 說明                                       |
| ------------------- | ---------------------------- | ------------------------------------------ |
| `update:modelValue` | `value: string \| undefined` | 選中 tab 變更時觸發（受控/非受控均會發出） |

---

## Tab Props

| Prop       | 型別      | 預設值  | 說明                                             |
| ---------- | --------- | ------- | ------------------------------------------------ |
| `value`    | `string`  | —       | **必填**。唯一識別鍵，對應 Tabs 的 `modelValue`  |
| `label`    | `string`  | `''`    | Tab 按鈕顯示文字，可被 `#label` scoped slot 覆寫 |
| `disabled` | `boolean` | `false` | 停用此 Tab                                       |

---

## Slots

### Tabs

| Slot      | 說明                                       |
| --------- | ------------------------------------------ |
| `default` | 放置 `<Tab>` 子元件，panel 內容隨 Tab 定義 |

### Tab

| Slot      | Slot Props                               | 說明                                   |
| --------- | ---------------------------------------- | -------------------------------------- |
| `default` | —                                        | Tab 面板內容                           |
| `label`   | `{ active: boolean, disabled: boolean }` | 自訂 Tab 按鈕標籤，優先於 `label` prop |

---

## Design Tokens

| Token                         | 預設值                            | 用途                 |
| ----------------------------- | --------------------------------- | -------------------- |
| `--rui-color-tab-indicator`   | `var(--rui-color-default)`        | underline 指示器顏色 |
| `--rui-color-tab-hover`       | `var(--rui-color-surface-hover)`  | Tab hover 背景       |
| `--rui-color-tab-text`        | `var(--rui-color-text-secondary)` | 未選中 Tab 文字色    |
| `--rui-color-tab-text-active` | `var(--rui-color-text-primary)`   | 選中 Tab 文字色      |
| `--rui-color-tab-border`      | `var(--rui-color-border)`         | border 模式邊框色    |

`activeColor` prop 傳入時，會透過 CSS variable `--rui-color-tab-indicator` 的 inline override 生效，僅影響當前 active tab 的指示器顏色。
