# Table

通用資料表格元件，支援排序、多選、固定表頭、凍結欄位、分組資料，以及自訂 cell / header 渲染。

## 使用範例

### 基本用法

```vue
<script setup lang="ts">
import { Table } from 'roger-ui'
import type { TableColumnDef } from 'roger-ui'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

const columns: TableColumnDef<Product>[] = [
  { key: 'id',    label: 'ID',   width: '60px', align: 'right' },
  { key: 'name',  label: '商品名稱' },
  { key: 'price', label: '價格', align: 'right' },
  { key: 'stock', label: '庫存', align: 'right' },
]

const rows: Product[] = [
  { id: 1, name: 'AirPods Pro', price: 7990, stock: 12 },
  { id: 2, name: 'iPad Pro 13"', price: 39900, stock: 8 },
]
</script>

<template>
  <Table :columns="columns" :rows="rows" row-key="id" />
</template>
```

---

## Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `columns` | `TableColumnDef<T>[]` | 必填 | 欄位定義陣列，見下方說明 |
| `rows` | `readonly TableDataItem<T>[]` | 必填 | 資料列，可混用普通列與分組列 |
| `rowKey` | `keyof T` | 必填 | 唯一識別資料列的欄位名稱 |
| `sortKey` | `string` | — | 目前排序的欄位 key |
| `sortOrder` | `'asc' \| 'desc'` | — | 目前排序方向 |
| `selectable` | `boolean` | `false` | 是否啟用 row 多選（顯示 checkbox） |
| `selectedKeys` | `TableRowKey[]` | `[]` | 已選取的 rowKey 值，支援 `v-model:selectedKeys` |
| `stickyHeader` | `boolean` | `false` | 是否固定表頭（捲動時表頭不隨內容移動） |
| `maxHeight` | `string` | — | 容器最大高度（CSS 值，搭配 `stickyHeader` 使用） |
| `loading` | `boolean` | `false` | 載入中狀態（隱藏資料列，顯示 loading slot） |
| `emptyText` | `string` | `'沒有資料'` | 無資料時的提示文字（可改用 `#empty` slot 完整覆蓋） |

---

## TableColumnDef

每個欄位物件的可用欄位：

| 欄位 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `key` | `keyof T` | 必填 | 對應資料物件的欄位名稱，有 TypeScript 型別約束 |
| `label` | `string` | 必填 | 欄位標題文字 |
| `sortable` | `boolean` | `false` | 是否可排序，啟用後點擊 header 會 emit `sort` 事件 |
| `frozen` | `boolean` | `false` | 是否凍結此欄（sticky left），**必須同時設定 `width`** |
| `width` | `string` | — | 欄位寬度，CSS 值如 `'120px'`；凍結欄必填 |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | 欄位對齊方式 |

---

## Emits

| 事件 | 參數 | 說明 |
|------|------|------|
| `sort` | `(key: string, order: 'asc' \| 'desc' \| null)` | 點擊可排序欄位時觸發。`order` 為 `null` 表示取消排序 |
| `update:selectedKeys` | `(keys: TableRowKey[])` | 選取狀態變更時觸發 |
| `rowClick` | `(row: T)` | 點擊資料列時觸發 |

---

## Slots

Table 元件提供以下 slots 供自訂渲染。

### `#cell-{key}`

自訂特定欄位的 cell 內容。`{key}` 對應 `TableColumnDef` 的 `key` 欄位。

**Slot props：**
| 名稱 | 型別 | 說明 |
|------|------|------|
| `row` | `T` | 該列的完整資料物件 |
| `value` | `unknown` | `row[key]` 的值 |

```vue
<Table :columns="columns" :rows="rows" row-key="id">
  <!-- 格式化金額 -->
  <template #cell-price="{ value }">
    NT$ {{ (value as number).toLocaleString() }}
  </template>

  <!-- 依狀態顯示標籤顏色 -->
  <template #cell-status="{ value }">
    <Badge :color="value === 'active' ? 'green' : 'gray'">
      {{ value }}
    </Badge>
  </template>

  <!-- 操作按鈕，可取用整列資料 -->
  <template #cell-action="{ row }">
    <Button size="sm" @click="handleEdit(row)">編輯</Button>
    <Button size="sm" outline @click="handleDelete(row.id)">刪除</Button>
  </template>
</Table>
```

> **注意**：`action` 欄位不需要真正存在於資料物件中，只要在 `columns` 定義一個佔位欄位即可：
> ```ts
> { key: 'action' as keyof Product, label: '操作' }
> ```
> 或在型別上預留：
> ```ts
> interface Product {
>   id: number
>   name: string
>   action?: never  // 型別佔位，實際資料不需此欄
> }
> ```

---

### `#header-{key}`

自訂特定欄位的 header cell 內容，完整取代預設標題文字與排序圖示。

```vue
<Table :columns="columns" :rows="rows" row-key="id">
  <template #header-price>
    價格 <small>（含稅）</small>
  </template>
</Table>
```

---

### `#group-header`

自訂分組標題列的內容。僅在 `rows` 含有 `TableRowGroup` 物件時出現。

**Slot props：**
| 名稱 | 型別 | 說明 |
|------|------|------|
| `group` | `string` | 分組標題文字 |

```vue
<Table :columns="columns" :rows="groupedRows" row-key="id">
  <template #group-header="{ group }">
    <span class="font-bold text-blue-900">📂 {{ group }}</span>
  </template>
</Table>
```

---

### `#loading`

自訂載入中畫面，覆蓋預設的「載入中…」文字。

```vue
<Table :columns="columns" :rows="rows" row-key="id" loading>
  <template #loading>
    <Spinner /> 資料載入中，請稍候…
  </template>
</Table>
```

---

### `#empty`

自訂空資料畫面，覆蓋預設的 `emptyText` 文字。

```vue
<Table :columns="columns" :rows="[]" row-key="id">
  <template #empty>
    <div class="text-center py-8">
      <img src="/empty.svg" alt="" />
      <p>查無符合條件的資料</p>
    </div>
  </template>
</Table>
```

---

## 功能說明

### 排序

排序為**受控模式**，元件本身不儲存狀態，需消費方自行維護 `sortKey`、`sortOrder` 並對資料排序後傳回。

```vue
<script setup lang="ts">
const sortKey = ref<string | undefined>()
const sortOrder = ref<'asc' | 'desc' | undefined>()

const sortedRows = computed(() => {
  if (!sortKey.value) return rows
  return [...rows].sort((a, b) => {
    const av = a[sortKey.value!]
    const bv = b[sortKey.value!]
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortOrder.value === 'desc' ? -cmp : cmp
  })
})

function onSort(key: string, order: 'asc' | 'desc' | null) {
  sortKey.value = order ? key : undefined
  sortOrder.value = order ?? undefined
}
</script>

<template>
  <Table
    :columns="columns"
    :rows="sortedRows"
    row-key="id"
    :sort-key="sortKey"
    :sort-order="sortOrder"
    @sort="onSort"
  />
</template>
```

循環順序：第一次點擊 → `asc`，再次點擊 → `desc`，第三次點擊 → 取消排序（`null`）。

---

### Row 選取

支援 `v-model:selectedKeys` 雙向綁定，儲存已選取列的 `rowKey` 值：

```vue
<script setup>
const selectedKeys = ref<(string | number)[]>([])
</script>

<template>
  <Table
    :columns="columns"
    :rows="rows"
    row-key="id"
    selectable
    v-model:selectedKeys="selectedKeys"
  />
  <p>已選取 {{ selectedKeys.length }} 筆，ID：{{ selectedKeys.join(', ') }}</p>
</template>
```

header checkbox 支援全選（全勾）與半選（`indeterminate`）狀態，自動由元件計算。

---

### 固定表頭

搭配 `maxHeight` 使捲動時表頭保持可見：

```vue
<Table
  :columns="columns"
  :rows="rows"
  row-key="id"
  sticky-header
  max-height="400px"
/>
```

---

### 凍結欄位

水平捲動時固定在視窗左側，`frozen: true` 欄位**必須設定 `width`**，否則 DEV 模式下會印出 warning：

```ts
const columns: TableColumnDef<Product>[] = [
  { key: 'id',   label: 'ID',   width: '60px',  frozen: true },  // ✅
  { key: 'name', label: '名稱', width: '160px', frozen: true },  // ✅
  { key: 'price', label: '價格' },                               // 正常捲動欄
]
```

多個凍結欄位會依定義順序由左往右堆疊，`left` offset 由元件自動計算。

凍結欄位與 `stickyHeader` 同時啟用時，左上角交叉格的 z-index 由元件自動處理。

---

### 分組資料

`rows` 可混入 `TableRowGroup<T>` 物件，元件會自動渲染分組標題列：

```ts
import type { TableRowGroup } from 'roger-ui'

interface Product {
  id: number
  name: string
  price: number
}

const rows: (Product | TableRowGroup<Product>)[] = [
  {
    group: '耳機類',
    rows: [
      { id: 1, name: 'AirPods Pro', price: 7990 },
      { id: 2, name: 'Sony WH-1000XM5', price: 11990 },
    ],
  },
  {
    group: '平板類',
    rows: [
      { id: 3, name: 'iPad Pro 13"', price: 39900 },
    ],
  },
]
```

分組標題列不會觸發 `rowClick`，也不會被選取（selectable 模式下全選會涵蓋所有分組內的資料列）。

---

### 搭配 Pagination

Table 不內建分頁，請搭配 `Pagination` 元件使用，由消費方控制資料切片：

```vue
<script setup lang="ts">
const currentPage = ref(1)
const pageSize = 10

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allRows.slice(start, start + pageSize)
})
</script>

<template>
  <Table :columns="columns" :rows="pagedRows" row-key="id" />
  <Pagination
    :total="allRows.length"
    :page-size="pageSize"
    v-model:currentPage="currentPage"
  />
</template>
```
