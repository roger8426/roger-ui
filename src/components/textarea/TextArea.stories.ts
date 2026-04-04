import { expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import TextArea from './TextArea.vue'

const meta = {
  title: 'Form/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    id: {
      description: 'textarea 元素 id，用於關聯外部 <label>',
      control: 'text',
      table: { category: 'Other' },
    },
    modelValue: {
      description: 'v-model 綁定值',
      control: 'text',
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
    rows: {
      description: '初始可見行數',
      control: 'number',
      table: { category: 'Appearance', defaultValue: { summary: '3' } },
    },
    maxHeight: {
      description: 'auto-resize 高度上限（CSS 值，如 "200px"）；未設定則無限撐高',
      control: 'text',
      table: { category: 'Appearance' },
    },
    resize: {
      description: 'CSS resize handle',
      control: 'select',
      options: ['none', 'vertical', 'both'],
      table: { category: 'Appearance', defaultValue: { summary: 'none' } },
    },
    disabled: {
      description: '是否停用',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    readonly: {
      description: '是否唯讀',
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
    maxlength: {
      description: '最大字元數',
      control: 'number',
      table: { category: 'State' },
    },
    showCount: {
      description: '是否顯示字元計數（預設 false；建議搭配 maxlength 使用）',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
  },
  args: {
    modelValue: '',
    size: 'md',
    placeholder: '請輸入...',
    rows: 3,
    resize: 'none',
    disabled: false,
    readonly: false,
    error: false,
    border: true,
    showCount: false,
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { TextArea },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<TextArea v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" style="width: 320px;" />',
    }
  },
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { TextArea },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
        <TextArea size="sm" placeholder="Small" style="width: 320px;" />
        <TextArea size="md" placeholder="Medium" style="width: 320px;" />
        <TextArea size="lg" placeholder="Large" style="width: 320px;" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: { disabled: true, modelValue: '停用狀態的文字內容' },
}

export const Readonly: Story = {
  args: { readonly: true, modelValue: '這是唯讀的文字內容，無法編輯。' },
}

export const ErrorWithMessage: Story = {
  args: { error: true, errorMsg: '此欄位內容不符合規定', placeholder: '請輸入說明' },
}

export const WithMaxHeight: Story = {
  args: {
    maxHeight: '120px',
    placeholder: '輸入多行內容後，超過 120px 會出現捲軸...',
  },
}

export const WithCharCount: Story = {
  args: {
    showCount: true,
    maxlength: 100,
    placeholder: '最多可輸入 100 個字元',
  },
}

export const WithCharCountNoLimit: Story = {
  args: {
    showCount: true,
    placeholder: '顯示已輸入字數（無上限）',
  },
}

export const NoBorder: Story = {
  args: { border: false, placeholder: '無邊框樣式' },
}

export const Interaction: Story = {
  render: () => ({
    components: { TextArea },
    setup() {
      const value = ref('')
      return { value }
    },
    template:
      '<TextArea v-model="value" placeholder="請輸入文字" show-count :maxlength="50" style="width: 320px;" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox')

    await expect(textarea).toBeVisible()
    await expect(textarea).not.toBeDisabled()

    // 輸入前的初始高度
    const initialHeight = Number.parseFloat((textarea as HTMLTextAreaElement).style.height || '0')

    // Tab 鍵盤導航能聚焦
    await userEvent.tab()
    await expect(textarea).toHaveFocus()

    // 輸入多行文字，驗證 auto-resize 撐高
    await userEvent.type(
      textarea,
      '第一行\n第二行\n第三行\n第四行\n第五行\n第六行\n第七行\n第八行',
    )
    await expect(textarea).toHaveValue(
      '第一行\n第二行\n第三行\n第四行\n第五行\n第六行\n第七行\n第八行',
    )

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    const expandedHeight = Number.parseFloat((textarea as HTMLTextAreaElement).style.height || '0')
    await expect(expandedHeight).toBeGreaterThan(initialHeight)

    // 清除後仍可正常編輯
    await userEvent.clear(textarea)
    await expect(textarea).toHaveValue('')

    // 離焦
    await userEvent.tab()
    await expect(textarea).not.toHaveFocus()
  },
}

export const InteractionKeyboard: Story = {
  render: () => ({
    components: { TextArea },
    setup() {
      const value = ref('')
      return { value }
    },
    template: '<TextArea v-model="value" placeholder="鍵盤導航測試" style="width: 320px;" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox')

    // Tab 可聚焦
    await userEvent.tab()
    await expect(textarea).toHaveFocus()

    // 輸入文字
    await userEvent.keyboard('Hello Keyboard')
    await expect(textarea).toHaveValue('Hello Keyboard')

    // Tab 離焦
    await userEvent.tab()
    await expect(textarea).not.toHaveFocus()
  },
}
