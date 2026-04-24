# Toast

短暫通知元件，支援九宮格定位、自動消失、多個 Toast 於同一位置時自動垂直堆疊。

## 使用範例

### 基本用法（v-model）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Toast, Button } from 'roger-ui'

const show = ref(false)
</script>

<template>
  <Button @click="show = true">顯示通知</Button>
  <Toast v-model="show" x="right" y="top"> 操作成功！ </Toast>
</template>
```

### 位置

`x` 接受 `'left' | 'center' | 'right'`（預設 `'center'`），`y` 接受 `'top' | 'center' | 'bottom'`（預設 `'center'`）。

```vue
<Toast v-model="show" x="right" y="bottom">右下角</Toast>
```

### 不自動關閉

傳 `duration="0"` 表示不自動關閉，使用者需要按右上角 X 手動關閉（`closable` 預設 `true`）。

```vue
<Toast v-model="show" :duration="0">需手動關閉</Toast>
```

### 不顯示關閉按鈕

```vue
<Toast v-model="show" :closable="false" :duration="5000">
  5 秒後自動消失
</Toast>
```

### 自訂背景 / 文字色

`bgColor` / `textColor` 接任意 CSS 色彩值，未指定時使用 token。

```vue
<Toast v-model="show" bg-color="oklch(55% 0.2 264)" text-color="white">
  成功提示
</Toast>
```

### 自動堆疊

於 `v-for` 同時渲染多個 Toast 在同 `x/y` 位置時，會自動依開啟順序垂直堆疊，並在關閉後自動補位。

```vue
<script setup lang="ts">
const items = ref<Array<{ id: number; text: string }>>([])
let seq = 0
function push(text: string) {
  items.value.push({ id: ++seq, text })
}
function remove(id: number) {
  items.value = items.value.filter((it) => it.id !== id)
}
</script>

<template>
  <Button @click="push('新通知')">推一則</Button>
  <Toast
    v-for="it in items"
    :key="it.id"
    :model-value="true"
    x="right"
    y="top"
    @update:model-value="remove(it.id)"
  >
    {{ it.text }}
  </Toast>
</template>
```

## Props

| Prop          | Type                            | Default     | 說明                                  |
| ------------- | ------------------------------- | ----------- | ------------------------------------- |
| `modelValue`  | `boolean`                       | `undefined` | 受控模式開關                          |
| `defaultOpen` | `boolean`                       | `false`     | 非受控模式初始是否開啟                |
| `x`           | `'left' \| 'center' \| 'right'` | `'center'`  | 水平位置                              |
| `y`           | `'top' \| 'center' \| 'bottom'` | `'center'`  | 垂直位置                              |
| `duration`    | `number`                        | `3000`      | 自動關閉時間（ms）；傳 `0` 不自動關閉 |
| `closable`    | `boolean`                       | `true`      | 是否顯示右上角關閉按鈕                |
| `bgColor`     | `string`                        | -           | 背景顏色（任意 CSS 色值）             |
| `textColor`   | `string`                        | -           | 文字顏色（任意 CSS 色值）             |
| `offset`      | `number`                        | `16`        | 距視窗邊緣的間距（px）                |
| `gap`         | `number`                        | `8`         | 堆疊時 Toast 之間的間距（px）         |
| `teleportTo`  | `string \| HTMLElement`         | `'body'`    | Teleport 目標                         |
| `zIndex`      | `number \| string`              | -           | 自訂 z-index，預設吃 `--rui-z-toast`  |

## Events

| Event               | Payload   | 說明                     |
| ------------------- | --------- | ------------------------ |
| `update:modelValue` | `boolean` | v-model 對應事件         |
| `open`              | -         | Toast 開始顯示時觸發     |
| `close`             | -         | Toast 結束關閉動畫後觸發 |

## 行為細節

- **Hover 暫停倒數**：滑鼠移入 Toast 時暫停計時，移出後以剩餘時間重新開始。
- **a11y**：`role="status"`、`aria-live="polite"`、`aria-atomic="true"`，不會中斷目前的 screen reader 朗讀。
- **Reduced motion**：`@media (prefers-reduced-motion: reduce)` 下只保留 opacity，不做平移/縮放。
- **Z-index**：預設使用 `--rui-z-toast`（300），高於 Modal / Drawer 的 `--rui-z-modal`（200）。

## CSS Tokens

| Token                    | Default                         |
| ------------------------ | ------------------------------- |
| `--rui-color-toast-bg`   | `var(--rui-color-surface)`      |
| `--rui-color-toast-text` | `var(--rui-color-text-primary)` |
| `--rui-radius-toast`     | `8px`                           |
| `--rui-shadow-toast`     | 預設陰影                        |
| `--rui-z-toast`          | `300`                           |
