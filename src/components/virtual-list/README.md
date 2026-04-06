# VirtualList

虛擬滾動列表元件，僅渲染可視範圍內的項目，適合顯示大量資料（萬筆以上）而不影響效能。支援垂直 / 水平方向、無限捲動與自訂空狀態。

## 限制

- 所有項目必須具備**相同的固定尺寸**（垂直 = 高度，水平 = 寬度）
- 容器本身需要有明確高度（垂直）或寬度（水平），否則可視區域計算為 0

## 使用範例

### 垂直列表（基本）

```vue
<script setup lang="ts">
import { VirtualList } from 'roger-ui'

interface Item {
  id: number
  name: string
}

const items: Item[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1,
  name: `項目 ${i + 1}`,
}))
</script>

<template>
  <div style="height: 400px;">
    <VirtualList :items="items" :item-size="48" key-field="id" aria-label="大型清單">
      <template #default="{ item, index }">
        <div>{{ index + 1 }}. {{ item.name }}</div>
      </template>
    </VirtualList>
  </div>
</template>
```

### 水平列表

```vue
<div style="height: 120px;">
  <VirtualList :items="items" :item-size="160" direction="horizontal">
    <template #default="{ item }">
      <div style="width: 100%; height: 100%;">{{ item.name }}</div>
    </template>
  </VirtualList>
</div>
```

### 無限捲動

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VirtualList } from 'roger-ui'

const items = ref(generateItems(50))
const loading = ref(false)

async function onReachEnd() {
  loading.value = true
  const more = await fetchNextPage()
  items.value = [...items.value, ...more]
  loading.value = false
}
</script>

<template>
  <div style="height: 400px;">
    <VirtualList
      :items="items"
      :item-size="48"
      :threshold="100"
      :loading="loading"
      @reach-end="onReachEnd"
    >
      <template #default="{ item }">
        <div>{{ item.name }}</div>
      </template>
    </VirtualList>
  </div>
</template>
```

### 空狀態

```vue
<VirtualList :items="[]" :item-size="48">
  <template #empty>
    <div>目前沒有資料</div>
  </template>
</VirtualList>
```

### 命令式捲動（scrollToIndex）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VirtualList } from 'roger-ui'
import type { VirtualListExpose } from 'roger-ui'

const listRef = ref<VirtualListExpose | null>(null)

function jumpToMiddle() {
  listRef.value?.scrollToIndex(500, 'smooth')
}
</script>

<template>
  <div style="height: 400px;">
    <VirtualList ref="listRef" :items="items" :item-size="48">
      <template #default="{ item }">
        <div>{{ item.name }}</div>
      </template>
    </VirtualList>
  </div>
</template>
```

## Props

| Prop        | 型別                         | 必填 | 預設值       | 說明                                                                 |
| ----------- | ---------------------------- | :--: | ------------ | -------------------------------------------------------------------- |
| `items`     | `T[]`                        |  ✓   | —            | 資料陣列，泛型 T 由傳入值自動推導                                    |
| `itemSize`  | `number`                     |  ✓   | —            | 每個項目在捲動軸上的固定尺寸（px）；垂直方向 = 高度，水平方向 = 寬度 |
| `direction` | `'vertical' \| 'horizontal'` |      | `'vertical'` | 捲動方向                                                             |
| `overscan`  | `number`                     |      | `3`          | 可視區域外預先渲染的緩衝項目數，數值越大捲動越流暢但初始渲染越多     |
| `keyField`  | `keyof T`                    |      | `undefined`  | 指定產生 `:key` 的欄位名稱；未設定時物件項目會使用內部穩定 key，原始型別則依值與出現順序產生 key |
| `threshold` | `number`                     |      | `0`          | 距離捲動末端多少 px 時觸發 `reach-end` 事件                          |
| `loading`   | `boolean`                    |      | `false`      | 為 `true` 時抑制重複 `reach-end` emit；當 `items` 長度增加後自動重置 |
| `ariaLabel` | `string`                     |      | `undefined`  | 整個列表的無障礙標籤（對應 `aria-label`）                            |

## Emits

| 事件        | 參數                             | 說明                                              |
| ----------- | -------------------------------- | ------------------------------------------------- |
| `scroll`    | `(offset: number, event: Event)` | 捲動時觸發，`offset` 為目前捲動偏移量（px）       |
| `reach-end` | —                                | 捲動至接近末端時觸發，由 `threshold` 控制觸發時機 |

## Slots

| Slot      | Slot Props                   | 說明                     |
| --------- | ---------------------------- | ------------------------ |
| `default` | `{ item: T, index: number }` | 每個可見項目的內容       |
| `empty`   | —                            | `items` 為空時顯示的內容 |

## Expose（ref 存取）

| 方法             | 簽名                                                  | 說明                    |
| ---------------- | ----------------------------------------------------- | ----------------------- |
| `scrollToIndex`  | `(index: number, behavior?: ScrollBehavior) => void`  | 捲動至指定 index 的項目 |
| `scrollToOffset` | `(offset: number, behavior?: ScrollBehavior) => void` | 捲動至指定偏移量（px）  |

## 無限捲動：`loading` 與 `reach-end` 的配合

`reach-end` 內部有去重機制，每次觸發後會設下旗標直到 `items.length` 增加才重置。

正確用法：

1. `reach-end` 觸發時立即設 `loading: true`
2. 資料載入完成後更新 `items`，再設 `loading: false`
3. 若已到達最末頁（不會再有新資料），保持 `loading: true` 即可永久停止 emit
