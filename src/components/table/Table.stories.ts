import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import type { ConcreteComponent } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Table from './Table.vue'
import Pagination from '../pagination/Pagination.vue'
import type { TableColumnDef, TableProps, TableRowGroup, TableRowKey } from './types'

interface Product extends Record<string, unknown> {
  id: number
  name: string
  category: string
  price: number
  stock: number
}

const sampleColumns: TableColumnDef<Product>[] = [
  { key: 'id', label: 'ID', width: '60px', align: 'right' },
  { key: 'name', label: '商品名稱', sortable: true },
  { key: 'category', label: '分類', sortable: true },
  { key: 'price', label: '價格', align: 'right', sortable: true },
  { key: 'stock', label: '庫存', align: 'right' },
]

const sampleRows: Product[] = [
  { id: 1, name: 'Apple AirPods Pro', category: '耳機', price: 7990, stock: 12 },
  { id: 2, name: 'Sony WH-1000XM5', category: '耳機', price: 11990, stock: 5 },
  { id: 3, name: 'iPad Pro 13"', category: '平板', price: 39900, stock: 8 },
  { id: 4, name: 'MacBook Air M3', category: '筆電', price: 38900, stock: 3 },
  { id: 5, name: 'Magic Keyboard', category: '鍵盤', price: 3290, stock: 20 },
]

const meta = {
  title: 'Layout/Table',
  component: Table as ConcreteComponent<TableProps<Product>>,
  tags: ['autodocs'],
  argTypes: {
    selectable: {
      description: '是否啟用 row 選取',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    stickyHeader: {
      description: '是否固定表頭',
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
    maxHeight: {
      description: '容器最大高度（stickyHeader 時有效）',
      control: 'text',
      table: { category: 'Appearance' },
    },
    loading: {
      description: '載入中狀態',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    emptyText: {
      description: '無資料提示文字',
      control: 'text',
      table: { category: 'Appearance', defaultValue: { summary: '沒有資料' } },
    },
    sortKey: { table: { disable: true } },
    sortOrder: { table: { disable: true } },
    selectedKeys: { table: { disable: true } },
    columns: { table: { disable: true } },
    rows: { table: { disable: true } },
    rowKey: { table: { disable: true } },
  },
  args: {
    columns: sampleColumns,
    rows: sampleRows,
    rowKey: 'id',
    selectable: false,
    stickyHeader: false,
    loading: false,
    emptyText: '沒有資料',
  },
} satisfies Meta<TableProps<Product>>

export default meta
type Story = StoryObj<typeof meta>

// ── Default ─────────────────────────────────────────────────────
export const Default: Story = {}

// ── Sortable ────────────────────────────────────────────────────
export const Sortable: Story = {
  render: () => ({
    components: { Table },
    setup() {
      const sortKey = ref<string | undefined>(undefined)
      const sortOrder = ref<'asc' | 'desc' | undefined>(undefined)

      function onSort(key: string, order: 'asc' | 'desc' | null) {
        if (order === null) {
          sortKey.value = undefined
          sortOrder.value = undefined
        } else {
          sortKey.value = key
          sortOrder.value = order
        }
      }

      const sortedRows = ref<Product[]>([...sampleRows])
      function applySort() {
        if (!sortKey.value) {
          sortedRows.value = [...sampleRows]
          return
        }
        const k = sortKey.value as keyof Product
        sortedRows.value = [...sampleRows].sort((a, b) => {
          const av = a[k] as string | number
          const bv = b[k] as string | number
          const cmp = av < bv ? -1 : av > bv ? 1 : 0
          return sortOrder.value === 'desc' ? -cmp : cmp
        })
      }

      function handleSort(key: string, order: 'asc' | 'desc' | null) {
        onSort(key, order)
        applySort()
      }

      return { sortKey, sortOrder, sortedRows, handleSort, sampleColumns }
    },
    template: `
      <Table
        :columns="sampleColumns"
        :rows="sortedRows"
        row-key="id"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        @sort="handleSort"
      />
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nameHeader = canvas.getByRole('columnheader', { name: /商品名稱/ })

    // 初始無排序
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none')

    // 點擊一次 → asc
    await userEvent.click(nameHeader)
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')

    // 點擊兩次 → desc
    await userEvent.click(nameHeader)
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending')
  },
}

// ── RowSelection ────────────────────────────────────────────────
export const RowSelection: Story = {
  render: () => ({
    components: { Table },
    setup() {
      const selectedKeys = ref<TableRowKey[]>([])
      return { selectedKeys, sampleColumns, sampleRows }
    },
    template: `
      <div>
        <Table
          :columns="sampleColumns"
          :rows="sampleRows"
          row-key="id"
          selectable
          :selected-keys="selectedKeys"
          @update:selectedKeys="selectedKeys = $event"
        />
        <p data-testid="selected-count" class="mt-2 text-sm">已選取：{{ selectedKeys.length }} 筆</p>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkboxes = canvas.getAllByRole('checkbox')

    // 第一個是全選，[1] 是第一列
    const firstRowCb = checkboxes[1]
    await expect(firstRowCb).not.toBeChecked()

    await userEvent.click(firstRowCb!)
    await expect(firstRowCb).toBeChecked()

    const count = canvas.getByTestId('selected-count')
    await expect(count).toHaveTextContent('已選取：1 筆')

    // 全選
    const selectAllCb = checkboxes[0]
    await userEvent.click(selectAllCb!)
    await expect(count).toHaveTextContent('已選取：5 筆')

    // 取消全選
    await userEvent.click(selectAllCb!)
    await expect(count).toHaveTextContent('已選取：0 筆')
  },
}

// ── Loading ─────────────────────────────────────────────────────
export const Loading: Story = {
  args: {
    loading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table')
    await expect(table).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByText('載入中…')).toBeInTheDocument()
  },
}

// ── Empty ────────────────────────────────────────────────────────
export const Empty: Story = {
  args: {
    rows: [],
    emptyText: '目前無商品資料',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('目前無商品資料')).toBeInTheDocument()
  },
}

// ── Groups ───────────────────────────────────────────────────────
interface GroupProduct extends Record<string, unknown> {
  id: number
  name: string
  price: number
}

const groupColumns: TableColumnDef<GroupProduct>[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'name', label: '商品名稱' },
  { key: 'price', label: '價格', align: 'right' },
]

const groupRows: (GroupProduct | TableRowGroup<GroupProduct>)[] = [
  {
    group: '耳機類',
    rows: [
      { id: 1, name: 'AirPods Pro', price: 7990 },
      { id: 2, name: 'Sony WH-1000XM5', price: 11990 },
    ],
  },
  {
    group: '平板類',
    rows: [{ id: 3, name: 'iPad Pro 13"', price: 39900 }],
  },
]

export const Groups: Story = {
  render: () => ({
    components: { Table },
    setup() {
      return { groupColumns, groupRows }
    },
    template: `
      <Table
        :columns="groupColumns"
        :rows="groupRows"
        row-key="id"
      />
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('耳機類')).toBeInTheDocument()
    await expect(canvas.getByText('平板類')).toBeInTheDocument()
    await expect(canvas.getByText('AirPods Pro')).toBeInTheDocument()
  },
}

// ── FrozenColumn ─────────────────────────────────────────────────
const frozenColumns: TableColumnDef<Product>[] = [
  { key: 'id', label: 'ID', width: '60px', frozen: true },
  { key: 'name', label: '商品名稱', width: '200px', frozen: true },
  { key: 'category', label: '分類' },
  { key: 'price', label: '價格', align: 'right' },
  { key: 'stock', label: '庫存', align: 'right' },
]

export const FrozenColumn: Story = {
  args: {
    columns: frozenColumns,
    rows: sampleRows,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const idHeader = canvas.getByRole('columnheader', { name: 'ID' })
    await expect(idHeader).toHaveStyle({ position: 'sticky' })
  },
}

// ── StickyHeader ─────────────────────────────────────────────────
export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
    maxHeight: '200px',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rowgroups = canvas.getAllByRole('rowgroup')
    await expect(rowgroups[0]).toHaveClass('sticky')
  },
}

// ── WithPagination ────────────────────────────────────────────────
const allProducts: Product[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `商品 ${i + 1}`,
  category: ['耳機', '平板', '筆電', '鍵盤'][i % 4] ?? '其他',
  price: (i + 1) * 1000,
  stock: i + 1,
}))

export const WithPagination: Story = {
  render: () => ({
    components: { Table, Pagination },
    setup() {
      const currentPage = ref(1)
      const pageSize = 10

      const pagedRows = ref<Product[]>(allProducts.slice(0, pageSize))

      function onPageChange(page: number) {
        currentPage.value = page
        const start = (page - 1) * pageSize
        pagedRows.value = allProducts.slice(start, start + pageSize)
      }

      return { currentPage, pagedRows, sampleColumns, onPageChange, total: allProducts.length }
    },
    template: `
      <div class="flex flex-col gap-4">
        <Table
          :columns="sampleColumns"
          :rows="pagedRows"
          row-key="id"
        />
        <Pagination
          :total="total"
          :page-size="10"
          :current-page="currentPage"
          @update:currentPage="onPageChange"
        />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 初始第 1 頁，應有商品 1
    await expect(canvas.getByText('商品 1')).toBeInTheDocument()

    // 點擊下一頁
    const nextBtn = canvas.getByRole('button', { name: '下一頁' })
    await userEvent.click(nextBtn)

    // 第 2 頁，應有商品 11
    await expect(canvas.getByText('商品 11')).toBeInTheDocument()
  },
}
