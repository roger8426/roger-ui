import { expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Icon from '../icon/Icon.vue'
import Toggle from './Toggle.vue'

const meta = {
  title: 'Form/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: 'v-model 綁定值',
      control: 'boolean',
      table: { category: 'State' },
    },
    size: {
      description: '元件尺寸',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    disabled: {
      description: '是否停用',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    required: {
      description: '是否必填',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    color: {
      description: '自訂啟用狀態軌道顏色（任意 CSS 色彩值，預設 var(--rui-color-default)）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    id: {
      control: false,
      table: { category: 'Accessibility' },
    },
    name: {
      control: 'text',
      table: { category: 'Accessibility' },
    },
    ariaLabel: {
      description: '直接設定 switch 的 aria-label（無視覺文字時需提供，供無障礙輔助技術讀取）',
      control: 'text',
      table: { category: 'Accessibility' },
    },
  },
  args: {
    modelValue: false,
    size: 'md',
    disabled: false,
    required: false,
    color: undefined,
    ariaLabel: 'Toggle',
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Toggle },
      setup() {
        return { args, updateArgs }
      },
      template: '<Toggle v-bind="args" @update:model-value="updateArgs({ modelValue: $event })" />',
    }
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { modelValue: true },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggleInput = canvas.getByRole('switch')

    await expect(toggleInput).toBeVisible()
    await expect(toggleInput).toBeDisabled()

    await userEvent.click(toggleInput)
    await expect(toggleInput).not.toBeChecked()
  },
}

export const DisabledChecked: Story = {
  args: { disabled: true, modelValue: true },
}

export const WithIconInThumb: Story = {
  render: () => ({
    components: { Toggle, Icon },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: `
      <Toggle v-model="checked">
        <Icon v-if="checked" name="check" :size="8" color="oklch(100% 0 0)" />
        <Icon v-else name="close" :size="8" color="oklch(50% 0.01 264)" />
      </Toggle>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Toggle },
    setup() {
      const sm = ref(false)
      const md = ref(false)
      const lg = ref(false)
      return { sm, md, lg }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <Toggle v-model="sm" size="sm" />
        <Toggle v-model="md" size="md" />
        <Toggle v-model="lg" size="lg" />
      </div>
    `,
  }),
}

export const CustomColor: Story = {
  args: {
    modelValue: true,
    color: 'oklch(55% 0.18 145)',
  },
}

export const Interaction: Story = {
  render: () => ({
    components: { Toggle },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: '<Toggle v-model="checked" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggleInput = canvas.getByRole('switch')

    await expect(toggleInput).toBeVisible()
    await expect(toggleInput).not.toBeChecked()
    await expect(toggleInput).not.toBeDisabled()

    // 切換為開啟
    await userEvent.click(toggleInput)
    await expect(toggleInput).toBeChecked()

    // 切換回關閉
    await userEvent.click(toggleInput)
    await expect(toggleInput).not.toBeChecked()
  },
}
