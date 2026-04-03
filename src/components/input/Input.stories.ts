import { expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Input from './Input.vue'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: 'v-model 綁定值',
      control: 'text',
      table: { category: 'State' },
    },
    type: {
      description: 'input type',
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'url', 'tel'],
      table: { category: 'Appearance', defaultValue: { summary: 'text' } },
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
      description: '邊框顏色',
      control: 'color',
      table: { category: 'Appearance' },
    },
    color: {
      description: '文字顏色（任意 CSS 色彩值，預設繼承）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    prefix: {
      description: '輸入框左側內容（icon / 文字）',
      control: false,
      table: { category: 'Slots' },
    },
    suffix: {
      description: '輸入框右側內容（icon / 清除按鈕 / 文字）',
      control: false,
      table: { category: 'Slots' },
    },
  },
  args: {
    modelValue: '',
    type: 'text',
    size: 'md',
    placeholder: '請輸入...',
    disabled: false,
    readonly: false,
    error: false,
    border: true,
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Input },
      setup() {
        return { args, updateArgs }
      },
      template: '<Input v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" />',
    }
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { Input },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
        <Input size="sm" placeholder="Small" />
        <Input size="md" placeholder="Medium" />
        <Input size="lg" placeholder="Large" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: { disabled: true, modelValue: '停用狀態' },
}

export const Readonly: Story = {
  args: { readonly: true, modelValue: '唯讀內容' },
}

export const ErrorWithMessage: Story = {
  args: { error: true, errorMsg: '此欄位格式不正確', placeholder: '請輸入 Email' },
}

export const WithPrefix: Story = {
  render: () => ({
    components: { Input },
    template: `
      <Input placeholder="搜尋...">
        <template #prefix>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </template>
      </Input>
    `,
  }),
}

export const WithSuffix: Story = {
  render: () => ({
    components: { Input },
    template: `
      <Input placeholder="輸入網址">
        <template #suffix>
          <span style="font-size: 0.75rem; opacity: 0.5">.com</span>
        </template>
      </Input>
    `,
  }),
}

export const Password: Story = {
  args: { type: 'password', placeholder: '請輸入密碼' },
}

export const CustomBorderColor: Story = {
  args: { borderColor: '#d0391e' },
}

export const CustomTextColor: Story = {
  args: { color: '#d0391e' },
}

export const NoBorder: Story = {
  args: { border: false },
}

export const Interaction: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('')
      return { value }
    },
    template: '<Input v-model="value" placeholder="請輸入文字" data-testid="input" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')

    await expect(input).toBeVisible()
    await expect(input).not.toBeDisabled()

    // Tab 鍵盤導航能聚焦
    await userEvent.tab()
    await expect(input).toHaveFocus()

    // 輸入文字
    await userEvent.type(input, 'Hello Input')
    await expect(input).toHaveValue('Hello Input')

    // 清除後確認
    await userEvent.clear(input)
    await expect(input).toHaveValue('')

    // blur 離焦
    await userEvent.tab()
    await expect(input).not.toHaveFocus()
  },
}

export const FormValidation: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('')
      const hasError = ref(false)

      function validate() {
        hasError.value = value.value.trim().length === 0
      }

      return { value, hasError, validate }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 2px; align-items: flex-start;">
        <Input
          v-model="value"
          :error="hasError"
          placeholder="必填欄位"
          @blur="validate"
        />
        <span v-if="hasError" style="font-size: 0.75rem; color: var(--rui-color-error)">
          此欄位為必填
        </span>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')

    // 聚焦後不填值直接離焦，應觸發 error
    await userEvent.click(input)
    await userEvent.tab()

    const errorMsg = canvas.getByText('此欄位為必填')
    await expect(errorMsg).toBeVisible()

    // 填入值後 error 應消失
    await userEvent.click(input)
    await userEvent.type(input, '有效輸入')
    await userEvent.tab()

    await expect(canvas.queryByText('此欄位為必填')).toBeNull()
  },
}
