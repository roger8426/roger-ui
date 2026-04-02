import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Icon from './Icon.vue'

const meta = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      description: '圖示名稱，對應 assets/icons/{name}.svg',
      control: 'select',
      options: ['list', 'check', 'close'],
      table: {
        category: 'Appearance',
      },
    },
    size: {
      description: '圖示尺寸（px）',
      control: { type: 'number', min: 8, max: 128, step: 4 },
      table: {
        category: 'Appearance',
        defaultValue: { summary: '20' },
      },
    },
    color: {
      description: '圖示顏色（任意 CSS 色彩值），未設定則繼承 currentColor',
      control: 'color',
      table: {
        category: 'Appearance',
      },
    },
    ariaLabel: {
      description: '無障礙標籤，設定後加上 role="img"',
      control: 'text',
      table: {
        category: 'Accessibility',
      },
    },
  },
  args: {
    name: 'list',
    size: 20,
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Check: Story = {
  args: { name: 'check' },
}

export const Close: Story = {
  args: { name: 'close' },
}

export const Sizes: Story = {
  render: () => ({
    components: { Icon },
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <Icon name="list" :size="12" />
        <Icon name="list" :size="16" />
        <Icon name="list" :size="20" />
        <Icon name="list" :size="24" />
        <Icon name="list" :size="32" />
      </div>
    `,
  }),
}

export const CustomColor: Story = {
  args: {
    name: 'check',
    size: 24,
    color: 'oklch(55% 0.2 264)',
  },
}

export const WithAriaLabel: Story = {
  args: {
    name: 'list',
    ariaLabel: '選單',
  },
}

export const UnknownName: Story = {
  args: {
    name: 'does-not-exist',
  },
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.icon') as HTMLElement
    await expect(icon).not.toBeNull()
    await expect(icon.querySelector('svg')).toBeNull()
  },
}

export const Interaction: Story = {
  args: {
    name: 'list',
    size: 20,
  },
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.icon') as HTMLElement
    await expect(icon).not.toBeNull()
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon.querySelector('svg')).not.toBeNull()
  },
}

export const InteractionWithLabel: Story = {
  args: {
    name: 'list',
    size: 20,
    ariaLabel: '清單圖示',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const icon = canvas.getByRole('img', { name: '清單圖示' })
    await expect(icon).toBeVisible()
    await expect(icon).toHaveAttribute('aria-label', '清單圖示')
  },
}
