# Toggle

開關切換元件，對應 HTML `<input type="checkbox" role="switch">`，支援 v-model 雙向綁定、多種尺寸與自訂顏色。

## 使用範例

```vue
<!-- 基本用法 -->
<Toggle v-model="enabled" aria-label="開啟通知" />

<!-- 指定尺寸 -->
<Toggle v-model="enabled" size="lg" aria-label="開啟通知" />

<!-- 停用狀態 -->
<Toggle v-model="enabled" disabled aria-label="開啟通知" />

<!-- 自訂啟用顏色 -->
<Toggle v-model="enabled" color="oklch(55% 0.18 145)" aria-label="開啟通知" />

<!-- 帶圖示的 thumb（使用 slot） -->
<Toggle v-model="enabled" aria-label="開啟通知">
  <Icon v-if="enabled" name="check" :size="8" color="oklch(100% 0 0)" />
  <Icon v-else name="close" :size="8" color="oklch(50% 0.01 264)" />
</Toggle>

<!-- 搭配可見標題（用於有視覺標籤的場景） -->
<label class="flex items-center gap-2">
  <span>開啟通知</span>
  <Toggle v-model="enabled" />
</label>
```

> **注意**：若元件旁無視覺標籤文字，必須透過 `aria-label` prop 提供無障礙名稱，供螢幕閱讀器讀取。

## Props

| Prop         | 型別                   | 預設值                             | 說明                                             |
| ------------ | ---------------------- | ---------------------------------- | ------------------------------------------------ |
| `modelValue` | `boolean`              | `false`                            | v-model 綁定值，控制開關狀態                     |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`                             | 元件尺寸                                         |
| `disabled`   | `boolean`              | `false`                            | 是否停用                                         |
| `required`   | `boolean`              | `false`                            | 是否標記為必填（表單驗證用）                     |
| `id`         | `string`               | —                                  | 覆蓋自動產生的 input id                          |
| `name`       | `string`               | —                                  | 表單 input name 屬性                             |
| `color`      | `string`               | `var(--rui-color-switch-track-on)` | 啟用狀態的軌道顏色，接受任意 CSS 色彩值          |
| `ariaLabel`  | `string`               | —                                  | 設定 input 的 `aria-label`，無視覺標籤時必須提供 |

## Emits

| 事件                | Payload                          | 說明                               |
| ------------------- | -------------------------------- | ---------------------------------- |
| `update:modelValue` | `boolean`                        | v-model 更新事件                   |
| `change`            | `(value: boolean, event: Event)` | 狀態變更時觸發，附帶新值與原生事件 |
| `focus`             | `FocusEvent`                     | input 獲得焦點時觸發               |
| `blur`              | `FocusEvent`                     | input 失去焦點時觸發               |

## Slots

| Slot      | 說明                                                                                       |
| --------- | ------------------------------------------------------------------------------------------ |
| `default` | 渲染於 thumb 內部，通常用於放置裝飾性圖示（處於 `aria-hidden` 區域，不會被螢幕閱讀器讀取） |

## Expose

| 方法      | 型別         | 說明                     |
| --------- | ------------ | ------------------------ |
| `focus()` | `() => void` | 以程式方式聚焦內部 input |
