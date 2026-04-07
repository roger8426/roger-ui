# Checkbox / CheckboxGroup

勾選框元件，支援獨立使用與群組模式，具備半選（indeterminate）、尺寸、錯誤狀態、自訂顏色等功能。

## 使用範例

### 獨立使用（v-model）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from 'roger-ui'

const agreed = ref(false)
</script>

<template>
  <Checkbox v-model="agreed" label="同意服務條款" />
</template>
```

### 使用 default slot 取代 label prop

```vue
<Checkbox v-model="agreed">
  我同意 <a href="/terms">服務條款</a>
</Checkbox>
```

### 錯誤狀態

```vue
<Checkbox v-model="agreed" error-msg="請同意服務條款" />
```

### CheckboxGroup（多選群組）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox, CheckboxGroup } from 'roger-ui'

const selected = ref<string[]>([])
</script>

<template>
  <CheckboxGroup v-model="selected" v-slot="{ allChecked, indeterminate, toggleAll }">
    <div class="flex flex-col gap-2">
      <Checkbox
        :model-value="allChecked"
        :indeterminate="indeterminate"
        label="全選"
        @update:model-value="toggleAll"
      />
      <hr />
      <Checkbox value="apple" label="蘋果" />
      <Checkbox value="banana" label="香蕉" />
      <Checkbox value="cherry" label="櫻桃" />
    </div>
  </CheckboxGroup>
</template>
```

### 停用整個群組

```vue
<CheckboxGroup v-model="selected" disabled>
  <!-- ... -->
</CheckboxGroup>
```

### 自訂顏色

```vue
<!-- 只自訂勾選框顏色 -->
<Checkbox v-model="checked" label="危險項目" color="oklch(55% 0.22 25)" />

<!-- 只自訂 label 文字顏色 -->
<Checkbox v-model="checked" label="強調文字" label-color="#a855f7" />

<!-- 同時自訂兩者 -->
<Checkbox v-model="checked" label="客製化配色" color="#f97316" label-color="#0ea5e9" />
```

> **注意**：當 `error` / `error-msg` 啟用時，label 文字顏色強制切換為 `var(--rui-color-error)`，`label-color` 不生效。

## Checkbox Props

| Prop            | 型別                   | 預設值  | 說明                                                                                                                     |
| --------------- | ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| `modelValue`    | `boolean`              | `false` | v-model 綁定值（是否勾選）                                                                                               |
| `indeterminate` | `boolean`              | `false` | 半選狀態（standalone 時手動傳入；群組內由 CheckboxGroup 管理）                                                           |
| `disabled`      | `boolean`              | `false` | 是否停用                                                                                                                 |
| `size`          | `'sm' \| 'md' \| 'lg'` | `'md'`  | 元件尺寸                                                                                                                 |
| `label`         | `string`               | `''`    | 純文字 label（`default` slot 存在時，slot 優先）                                                                         |
| `value`         | `unknown`              | —       | 用於 CheckboxGroup 的代表值；未傳入時即便在群組內也視為獨立使用                                                          |
| `id`            | `string`               | —       | 自訂 `id`；未傳入時自動產生唯一 id                                                                                       |
| `name`          | `string`               | —       | `name` 屬性；在 CheckboxGroup 中由群組統一管理                                                                           |
| `required`      | `boolean`              | `false` | 是否必填                                                                                                                 |
| `error`         | `boolean`              | `false` | 是否為錯誤狀態（無訊息時只顯示紅色邊框）                                                                                 |
| `errorMsg`      | `string`               | `''`    | 錯誤訊息；有值時自動啟用 error 狀態並顯示訊息文字                                                                        |
| `color`         | `string`               | —       | 勾選框顏色（任意 CSS 色彩值，預設 `var(--rui-color-default)`）                                                           |
| `labelColor`    | `string`               | —       | Label 文字顏色（任意 CSS 色彩值，預設 `var(--rui-color-text-primary)`；error 狀態時強制覆蓋為 `var(--rui-color-error)`） |

## Checkbox Emits

| Event               | Payload                          | 說明                             |
| ------------------- | -------------------------------- | -------------------------------- |
| `update:modelValue` | `boolean`                        | 勾選狀態改變（`v-model` 使用）   |
| `change`            | `[value: boolean, event: Event]` | 勾選狀態改變，同時提供原生 Event |
| `focus`             | `FocusEvent`                     | input 取得焦點                   |
| `blur`              | `FocusEvent`                     | input 失去焦點                   |

## Checkbox Slots

| Slot      | 說明                                   |
| --------- | -------------------------------------- |
| `default` | 自訂 label 內容（優先於 `label` prop） |

## Checkbox Expose

| 名稱      | 說明                               |
| --------- | ---------------------------------- |
| `focus()` | 以程式方式使 checkbox 元素取得焦點 |

## CheckboxGroup Props

| Prop         | 型別        | 預設值  | 說明                                        |
| ------------ | ----------- | ------- | ------------------------------------------- |
| `modelValue` | `unknown[]` | —       | 已勾選的值陣列（必填），搭配 `v-model` 使用 |
| `disabled`   | `boolean`   | `false` | 停用整個群組，所有子 Checkbox 均不可互動    |
| `name`       | `string`    | —       | 套用至所有子 Checkbox 的 `name` 屬性        |

## CheckboxGroup Emits

| Event               | Payload     | 說明                         |
| ------------------- | ----------- | ---------------------------- |
| `update:modelValue` | `unknown[]` | 勾選值變更（`v-model` 使用） |

## CheckboxGroup Slots

| Slot      | Slot Props                                                               | 說明                                              |
| --------- | ------------------------------------------------------------------------ | ------------------------------------------------- |
| `default` | `{ allChecked: boolean, indeterminate: boolean, toggleAll: () => void }` | 群組內容，通常放置全選 Checkbox 和各選項 Checkbox |

## 尺寸

| 值   | checkbox 大小 | icon 大小 |
| ---- | ------------- | --------- |
| `sm` | 14 × 14 px    | 10 px     |
| `md` | 16 × 16 px    | 12 px     |
| `lg` | 20 × 20 px    | 14 px     |
