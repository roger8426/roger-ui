# Drawer

抽屜元件，支援從上下左右四個方向滑入，符合 WAI-ARIA Dialog Pattern。支援受控與非受控兩種開關模式。

## 使用範例

### 受控模式（v-model）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Drawer, Button } from 'roger-ui'

const open = ref(false)
</script>

<template>
  <Button @click="open = true">開啟</Button>
  <Drawer v-model="open" title="抽屜標題">
    <p>Drawer 內容</p>
  </Drawer>
</template>
```

### 非受控模式（defaultOpen）

```vue
<Drawer :default-open="true" title="預設開啟">
  <p>Drawer 內容</p>
</Drawer>
```

### 四個方向

```vue
<Drawer v-model="open" placement="left" title="左側抽屜">
  <p>從左側滑入</p>
</Drawer>

<Drawer v-model="open" placement="top" title="上方抽屜">
  <p>從頂部滑入</p>
</Drawer>
```

### 含底部操作列

```vue
<Drawer v-model="open" title="確認操作">
  <p>請確認以下內容。</p>
  <template #footer>
    <Button variant="secondary" @click="open = false">取消</Button>
    <Button @click="handleConfirm">確認</Button>
  </template>
</Drawer>
```

### 自訂顏色

```vue
<Drawer
  v-model="open"
  title="深色抽屜"
  bg-color="oklch(18% 0.01 264)"
  text-color="oklch(92% 0.01 264)"
  border-color="oklch(30% 0.01 264)"
>
  <p>內容</p>
</Drawer>
```

## Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `modelValue` | `boolean` | — | 受控模式：控制開關（搭配 `v-model` 使用）；未傳入時切換為非受控模式 |
| `defaultOpen` | `boolean` | `false` | 非受控模式：初始開關狀態 |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | 抽屜滑出方向 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 抽屜尺寸（left/right 控制寬度；top/bottom 控制高度） |
| `title` | `string` | `''` | 標題文字；`#header` slot 存在時此 prop 被忽略 |
| `description` | `string` | `''` | 補充說明文字，透過 `aria-describedby` 提供給輔助技術，視覺上隱藏 |
| `showCloseButton` | `boolean` | `true` | 是否顯示關閉按鈕 |
| `closeOnClickOutside` | `boolean` | `true` | 點擊 Drawer 外部是否關閉 |
| `closeOnEscape` | `boolean` | `true` | 按下 Escape 是否關閉 |
| `trapFocus` | `boolean` | `true` | 是否將 Tab 焦點限制在 Panel 內 |
| `restoreFocus` | `boolean` | `true` | 關閉後是否將焦點還原至觸發元素 |
| `lockScroll` | `boolean` | `true` | 開啟時是否鎖住 body scroll（iOS Safari 相容） |
| `teleportTo` | `string \| HTMLElement` | `'body'` | Teleport 掛載目標 |
| `bgColor` | `string` | — | Panel 背景顏色（任意 CSS 色彩值，覆蓋 `--rui-color-drawer-bg`） |
| `textColor` | `string` | — | Panel 文字顏色（任意 CSS 色彩值，覆蓋 `--rui-color-drawer-text`） |
| `borderColor` | `string` | — | Panel 邊框與分隔線顏色（任意 CSS 色彩值，覆蓋 `--rui-color-drawer-border`） |

## Emits

| Event | Payload | 說明 |
|-------|---------|------|
| `update:modelValue` | `boolean` | Drawer 開關狀態變更時觸發（受控與非受控模式皆會發出） |
| `open` | — | Drawer 開啟時觸發 |
| `close` | — | Drawer 關閉時觸發 |

## Slots

| Slot | 說明 |
|------|------|
| `default` | Drawer 主體內容（可捲動區域） |
| `header` | 自訂標題列；傳入時 `title` prop 被忽略，`aria-labelledby` 也不會自動繫結 |
| `footer` | 底部操作列；未傳入時不渲染底部區域 |

## 尺寸

### left / right（控制寬度）

| 值 | 寬度 |
|----|------|
| `sm` | 20rem（320px） |
| `md` | 25rem（400px） |
| `lg` | 35rem（560px） |

### top / bottom（控制高度）

| 值 | 高度 |
|----|------|
| `sm` | 15rem（240px） |
| `md` | 21.875rem（350px） |
| `lg` | 30rem（480px） |

## CSS Tokens

| Token | 預設值（light） | 預設值（dark） | 說明 |
|-------|---------------|--------------|------|
| `--rui-color-drawer-backdrop` | `oklch(0% 0 0 / 0.5)` | 同左 | 背景遮罩顏色 |
| `--rui-color-drawer-bg` | `oklch(100% 0 0)` | `oklch(18% 0.01 264)` | Panel 背景色 |
| `--rui-color-drawer-text` | `oklch(15% 0.02 264)` | `oklch(92% 0.01 264)` | Panel 文字色 |
| `--rui-color-drawer-border` | `oklch(88% 0.01 264)` | `oklch(30% 0.01 264)` | 邊框與分隔線顏色 |
| `--rui-shadow-drawer-left` | `4px 0 16px … / 8px 0 32px …` | 同左 | 左側 Panel 陰影 |
| `--rui-shadow-drawer-right` | `-4px 0 16px … / -8px 0 32px …` | 同左 | 右側 Panel 陰影 |
| `--rui-shadow-drawer-top` | `0 4px 16px … / 0 8px 32px …` | 同左 | 上方 Panel 陰影 |
| `--rui-shadow-drawer-bottom` | `0 -4px 16px … / 0 -8px 32px …` | 同左 | 下方 Panel 陰影 |

## 無障礙

- Panel 根元素使用 `role="dialog"` 與 `aria-modal="true"`
- 有 `title` prop 時自動繫結 `aria-labelledby`
- 有 `description` prop 時自動繫結 `aria-describedby`
- `trapFocus: true`：Tab / Shift+Tab 焦點循環限制在 Panel 內
- `restoreFocus: true`：關閉後焦點返回觸發元素
- 支援 `prefers-reduced-motion`：動畫時長自動歸零
- 使用 `#header` slot 時，請自行為標題元素加上 `id`，並透過 `aria-labelledby` 傳入 Drawer，或直接補充 `aria-label` 屬性
