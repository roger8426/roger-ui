import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from './Button.vue'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    color: {
      description: '背景顏色（任意 CSS 色彩值，預設使用 --color-default token）',
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
    outline: {
      description: '是否為 outline 模式（透明背景、主色邊框與文字）',
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
    color: '#d0391e',
    textColor: '#f8f9ff',
  },
}

export const Outline: Story = {
  args: { outline: true },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Disabled: Story = {
  args: { disabled: true },
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
