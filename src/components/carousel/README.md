# Carousel

輪播元件，支援水平滑動與淡入淡出兩種切換效果，具備自動播放、循環、鍵盤導航、觸控 swipe、受控模式與完整 WAI-ARIA Carousel Pattern。

## 使用範例

### 基本使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Carousel } from 'roger-ui'

const items = [
  { id: 1, label: '第一張' },
  { id: 2, label: '第二張' },
  { id: 3, label: '第三張' },
]
const current = ref(0)
</script>

<template>
  <Carousel v-model="current" :items="items">
    <template #default="{ item }">
      <div>{{ item.label }}</div>
    </template>
  </Carousel>
</template>
```

### 自動播放

```vue
<Carousel :items="items" autoplay :delay="4000" pause-on-hover>
  <template #default="{ item }">
    <div>{{ item.label }}</div>
  </template>
</Carousel>
```

### 淡入淡出效果

```vue
<Carousel :items="items" fade>
  <template #default="{ item }">
    <div>{{ item.label }}</div>
  </template>
</Carousel>
```

### 循環模式

```vue
<Carousel :items="items" loop show-arrows>
  <template #default="{ item }">
    <div>{{ item.label }}</div>
  </template>
</Carousel>
```

### 自訂 dot 顏色

```vue
<Carousel :items="items" dot-color="oklch(58% 0.22 15)">
  <template #default="{ item }">
    <div>{{ item.label }}</div>
  </template>
</Carousel>
```

### 自訂 dot 插槽

```vue
<Carousel :items="items">
  <template #default="{ item }">
    <div>{{ item.label }}</div>
  </template>
  <template #dot="{ index, isActive }">
    <span :style="{ opacity: isActive ? 1 : 0.3 }">{{ index + 1 }}</span>
  </template>
</Carousel>
```

## Props

| Prop           | 型別      | 預設值       | 說明                                                                   |
| -------------- | --------- | ------------ | ---------------------------------------------------------------------- |
| `items`        | `T[]`     | —            | 輪播項目資料陣列，泛型 T 由傳入值自動推導（必填）                      |
| `modelValue`   | `number`  | `0`          | 受控模式：目前顯示的 slide index（0-based），搭配 `v-model` 使用       |
| `fade`         | `boolean` | `false`      | 使用淡入淡出切換動畫（預設為水平滑動）                                 |
| `loop`         | `boolean` | `false`      | 啟用循環模式（首尾相接）                                               |
| `autoplay`     | `boolean` | `false`      | 啟用自動播放                                                           |
| `delay`        | `number`  | `3000`       | 自動播放間隔（毫秒）                                                   |
| `pauseOnHover` | `boolean` | `true`       | 滑鼠 hover 時暫停自動播放                                              |
| `showArrows`   | `boolean` | `true`       | 顯示前/後箭頭按鈕                                                      |
| `showDots`     | `boolean` | `true`       | 顯示分頁點（dots）                                                     |
| `dotColor`     | `string`  | —            | dot 顏色（任意 CSS 色彩值，預設使用 `--rui-carousel-dot-color` token） |
| `ariaLabel`    | `string`  | `'carousel'` | 輪播區域的 `aria-label`，用於多輪播並存時的無障礙標示                  |

## Emits

| Event               | Payload                              | 說明                                               |
| ------------------- | ------------------------------------ | -------------------------------------------------- |
| `update:modelValue` | `number`                             | slide 切換時觸發，同步目前 index（`v-model` 使用） |
| `change`            | `[index: number, prevIndex: number]` | 每次切換時觸發，包含新舊 index                     |

## Slots

| Slot      | Slot Props                                                  | 說明                                                  |
| --------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| `default` | `{ item: T, index: number, isActive: boolean }`             | 每張 slide 的內容渲染                                 |
| `dot`     | `{ index: number, isActive: boolean, onClick: () => void }` | 自訂分頁點外觀；未提供時渲染空按鈕（以 CSS 控制樣式） |

## 鍵盤導航

輪播視窗（viewport）可獲得焦點，支援以下按鍵：

| 按鍵         | 行為         |
| ------------ | ------------ |
| `ArrowRight` | 切換至下一張 |
| `ArrowLeft`  | 切換至上一張 |
| `Home`       | 跳到第一張   |
| `End`        | 跳到最後一張 |

## CSS Tokens

| Token                                | 預設值（light）       | 預設值（dark）        | 說明               |
| ------------------------------------ | --------------------- | --------------------- | ------------------ |
| `--rui-carousel-nav-color`           | `oklch(15% 0.02 264)` | `oklch(92% 0.01 264)` | 箭頭按鈕顏色       |
| `--rui-carousel-dot-color`           | `oklch(75% 0.01 264)` | `oklch(40% 0.01 264)` | 非作用中 dot 顏色  |
| `--rui-carousel-dot-active-color`    | `oklch(55% 0.2 264)`  | `oklch(65% 0.2 264)`  | 作用中 dot 顏色    |
| `--rui-carousel-transition-duration` | `300ms`               | 同左                  | slide 切換動畫時長 |
