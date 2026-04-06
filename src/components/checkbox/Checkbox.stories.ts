import { expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Checkbox from './Checkbox.vue'

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: 'v-model 綁定值',
      control: 'boolean',
      table: { category: 'State' },
    },
    indeterminate: {
      description: '半選狀態（standalone 時手動傳入）',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    label: {
      description: '純文字 label（插入 default slot 時，slot 優先）',
      control: 'text',
      table: { category: 'Appearance' },
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
    error: {
      description: '是否為錯誤狀態',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    errorMsg: {
      description: '錯誤訊息（傳入時自動啟用 error 狀態）',
      control: 'text',
      table: { category: 'State' },
    },
    required: {
      description: '是否必填',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    color: {
      description: '勾選框顏色（任意 CSS 色彩值，預設 var(--rui-color-default)）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    value: {
      description: 'CheckboxGroup 中代表的值',
      control: false,
      table: { category: 'Group' },
    },
    id: {
      control: false,
      table: { category: 'Accessibility' },
    },
    name: {
      control: 'text',
      table: { category: 'Accessibility' },
    },
  },
  args: {
    modelValue: false,
    indeterminate: false,
    label: '同意服務條款',
    size: 'md',
    disabled: false,
    error: false,
    errorMsg: '',
    required: false,
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Checkbox },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<Checkbox v-bind="args" @update:model-value="updateArgs({ modelValue: $event })" />',
    }
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { modelValue: true },
}

export const Indeterminate: Story = {
  args: { modelValue: false, indeterminate: true },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox')

    await expect(checkbox).toBeVisible()
    await expect(checkbox).toBeDisabled()

    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
  },
}

export const DisabledChecked: Story = {
  args: { disabled: true, modelValue: true },
}

export const Error: Story = {
  args: { error: true, errorMsg: '請同意服務條款' },
}

export const Sizes: Story = {
  render: () => ({
    components: { Checkbox },
    template: `
      <div class="flex flex-col gap-3">
        <Checkbox size="sm" label="Small (sm)" />
        <Checkbox size="md" label="Medium (md)" />
        <Checkbox size="lg" label="Large (lg)" />
      </div>
    `,
  }),
}

export const Interaction: Story = {
  render: () => ({
    components: { Checkbox },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: '<Checkbox v-model="checked" label="互動測試" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: '互動測試' })

    await expect(checkbox).toBeVisible()
    await expect(checkbox).not.toBeChecked()
    await expect(checkbox).not.toBeDisabled()

    // Click to check
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()

    // Click to uncheck
    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()

    // Keyboard: after click, focus is already on the checkbox; Space to toggle
    await expect(checkbox).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(checkbox).toBeChecked()
  },
}
