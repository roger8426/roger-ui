import { useArgs } from 'storybook/preview-api'
import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Badge from './Badge.vue'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    dot: {
      description: '圓點模式（不顯示文字，僅渲染固定尺寸圓點）',
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    value: {
      description: '計數值（存在時進入計數模式並顯示數字；與 dot 同時設定時 dot 優先）',
      control: 'number',
      table: { category: 'Appearance' },
    },
    max: {
      description: '計數上限，超過時顯示 "{max}+"，預設 99',
      control: 'number',
      table: { category: 'Appearance', defaultValue: { summary: '99' } },
    },
    size: {
      description: '元件尺寸',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    outline: {
      description: '是否為 outline 模式（透明背景、主色邊框與文字）',
      control: 'boolean',
      table: { category: 'Appearance' },
    },
    bgColor: {
      description:
        '背景顏色（任意 CSS 色彩値，預設使用 --rui-color-default token；outline 模式忽略此值，固定為透明）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    textColor: {
      description:
        '文字顏色（任意 CSS 色彩値；一般模式預設 --rui-color-default-foreground，outline 模式預設 --rui-color-default）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    borderColor: {
      description: '邊框顏色（任意 CSS 色彩值，未設定則無邊框）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    radius: {
      description: "圓角半徑（px 數值，或 'full' 表示完整膠囊形），預設 'full'",
      control: 'text',
      table: { category: 'Appearance', defaultValue: { summary: 'full' } },
    },
    default: {
      description: 'Badge 的文字內容（default slot，標籤模式使用）',
      control: 'text',
      table: { category: 'Slots' },
    },
  },
  args: {
    size: 'md',
    dot: false,
    outline: false,
  },
  render: () => {
    const [args] = useArgs()
    return {
      components: { Badge },
      setup() {
        return { args }
      },
      template: '<Badge v-bind="args">Active</Badge>',
    }
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outline: Story = {
  args: { outline: true },
}

export const Count: Story = {
  args: { value: 5 },
  render: () => {
    const [args] = useArgs()
    return {
      components: { Badge },
      setup() {
        return { args }
      },
      template: '<Badge v-bind="args" />',
    }
  },
}

export const CountMax: Story = {
  args: { value: 120, max: 99 },
  render: () => {
    const [args] = useArgs()
    return {
      components: { Badge },
      setup() {
        return { args }
      },
      template: '<Badge v-bind="args" />',
    }
  },
}

export const Dot: Story = {
  args: { dot: true },
  render: () => {
    const [args] = useArgs()
    return {
      components: { Badge },
      setup() {
        return { args }
      },
      template: '<Badge v-bind="args" />',
    }
  },
}

export const Sizes: Story = {
  render: () => {
    const [args] = useArgs()
    return {
      components: { Badge },
      setup() {
        return { args }
      },
      template: `
        <div style="display:flex; align-items:center; gap:12px;">
          <Badge v-bind="args" size="sm">Small</Badge>
          <Badge v-bind="args" size="md">Medium</Badge>
          <Badge v-bind="args" size="lg">Large</Badge>
        </div>
      `,
    }
  },
}

export const CountMaxInteraction: Story = {
  args: { value: 120, max: 99 },
  render: () => {
    const [args] = useArgs()
    return {
      components: { Badge },
      setup() {
        return { args }
      },
      template: '<Badge v-bind="args" />',
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByRole('status')
    await expect(badge).toHaveTextContent('99+')
    await expect(badge).toHaveAttribute('aria-label', '99+ 則通知')
  },
}
