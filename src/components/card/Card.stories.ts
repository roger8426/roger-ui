import { expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Card from './Card.vue'

const meta = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    shadow: {
      description: '陰影濃度',
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    padding: {
      description: '內距（px）',
      control: 'number',
      table: { category: 'Appearance', defaultValue: { summary: '16' } },
    },
    radius: {
      description: "圓角（px 數值，或 'full' 表示完整圓形），預設 12",
      control: 'text',
      table: { category: 'Appearance', defaultValue: { summary: '12' } },
    },
    bgColor: {
      description: '背景顏色（任意 CSS 色彩值，預設使用 --rui-color-card-bg token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    hoverable: {
      description: 'hover 時是否顯示上浮效果，shadow: none 時僅有位移無陰影增強',
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
    default: {
      description: '卡片主要內容插槽',
      control: false,
      table: { category: 'Slots' },
    },
    cover: {
      description: '封面插槽，置於卡片最頂部，不含內距',
      control: false,
      table: { category: 'Slots' },
    },
    header: {
      description: '標題插槽，含底部分隔線',
      control: false,
      table: { category: 'Slots' },
    },
    footer: {
      description: '底部插槽，含頂部分隔線',
      control: false,
      table: { category: 'Slots' },
    },
  },
  args: {
    shadow: 'md',
    padding: 16,
    radius: 12,
    hoverable: false,
  },
  render: () => {
    const [args] = useArgs()
    return {
      components: { Card },
      setup() {
        return { args }
      },
      template: `
        <Card v-bind="args" style="width: 320px">
          <p class="text-sm" style="color: oklch(40% 0.01 264)">這是卡片的主要內容區域。</p>
        </Card>
      `,
    }
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllShadows: Story = {
  render: () => ({
    components: { Card },
    template: `
      <div style="display: flex; gap: 24px; flex-wrap: wrap; padding: 24px;">
        <div v-for="level in ['none', 'sm', 'md', 'lg']" :key="level" style="display: flex; flex-direction: column; align-items: center; gap: 8px">
          <Card :shadow="level" style="width: 200px">
            <p style="font-size: 12px; color: oklch(40% 0.01 264)">shadow: {{ level }}</p>
          </Card>
          <span style="font-size: 11px; color: oklch(55% 0.005 264)">{{ level }}</span>
        </div>
      </div>
    `,
  }),
}

export const WithHeader: Story = {
  render: () => {
    const [args] = useArgs()
    return {
      components: { Card },
      setup() {
        return { args }
      },
      template: `
        <Card v-bind="args" style="width: 320px">
          <template #header>
            <p style="font-weight: 600; color: oklch(20% 0.01 264)">卡片標題</p>
          </template>
          <p class="text-sm" style="color: oklch(40% 0.01 264)">這是卡片的主要內容區域。</p>
        </Card>
      `,
    }
  },
}

export const WithFooter: Story = {
  render: () => {
    const [args] = useArgs()
    return {
      components: { Card },
      setup() {
        return { args }
      },
      template: `
        <Card v-bind="args" style="width: 320px">
          <template #header>
            <p style="font-weight: 600; color: oklch(20% 0.01 264)">卡片標題</p>
          </template>
          <p class="text-sm" style="color: oklch(40% 0.01 264)">這是卡片的主要內容區域。</p>
          <template #footer>
            <p class="text-xs" style="color: oklch(55% 0.005 264)">底部備註文字</p>
          </template>
        </Card>
      `,
    }
  },
}

export const WithCover: Story = {
  render: () => {
    const [args] = useArgs()
    return {
      components: { Card },
      setup() {
        return { args }
      },
      template: `
        <Card v-bind="args" style="width: 280px">
          <template #cover>
            <div style="height: 140px; background: oklch(90% 0.02 264); display: flex; align-items: center; justify-content: center;">
              <span style="color: oklch(38% 0.07 264); font-size: 12px;">封面圖片區域</span>
            </div>
          </template>
          <p style="font-weight: 600; color: oklch(20% 0.01 264); margin-bottom: 4px">卡片標題</p>
          <p class="text-sm" style="color: oklch(40% 0.01 264)">卡片描述文字內容。</p>
        </Card>
      `,
    }
  },
}

export const Hoverable: Story = {
  render: () => ({
    components: { Card },
    setup() {
      const raisedClicks = ref(0)
      const plainClicks = ref(0)

      return { raisedClicks, plainClicks }
    },
    template: `
      <div style="display: flex; gap: 24px; flex-wrap: wrap; padding: 24px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
          <Card hoverable style="width: 220px" @click="raisedClicks += 1">
            <p style="font-size: 13px; font-weight: 600; color: oklch(20% 0.01 264); margin-bottom: 4px">有陰影</p>
            <p style="font-size: 12px; color: oklch(40% 0.01 264)">hover 時陰影增強 + 上浮</p>
          </Card>
          <span style="font-size: 11px; color: oklch(55% 0.005 264)">有陰影點擊次數：{{ raisedClicks }}</span>
          <span style="font-size: 11px; color: oklch(55% 0.005 264)">shadow: md（預設）</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
          <Card hoverable shadow="none" style="width: 220px" @click="plainClicks += 1">
            <p style="font-size: 13px; font-weight: 600; color: oklch(20% 0.01 264); margin-bottom: 4px">無陰影</p>
            <p style="font-size: 12px; color: oklch(40% 0.01 264)">hover 時僅位移，無陰影增強</p>
          </Card>
          <span style="font-size: 11px; color: oklch(55% 0.005 264)">無陰影點擊次數：{{ plainClicks }}</span>
          <span style="font-size: 11px; color: oklch(55% 0.005 264)">shadow: none</span>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cards = canvas.getAllByRole('button')

    await expect(cards).toHaveLength(2)
    await expect(cards[0]).toHaveAttribute('tabindex', '0')
    await expect(cards[1]).toHaveAttribute('tabindex', '0')

    await userEvent.tab()
    await expect(cards[0]).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByText('有陰影點擊次數：1')).toBeVisible()

    await userEvent.tab()
    await expect(cards[1]).toHaveFocus()
    await userEvent.keyboard('{Space}')
    await expect(canvas.getByText('無陰影點擊次數：1')).toBeVisible()
  },
}

export const CustomColor: Story = {
  args: { bgColor: 'oklch(96% 0.02 264)' },
}
