import { ref } from 'vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import type { ConcreteComponent } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import VirtualList from './VirtualList.vue'
import type { VirtualListProps, VirtualListExpose } from './types'

// ─── 共用資料型別 ──────────────────────────────────────────────

interface ListItem {
  id: number
  label: string
}

function generateItems(count: number, offset = 0): ListItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: offset + i + 1,
    label: `項目 ${offset + i + 1}`,
  }))
}

const defaultItems = generateItems(10_000)
const ITEM_HEIGHT = 48

// ─── Meta ──────────────────────────────────────────────────────

const meta = {
  title: 'Layout/VirtualList',
  // Generic component 需型別斷言，Storybook Meta 型別系統不支援 Vue 3 generic SFC
  component: VirtualList as unknown as ConcreteComponent<VirtualListProps<ListItem>>,
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: '資料陣列，泛型 T 由傳入值自動推導',
      control: false,
      table: { category: 'Data' },
    },
    itemSize: {
      description: '每個項目在捲動軸上的固定尺寸（px）',
      control: 'number',
      table: { category: 'Layout', defaultValue: { summary: '—（必填）' } },
    },
    direction: {
      description: '捲動方向',
      control: 'select',
      options: ['vertical', 'horizontal'],
      table: { category: 'Layout', defaultValue: { summary: 'vertical' } },
    },
    overscan: {
      description: '可視區域外預先渲染的緩衝項目數',
      control: 'number',
      table: { category: 'Behavior', defaultValue: { summary: '3' } },
    },
    keyField: {
      description:
        '指定產生 :key 的欄位名稱；未設定時物件項目會使用內部穩定 key，原始型別則依值與出現順序產生 key',
      control: false,
      table: { category: 'Data' },
    },
    threshold: {
      description: '距離捲動末端多少 px 時觸發 reach-end 事件',
      control: 'number',
      table: { category: 'Behavior', defaultValue: { summary: '0' } },
    },
    loading: {
      description: 'true 時抑制重複 reach-end emit，直至 items 長度增加後自動重置',
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    ariaLabel: {
      description: '整個列表的無障礙標籤',
      control: 'text',
      table: { category: 'A11y' },
    },
  },
  args: {
    items: defaultItems,
    itemSize: ITEM_HEIGHT,
    direction: 'vertical',
    overscan: 3,
    threshold: 0,
    loading: false,
  },
} satisfies Meta<VirtualListProps<ListItem>>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default（10,000 筆垂直列表）─────────────────────────────────

export const Default: Story = {
  args: {
    ariaLabel: '大型垂直列表示範',
  },
  render: (args) => ({
    components: { VirtualList },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 400px; border: 1px solid oklch(88% 0.01 264); border-radius: 8px; overflow: hidden;">
        <VirtualList v-bind="args">
          <template #default="{ item, index }">
            <div style="display: flex; align-items: center; padding: 0 16px; height: 100%; border-bottom: 1px solid oklch(88% 0.01 264); font-size: 0.875rem; color: oklch(35% 0.02 264);">
              <span style="color: oklch(45% 0.02 264); margin-right: 12px; min-width: 48px;">#{{ index + 1 }}</span>
              {{ item.label }}
            </div>
          </template>
        </VirtualList>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 驗證 list role
    const list = canvas.getByRole('list')
    await expect(list).toBeInTheDocument()
    await expect(list).toHaveAttribute('aria-label', '大型垂直列表示範')

    // 初始狀態：畫面上只有少量 DOM 節點（遠小於 10,000 筆）
    const items = canvas.getAllByRole('listitem')
    await expect(items.length).toBeLessThan(30)

    // 驗證第一個項目的 ARIA 屬性
    await expect(items[0]).toHaveAttribute('aria-posinset', '1')
    await expect(items[0]).toHaveAttribute('aria-setsize', '10000')

    // 捲動後應渲染新的項目
    const container = canvasElement.querySelector('.virtual-list') as HTMLElement
    container.scrollTop = ITEM_HEIGHT * 100
    // 觸發 scroll 事件讓元件更新
    container.dispatchEvent(new Event('scroll'))

    await waitFor(() => {
      const itemsAfterScroll = canvas.getAllByRole('listitem')
      expect(itemsAfterScroll.length).toBeLessThan(30)

      // 第一個可見項目應在 index 100 附近（含 overscan 偏移）
      const firstPosinset = Number(itemsAfterScroll[0]?.getAttribute('aria-posinset') ?? '0')
      expect(firstPosinset).toBeGreaterThan(90)
    })
  },
}

// ─── Horizontal（水平捲動列表）───────────────────────────────────

export const Horizontal: Story = {
  args: {
    items: generateItems(500),
    itemSize: 160,
    direction: 'horizontal',
    ariaLabel: '水平捲動列表示範',
  },
  render: (args) => ({
    components: { VirtualList },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 600px; height: 120px; border: 1px solid oklch(88% 0.01 264); border-radius: 8px; overflow: hidden;">
        <VirtualList v-bind="args">
          <template #default="{ item, index }">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; border-right: 1px solid oklch(88% 0.01 264); gap: 4px;">
              <span style="font-size: 0.75rem; color: oklch(45% 0.02 264);">#{{ index + 1 }}</span>
              <span style="font-size: 0.875rem; color: oklch(15% 0.02 264);">{{ item.label }}</span>
            </div>
          </template>
        </VirtualList>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const list = canvas.getByRole('list')
    await expect(list).toBeInTheDocument()

    const items = canvas.getAllByRole('listitem')
    await expect(items.length).toBeLessThan(20)

    // 捲動水平方向
    const container = canvasElement.querySelector('.virtual-list') as HTMLElement
    container.scrollLeft = 160 * 10
    container.dispatchEvent(new Event('scroll'))

    await waitFor(() => {
      const itemsAfterScroll = canvas.getAllByRole('listitem')
      const firstPosinset = Number(itemsAfterScroll[0]?.getAttribute('aria-posinset') ?? '0')
      expect(firstPosinset).toBeGreaterThan(5)
    })
  },
}

// ─── DirectionToggle（執行期切換方向）─────────────────────────────

export const DirectionToggle: Story = {
  args: {
    items: generateItems(200),
    itemSize: 40,
    direction: 'vertical',
    overscan: 3,
    ariaLabel: '方向切換列表示範',
  },
  render: (args) => ({
    components: { VirtualList },
    setup() {
      const direction = ref<'vertical' | 'horizontal'>(
        (args as VirtualListProps<ListItem>).direction ?? 'vertical',
      )

      function toggleDirection() {
        direction.value = direction.value === 'vertical' ? 'horizontal' : 'vertical'
      }

      return { args, direction, toggleDirection }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 800px;">
        <button
          type="button"
          style="align-self: flex-start; padding: 6px 16px; background: oklch(55% 0.2 264); color: oklch(98% 0.01 264); border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem;"
          @click="toggleDirection"
        >
          切換方向
        </button>
        <div style="height: 120px; border: 1px solid oklch(88% 0.01 264); border-radius: 8px; overflow: hidden;">
          <VirtualList v-bind="args" :direction="direction">
            <template #default="{ item, index }">
              <div style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; border-right: 1px solid oklch(88% 0.01 264); border-bottom: 1px solid oklch(88% 0.01 264); font-size: 0.875rem; color: oklch(35% 0.02 264);">
                {{ index + 1 }} - {{ item.label }}
              </div>
            </template>
          </VirtualList>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const initialItems = canvas.getAllByRole('listitem')
    await expect(initialItems.length).toBeLessThan(12)

    const toggleButton = canvas.getByRole('button', { name: '切換方向' })
    await userEvent.click(toggleButton)

    await waitFor(() => {
      const container = canvasElement.querySelector('.virtual-list') as HTMLElement
      expect(container.classList.contains('virtual-list--horizontal')).toBe(true)

      const toggledItems = canvas.getAllByRole('listitem')
      expect(toggledItems.length).toBeGreaterThan(20)
    })
  },
}

// ─── InfiniteScroll（無限捲動）───────────────────────────────────

export const InfiniteScroll: Story = {
  args: {
    items: generateItems(50),
    itemSize: ITEM_HEIGHT,
    threshold: 200,
    ariaLabel: '無限捲動列表示範',
  },
  render: (args) => ({
    components: { VirtualList },
    setup() {
      const items = ref<ListItem[]>(generateItems(50))
      const loading = ref(false)

      function onReachEnd() {
        if (loading.value) return
        loading.value = true
        setTimeout(() => {
          const newItems = generateItems(50, items.value.length)
          items.value = [...items.value, ...newItems]
          loading.value = false
        }, 500)
      }

      return { args, items, loading, onReachEnd }
    },
    template: `
      <div style="height: 400px; border: 1px solid oklch(88% 0.01 264); border-radius: 8px; overflow: hidden;">
        <VirtualList
          v-bind="args"
          :items="items"
          :loading="loading"
          @reach-end="onReachEnd"
        >
          <template #default="{ item, index }">
            <div style="display: flex; align-items: center; padding: 0 16px; height: 100%; border-bottom: 1px solid oklch(88% 0.01 264); font-size: 0.875rem; color: oklch(35% 0.02 264);">
              <span style="color: oklch(45% 0.02 264); margin-right: 12px;">#{{ index + 1 }}</span>
              {{ item.label }}
            </div>
          </template>
        </VirtualList>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 初始 50 筆
    const list = canvas.getByRole('list')
    await expect(list).toBeInTheDocument()

    // 捲動到底部觸發 reach-end
    const container = canvasElement.querySelector('.virtual-list') as HTMLElement
    container.scrollTop = container.scrollHeight
    container.dispatchEvent(new Event('scroll'))

    await waitFor(() => {
      // items 應已增加到 100 筆
      const items = canvas.getAllByRole('listitem')
      const lastPosinset = Number(items[items.length - 1]?.getAttribute('aria-setsize') ?? '0')
      expect(lastPosinset).toBeGreaterThan(50)
    })
  },
}

// ─── Empty（空狀態）──────────────────────────────────────────────

export const Empty: Story = {
  args: {
    items: [],
    itemSize: ITEM_HEIGHT,
    ariaLabel: '空列表',
  },
  render: (args) => ({
    components: { VirtualList },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 300px; border: 1px solid oklch(88% 0.01 264); border-radius: 8px; overflow: hidden;">
        <VirtualList v-bind="args">
          <template #empty>
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: oklch(45% 0.02 264); gap: 8px;">
              <span style="font-size: 2rem;">📭</span>
              <span style="font-size: 0.875rem;">目前沒有資料</span>
            </div>
          </template>
        </VirtualList>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // list role 不應存在（items 為空時不渲染）
    await expect(canvas.queryByRole('list')).toBeNull()

    // empty slot 內容應可見
    await expect(canvas.getByText('目前沒有資料')).toBeInTheDocument()
  },
}

// ─── ScrollToIndex（命令式捲動）──────────────────────────────────

export const ScrollToIndex: Story = {
  args: {
    items: defaultItems,
    itemSize: ITEM_HEIGHT,
    ariaLabel: 'scrollToIndex 示範',
  },
  render: (args) => ({
    components: { VirtualList },
    setup() {
      const listRef = ref<VirtualListExpose | null>(null)

      function jumpTo500() {
        listRef.value?.scrollToIndex(499)
      }

      return { args, listRef, jumpTo500 }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <button
          type="button"
          aria-label="跳至第 500 筆"
          style="align-self: flex-start; padding: 6px 16px; background: oklch(55% 0.2 264); color: oklch(98% 0.01 264); border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem;"
          @click="jumpTo500"
        >
          跳至第 500 筆
        </button>
        <div style="height: 400px; border: 1px solid oklch(88% 0.01 264); border-radius: 8px; overflow: hidden;">
          <VirtualList ref="listRef" v-bind="args">
            <template #default="{ item, index }">
              <div style="display: flex; align-items: center; padding: 0 16px; height: 100%; border-bottom: 1px solid oklch(88% 0.01 264); font-size: 0.875rem; color: oklch(35% 0.02 264);">
                <span style="color: oklch(45% 0.02 264); margin-right: 12px; min-width: 48px;">#{{ index + 1 }}</span>
                {{ item.label }}
              </div>
            </template>
          </VirtualList>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const jumpBtn = canvas.getByRole('button', { name: '跳至第 500 筆' })
    await userEvent.click(jumpBtn)

    await waitFor(() => {
      // 捲動後 index 499 的項目應出現在 DOM 中
      const items = canvas.getAllByRole('listitem')
      const posInsets = items.map((el) => Number(el.getAttribute('aria-posinset')))
      expect(posInsets).toContain(500)
    })
  },
}
