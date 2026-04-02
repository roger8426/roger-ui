import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from './Button.vue'
import Icon from '../icon/Icon.vue'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: '按鈕的 HTML type 屬性',
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    bgColor: {
      description:
        '背景顏色（任意 CSS 色彩值，預設使用 --color-default token；outline 模式忽略此值，固定為透明）',
      control: 'color',
    },
    textColor: {
      description: '文字顏色（任意 CSS 色彩值，預設使用 --color-default-foreground token）',
      control: 'color',
    },
    borderColor: {
      description: '邊框顏色（任意 CSS 色彩值，未設定則無邊框）',
      control: 'color',
    },
    size: {
      description: '按鈕尺寸',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    radius: {
      description: '圓角半徑（px 數值，或 \'full\' 表示完整圓形），預設 \'full\'',
      control: 'text',
    },
    outline: {
      description: '是否為 outline 模式（透明背景、主色邊框與文字）',
      control: 'boolean',
    },
    loading: {
      description: '是否顯示載入中狀態（自動鎖定互動、顯示 spinner）',
      control: 'boolean',
    },
    disabled: {
      description: '是否停用按鈕',
      control: 'boolean',
    },
    default: {
      description: 'Button 的文字內容（default slot）',
      control: 'text',
    },
  },
  args: {
    size: 'md',
    disabled: false,
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Button</Button>',
  }),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomColor: Story = {
  args: {
    bgColor: '#d0391e',
    textColor: '#f8f9ff',
  },
}

export const Outline: Story = {
  args: { outline: true },
}

export const CustomRadius: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:12px;">
        <Button v-bind="args" :radius="0">Square</Button>
        <Button v-bind="args" :radius="8">Rounded</Button>
        <Button v-bind="args" radius="full">Full</Button>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; align-items:center; gap:12px;">
        <Button v-bind="args" size="sm">Small</Button>
        <Button v-bind="args" size="md">Medium</Button>
        <Button v-bind="args" size="lg">Large</Button>
      </div>
    `,
  }),
}

export const Loading: Story = {
  args: { loading: true },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    await expect(button).toBeVisible()
    await expect(button).toBeDisabled()
    await userEvent.click(button)
    await expect(button).toBeDisabled()
  },
}

export const WithIcon: Story = {
  render: (args) => ({
    components: { Button, Icon },
    setup: () => ({ args }),
    template: `
      <Button v-bind="args">
        <Icon name="close" :size="16" class="mr-1" />
        Close
      </Button>
    `,
  }),
}

export const Interaction: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Click me</Button>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Click me' })

    await expect(button).toBeVisible()
    await expect(button).not.toBeDisabled()

    await userEvent.tab()
    await expect(button).toHaveFocus()

    await userEvent.click(button)
    await expect(button).toBeVisible()
  },
}
