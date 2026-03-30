import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from './Button.vue'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    textColor: { control: 'color' },
    borderColor: { control: 'color' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    outline: { control: 'boolean' },
    disabled: { control: 'boolean' },
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

export const Outlined: Story = {
  args: {
    color: '#ffffff00',
    textColor: '#3b5bdb',
    borderColor: '#3b5bdb',
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
    await userEvent.click(button)
    await expect(button).toBeVisible()
  },
}
