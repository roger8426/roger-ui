import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Icon from './Icon.vue'

const iconModules = import.meta.glob('../../assets/icons/*.svg', {
  query: '?raw',
  eager: true,
})

const allIconNames = Object.keys(iconModules)
  .map((path) => path.replace('../../assets/icons/', '').replace('.svg', ''))
  .sort()

const meta = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      description: '圖示名稱，對應 assets/icons/{name}.svg',
      control: 'select',
      options: allIconNames,
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

export const UnknownName: Story = {
  args: {
    name: 'does-not-exist',
  },
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('[aria-hidden="true"]')
    await expect(icon).not.toBeNull()
    await expect(icon?.querySelector('svg') ?? null).toBeNull()
  },
}

export const DefaultState: Story = {
  args: {
    name: 'list',
    size: 20,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const icon = canvasElement.querySelector('[aria-hidden="true"]')
    await expect(icon).not.toBeNull()
    await expect(canvas.queryAllByRole('img')).toHaveLength(0)
    await expect(icon?.querySelector('svg')).not.toBeNull()
  },
}

export const AllIcons: Story = {
  render: () => ({
    components: { Icon },
    setup() {
      return { icons: allIconNames }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 24px; padding: 16px;">
        <div v-for="name in icons" :key="name" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <Icon :name="name" :size="24" />
          <span style="font-size: 12px; color: #666;">{{ name }}</span>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const icons = canvasElement.querySelectorAll('[aria-hidden="true"]')
    await expect(icons.length).toBe(allIconNames.length)

    for (const icon of icons) {
      await expect(icon.querySelector('svg')).not.toBeNull()
    }
  },
}
