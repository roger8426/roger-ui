import { expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { ConcreteComponent } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Carousel from './Carousel.vue'
import type { CarouselProps } from './types'

interface SlideItem {
  id: number
  label: string
  bg: string
}

const sampleItems: SlideItem[] = [
  { id: 1, label: '第一張投影片', bg: 'oklch(75% 0.12 264)' },
  { id: 2, label: '第二張投影片', bg: 'oklch(75% 0.12 134)' },
  { id: 3, label: '第三張投影片', bg: 'oklch(75% 0.12 25)' },
  { id: 4, label: '第四張投影片', bg: 'oklch(75% 0.12 300)' },
  { id: 5, label: '第五張投影片', bg: 'oklch(75% 0.12 60)' },
]

const slideTemplate = `
  <template #default="{ item }">
    <div :style="{ background: item.bg, height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold', color: 'oklch(12% 0.01 264)', borderRadius: '8px' }">
      {{ item.label }}
    </div>
  </template>
`

const meta = {
  title: 'Layout/Carousel',
  // generic component 需型別斷言，Storybook Meta 的型別系統不支援 Vue 3 generic SFC
  component: Carousel as unknown as ConcreteComponent<CarouselProps<SlideItem>>,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: '受控模式：目前顯示的 slide index（0-based）',
      control: 'number',
      table: { category: 'State' },
    },
    fade: {
      description: '是否使用淡入淡出切換動畫（預設為水平滑動）',
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
    loop: {
      description: '是否啟用循環模式（首尾相接）',
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    autoplay: {
      description: '是否自動播放',
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    delay: {
      description: '自動播放間隔（毫秒）',
      control: 'number',
      table: { category: 'Behavior', defaultValue: { summary: '3000' } },
    },

    pauseOnHover: {
      description: '滑鼠 hover 時是否暫停自動播放',
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'true' } },
    },
    showArrows: {
      description: '是否顯示前/後箭頭按鈕',
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
    showDots: {
      description: '是否顯示分頁點（dots）',
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
    dotColor: {
      description: 'dot 顏色（任意 CSS 色彩值，預設使用 --rui-carousel-dot-color token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    ariaLabel: {
      description: '輪播區域的 aria-label，用於多輪播並存時的無障礙標示',
      control: 'text',
      table: { category: 'A11y', defaultValue: { summary: 'carousel' } },
    },
  },
  args: {
    items: sampleItems,
    fade: false,
    loop: false,
    autoplay: false,
    delay: 3000,
    pauseOnHover: true,
    showArrows: true,
    showDots: true,
    ariaLabel: 'carousel',
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Carousel },
      setup() {
        function onUpdate(index: number) {
          updateArgs({ modelValue: index })
        }
        return { args, onUpdate, sampleItems }
      },
      template: `
        <div style="width: 480px;">
          <Carousel v-bind="args" :items="sampleItems" @update:modelValue="onUpdate">
            ${slideTemplate}
          </Carousel>
        </div>
      `,
    }
  },
} satisfies Meta<CarouselProps<SlideItem>>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default ──────────────────────────────────────────────────────

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const region = canvas.getByRole('region')
    await expect(region).toHaveAttribute('aria-roledescription', 'carousel')

    // 初始狀態：第一張可見（含 aria-hidden slide 一起取，避免互動後索引錯位）
    const slides = canvas.getAllByRole('group', { hidden: true })
    await expect(slides[0]).not.toHaveAttribute('aria-hidden')

    // 點擊 Next
    const nextBtn = canvas.getByRole('button', { name: 'Next slide' })
    await userEvent.click(nextBtn)

    await expect(slides[0]).toHaveAttribute('aria-hidden', 'true')
    await expect(slides[1]).not.toHaveAttribute('aria-hidden')
  },
}

// ─── WithAutoplay ─────────────────────────────────────────────────

export const WithAutoplay: Story = {
  args: {
    items: sampleItems,
    autoplay: true,
    delay: 800,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // autoplay 啟動後，導航按鈕應依然可用
    const nextBtn = canvas.getByRole('button', { name: 'Next slide' })
    await expect(nextBtn).toBeInTheDocument()
  },
}

// ─── FadeEffect ───────────────────────────────────────────────────

export const FadeEffect: Story = {
  args: {
    items: sampleItems,
    fade: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 互動前先取，確保全部 slide 的 DOM 參照都在陣列中
    const slides = canvas.getAllByRole('group', { hidden: true })
    const nextBtn = canvas.getByRole('button', { name: 'Next slide' })
    await userEvent.click(nextBtn)

    await expect(slides[0]).toHaveAttribute('aria-hidden', 'true')
    await expect(slides[1]).not.toHaveAttribute('aria-hidden')
  },
}

// ─── LoopMode ─────────────────────────────────────────────────────

export const LoopMode: Story = {
  args: {
    items: sampleItems,
    loop: true,
    modelValue: 4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 最後一張，點 Next → 回到第一張
    const nextBtn = canvas.getByRole('button', { name: 'Next slide' })
    await expect(nextBtn).not.toBeDisabled()

    await userEvent.click(nextBtn)

    const slides = canvas.getAllByRole('group', { hidden: true })
    await expect(slides[0]).not.toHaveAttribute('aria-hidden')
  },
}

// ─── KeyboardNav ──────────────────────────────────────────────────

export const KeyboardNav: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const viewport = canvasElement.querySelector('.carousel-viewport') as HTMLElement
    viewport.focus()

    // 互動前先取，確保全部 slide 的 DOM 參照都在陣列中
    const slides = canvas.getAllByRole('group', { hidden: true })
    await userEvent.keyboard('{ArrowRight}')

    await expect(slides[0]).toHaveAttribute('aria-hidden', 'true')
    await expect(slides[1]).not.toHaveAttribute('aria-hidden')

    await new Promise((resolve) => setTimeout(resolve, 400))

    // Home → 回到第一張
    await userEvent.keyboard('{Home}')
    await expect(slides[0]).not.toHaveAttribute('aria-hidden')
  },
}

// ─── Controlled ───────────────────────────────────────────────────

export const Controlled: Story = {
  args: {
    items: sampleItems,
    modelValue: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const slides = canvas.getAllByRole('group', { hidden: true })
    // modelValue: 2 → 第三張應為 active
    await expect(slides[2]).not.toHaveAttribute('aria-hidden')
    await expect(slides[0]).toHaveAttribute('aria-hidden', 'true')
  },
}

// ─── NoArrows ─────────────────────────────────────────────────────

export const NoArrows: Story = {
  args: {
    items: sampleItems,
    showArrows: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const arrows = canvas.queryAllByRole('button', { name: /(Previous|Next) slide/i })
    await expect(arrows).toHaveLength(0)
  },
}

// ─── NoDots ───────────────────────────────────────────────────────

export const NoDots: Story = {
  args: {
    items: sampleItems,
    showDots: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dots = canvas.queryAllByRole('button', { name: /Go to slide/i })
    await expect(dots).toHaveLength(0)
  },
}
