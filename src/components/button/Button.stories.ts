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
    label: 'Button',
    size: 'md',
    disabled: false,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomColor: Story = {
  args: {
    color: 'oklch(58% 0.22 15)',
    textColor: 'oklch(98% 0.01 255)',
  },
}

export const Outlined: Story = {
  args: {
    color: 'transparent',
    textColor: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
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
  args: { label: 'Click me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Click me' })
    await userEvent.click(button)
    await expect(button).toBeVisible()
  },
}
