import { expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Select from './Select.vue'
import type { SelectItem } from './types'

const baseOptions: SelectItem[] = [
  { value: 'tw', label: '台灣' },
  { value: 'jp', label: '日本' },
  { value: 'kr', label: '韓國' },
  { value: 'us', label: '美國' },
  { value: 'de', label: '德國' },
]

const groupedOptions: SelectItem[] = [
  {
    group: '亞洲',
    options: [
      { value: 'tw', label: '台灣' },
      { value: 'jp', label: '日本' },
      { value: 'kr', label: '韓國' },
    ],
  },
  {
    group: '歐美',
    options: [
      { value: 'us', label: '美國' },
      { value: 'de', label: '德國' },
      { value: 'fr', label: '法國', disabled: true },
    ],
  },
]

const meta = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: 'v-model 綁定值',
      control: 'text',
      table: { category: 'State' },
    },
    options: {
      description: '選項列表，支援 SelectOption 或 SelectOptionGroup',
      control: false,
      table: { category: 'State' },
    },
    size: {
      description: '元件尺寸',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    placeholder: {
      description: '佔位文字',
      control: 'text',
      table: { category: 'Appearance' },
    },
    searchable: {
      description: '是否可搜尋/過濾選項',
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
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
      description: '錯誤訊息文字（傳入時自動啟用 error 狀態）',
      control: 'text',
      table: { category: 'State' },
    },
    border: {
      description: '是否顯示邊框',
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
    borderColor: {
      description: '邊框顏色（任意 CSS 色彩值）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    color: {
      description: '文字顏色（任意 CSS 色彩值，預設繼承）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    dropdownBg: {
      description: '下拉面板背景顏色（任意 CSS 色彩値，預設使用 --rui-color-select-bg token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    optionHoverColor: {
      description:
        '選項 hover / keyboard focus 背景顏色（任意 CSS 色彩值，預設使用 --rui-color-surface-hover token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
  },
  args: {
    modelValue: null,
    options: baseOptions,
    size: 'md',
    placeholder: '請選擇...',
    searchable: false,
    disabled: false,
    error: false,
    border: true,
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Select },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<Select v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" style="width: 240px" />',
    }
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Searchable: Story = {
  args: {
    searchable: true,
    placeholder: '搜尋或選擇...',
  },
}

export const WithGroups: Story = {
  args: {
    options: groupedOptions,
  },
}

export const Sizes: Story = {
  render: () => ({
    components: { Select },
    setup() {
      const sm = ref(null)
      const md = ref(null)
      const lg = ref(null)
      return { sm, md, lg, baseOptions }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 240px; position: relative">
        <Select v-model="sm" :options="baseOptions" size="sm" placeholder="sm" />
        <Select v-model="md" :options="baseOptions" size="md" placeholder="md" />
        <Select v-model="lg" :options="baseOptions" size="lg" placeholder="lg" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: 'tw',
  },
}

export const ErrorWithMessage: Story = {
  args: {
    errorMsg: '請選擇一個國家',
  },
}

export const NoBorder: Story = {
  args: {
    border: false,
  },
}

export const Interaction: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Select },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<Select v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" style="width: 240px" />',
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 初始狀態：trigger 可見，listbox 未開啟
    const trigger = canvas.getByRole('combobox')
    await expect(trigger).toBeVisible()

    // 點擊展開 dropdown
    await userEvent.click(trigger)
    const listbox = canvas.getByRole('listbox')
    await expect(listbox).toBeVisible()

    // 選取第一個選項（台灣）
    const firstOption = canvas.getByRole('option', { name: '台灣' })
    await expect(firstOption).toBeVisible()
    await userEvent.click(firstOption)

    // dropdown 應關閉
    await expect(listbox).not.toBeVisible()

    // 再次點擊展開
    await userEvent.click(trigger)
    await expect(listbox).toBeVisible()

    // 鍵盤 Escape 關閉
    await userEvent.keyboard('{Escape}')
    await expect(listbox).not.toBeVisible()
  },
}

export const InteractionKeyboard: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Select },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<Select v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" style="width: 240px" />',
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox')

    // Tab 聚焦後 Enter 展開
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    const listbox = canvas.getByRole('listbox')
    await expect(listbox).toBeVisible()

    // ArrowDown 移動焦點，Enter 選取
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')
    await expect(listbox).not.toBeVisible()
  },
}

export const InteractionSearchable: Story = {
  args: {
    searchable: true,
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Select },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<Select v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" style="width: 240px" />',
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox')

    // 展開
    await userEvent.click(trigger)
    const listbox = canvas.getByRole('listbox')
    await expect(listbox).toBeVisible()

    // 輸入搜尋字詞過濾
    const searchInput = canvas.getByRole('textbox')
    await userEvent.type(searchInput, '日')

    // 只應出現「日本」
    const japanOption = canvas.getByRole('option', { name: '日本' })
    await expect(japanOption).toBeVisible()
    await expect(canvas.queryByRole('option', { name: '台灣' })).toBeNull()

    // 選取日本
    await userEvent.click(japanOption)
    await expect(listbox).not.toBeVisible()
  },
}
