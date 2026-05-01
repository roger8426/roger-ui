import { expect, userEvent, waitFor, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import DatePicker from './DatePicker.vue'
import Modal from '../modal/Modal.vue'
import Button from '../button/Button.vue'
import type { DatePickerLocale } from './types'

const meta = {
  title: 'Form/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: 'v-model 綁定值，型別依 mode 不同（Date / DateRange / Date[]）',
      control: false,
      table: { category: 'State' },
    },
    mode: {
      description: '選擇模式',
      control: 'select',
      options: ['single', 'range', 'multiple', 'datetime'],
      table: { category: 'State', defaultValue: { summary: 'single' } },
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
      description: '是否唯讀（仍可開啟面板瀏覽）',
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
    format: {
      description: '顯示與解析格式，支援 token：YYYY MM DD HH mm ss。預設依 mode 推導',
      control: 'text',
      table: { category: 'Appearance' },
    },
    minDate: {
      description: '可選最小日期',
      control: false,
      table: { category: 'State' },
    },
    maxDate: {
      description: '可選最大日期',
      control: false,
      table: { category: 'State' },
    },
    disabledDate: {
      description: '自訂判斷日期是否禁用 (date) => boolean',
      control: false,
      table: { category: 'State' },
    },
    firstDayOfWeek: {
      description: '一週起始日，0=週日 1=週一',
      control: 'select',
      options: [0, 1],
      table: { category: 'Appearance', defaultValue: { summary: '1' } },
    },
    locale: {
      description: '本地化文字（months / weekdaysShort / todayLabel / clearLabel / confirmLabel）',
      control: false,
      table: { category: 'Appearance' },
    },
    clearable: {
      description: '是否可清除',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'true' } },
    },
    minuteStep: {
      description: 'datetime 模式分鐘步進',
      control: 'number',
      table: { category: 'Appearance', defaultValue: { summary: '1' } },
    },
    inline: {
      description: '永遠展開月曆，不渲染 trigger / popover',
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
    teleport: {
      description: 'Teleport 目標，預設 body',
      control: false,
      table: { category: 'Appearance' },
    },
    placement: {
      description: 'popover 開啟方向，auto 在底部空間不足時翻轉',
      control: 'select',
      options: ['bottom', 'top', 'auto'],
      table: { category: 'Appearance', defaultValue: { summary: 'auto' } },
    },
  },
  args: {
    modelValue: null,
    mode: 'single',
    size: 'md',
    disabled: false,
    readonly: false,
    error: false,
    border: true,
    clearable: true,
    minuteStep: 1,
    inline: false,
    firstDayOfWeek: 1,
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { DatePicker },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<DatePicker v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" />',
    }
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { DatePicker },
    setup() {
      const sm = ref<Date | null>(null)
      const md = ref<Date | null>(null)
      const lg = ref<Date | null>(null)
      return { sm, md, lg }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 260px;">
        <DatePicker v-model="sm" size="sm" placeholder="sm" />
        <DatePicker v-model="md" size="md" placeholder="md" />
        <DatePicker v-model="lg" size="lg" placeholder="lg" />
      </div>
    `,
  }),
}

export const Range: Story = {
  args: {
    mode: 'range',
    modelValue: [null, null],
  },
}

export const Multiple: Story = {
  args: {
    mode: 'multiple',
    modelValue: [],
  },
}

export const DateTime: Story = {
  args: {
    mode: 'datetime',
    minuteStep: 15,
  },
}

export const Inline: Story = {
  args: {
    inline: true,
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { DatePicker },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<DatePicker v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" />',
    }
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: new Date(2026, 4, 1),
  },
}

export const WithError: Story = {
  args: {
    errorMsg: '請選擇日期',
  },
}

export const MinMax: Story = {
  args: {
    minDate: new Date(2026, 4, 5),
    maxDate: new Date(2026, 4, 25),
  },
}

export const DisabledWeekends: Story = {
  args: {
    disabledDate: (d: Date) => d.getDay() === 0 || d.getDay() === 6,
  },
}

export const CustomFormat: Story = {
  args: {
    format: 'DD/MM/YYYY',
  },
}

export const LocaleEnUS: Story = {
  args: {
    locale: {
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      todayLabel: 'Today',
      clearLabel: 'Clear',
      confirmLabel: 'Confirm',
    } satisfies DatePickerLocale,
    firstDayOfWeek: 0,
  },
}

export const InModal: Story = {
  render: () => ({
    components: { DatePicker, Modal, Button },
    setup() {
      const open = ref(false)
      const value = ref<Date | null>(null)
      return { open, value }
    },
    template: `
      <div>
        <Button @click="open = true">開啟 Modal</Button>
        <Modal v-model="open" title="Modal 內測試">
          <p style="margin: 0 0 12px 0;">DatePicker 在 Modal 內應透過 Teleport 顯示在最上層，不被 Modal 邊界裁切。</p>
          <DatePicker v-model="value" style="width: 260px" />
        </Modal>
      </div>
    `,
  }),
}

export const InteractionSingle: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { DatePicker },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<DatePicker v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" style="width: 260px" />',
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    const trigger = canvas.getByRole('combobox')
    await expect(trigger).toBeVisible()

    // 點擊展開
    await userEvent.click(trigger)
    const dialog = await body.findByRole('dialog')
    await expect(dialog).toBeVisible()

    // 點擊 grid 中第一個非 disabled 的日期
    const cells = body.getAllByRole('gridcell')
    const firstSelectable = cells.find((c) => c.getAttribute('aria-disabled') !== 'true')
    if (firstSelectable) await userEvent.click(firstSelectable)

    // 選後 popover 關閉
    await expect(dialog).not.toBeVisible()

    // 再次開啟，按 Esc 關閉
    await userEvent.click(trigger)
    await expect(dialog).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(dialog).not.toBeVisible()
  },
}

export const InteractionRange: Story = {
  args: {
    mode: 'range',
    modelValue: [null, null],
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { DatePicker },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<DatePicker v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" style="width: 260px" />',
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    const trigger = canvas.getByRole('combobox')
    await userEvent.click(trigger)
    const dialog = await body.findByRole('dialog')
    await expect(dialog).toBeVisible()

    // 選擇兩個日期
    const cells = body
      .getAllByRole('gridcell')
      .filter((c) => c.getAttribute('aria-disabled') !== 'true')
    await userEvent.click(cells[10]!)
    await userEvent.click(cells[20]!)

    // 確認按鈕應可點擊（兩端都選齊）
    const confirmBtn = body.getByRole('button', { name: '確定' })
    await expect(confirmBtn).toBeEnabled()
    await userEvent.click(confirmBtn)

    // popover 關閉
    await expect(dialog).not.toBeVisible()
  },
}

export const InteractionKeyboard: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { DatePicker },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<DatePicker v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" style="width: 260px" />',
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    const trigger = canvas.getByRole('combobox')

    // Tab 聚焦 trigger
    await userEvent.tab()
    await expect(trigger).toHaveFocus()

    // Enter 開啟，焦點應移入 day grid（roving tabindex）
    await userEvent.keyboard('{Enter}')
    const dialog = await body.findByRole('dialog')
    await expect(dialog).toBeVisible()

    await waitFor(() => {
      expect(document.activeElement?.getAttribute('role')).toBe('gridcell')
    })

    // 方向鍵移動焦點：向右一格
    const beforeKey = (document.activeElement as HTMLElement).getAttribute('data-rui-date')
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => {
      const after = (document.activeElement as HTMLElement).getAttribute('data-rui-date')
      expect(after).not.toBe(beforeKey)
    })

    // Enter 選取當前焦點日期，popover 關閉，焦點還原至 trigger
    await userEvent.keyboard('{Enter}')
    await expect(dialog).not.toBeVisible()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const InteractionMultiple: Story = {
  render: () => ({
    components: { DatePicker },
    setup() {
      const value = ref<Date[]>([])
      return { value }
    },
    template: '<DatePicker v-model="value" mode="multiple" style="width: 260px" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    const trigger = canvas.getByRole('combobox')
    await userEvent.click(trigger)
    const dialog = await body.findByRole('dialog')
    await expect(dialog).toBeVisible()

    function selectableCells() {
      return body.getAllByRole('gridcell').filter((c) => c.getAttribute('aria-disabled') !== 'true')
    }
    function selectedCount() {
      return body.getAllByRole('gridcell').filter((c) => c.getAttribute('aria-selected') === 'true')
        .length
    }

    // 點兩個日期，面板維持開啟
    await userEvent.click(selectableCells()[5]!)
    await expect(dialog).toBeVisible()
    await waitFor(() => expect(selectedCount()).toBe(1))

    await userEvent.click(selectableCells()[10]!)
    await expect(dialog).toBeVisible()
    await waitFor(() => expect(selectedCount()).toBe(2))

    // 再點一次先前選的格子應取消（toggle）
    await userEvent.click(selectableCells()[5]!)
    await waitFor(() => expect(selectedCount()).toBe(1))

    // 關閉面板，避免 axe 對 dialog 內容做不必要的檢查
    await userEvent.keyboard('{Escape}')
    await expect(dialog).not.toBeVisible()
  },
}

export const InteractionDateTime: Story = {
  args: {
    mode: 'datetime',
    minuteStep: 15,
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { DatePicker },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<DatePicker v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" style="width: 260px" />',
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    const trigger = canvas.getByRole('combobox')
    await userEvent.click(trigger)
    const dialog = await body.findByRole('dialog')
    await expect(dialog).toBeVisible()

    // datetime 必須有「確定」按鈕；尚未選日期時 disabled
    const confirmBtn = body.getByRole('button', { name: '確定' })
    await expect(confirmBtn).toBeDisabled()

    // 選一個日期後確定按鈕應啟用
    const cells = body
      .getAllByRole('gridcell')
      .filter((c) => c.getAttribute('aria-disabled') !== 'true')
    await userEvent.click(cells[10]!)
    await waitFor(() => expect(confirmBtn).toBeEnabled())

    // datetime 模式選日期後不會關閉，需按確定
    await expect(dialog).toBeVisible()
    await userEvent.click(confirmBtn)
    await expect(dialog).not.toBeVisible()
  },
}

export const InteractionRangeReselect: Story = {
  args: {
    mode: 'range',
    modelValue: [null, null],
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { DatePicker },
      setup() {
        return { args, updateArgs }
      },
      template:
        '<DatePicker v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" style="width: 260px" />',
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.click(canvas.getByRole('combobox'))
    await body.findByRole('dialog')

    const cells = body
      .getAllByRole('gridcell')
      .filter((c) => c.getAttribute('aria-disabled') !== 'true')
    // 先選較後的日期作為 start
    await userEvent.click(cells[15]!)
    await waitFor(() => expect(cells[15]!.getAttribute('aria-selected')).toBe('true'))

    // 再點一個更早的日期 → 應視為重選 start，不是建立反向 range
    await userEvent.click(cells[5]!)
    await waitFor(() => {
      expect(cells[5]!.getAttribute('aria-selected')).toBe('true')
      expect(cells[15]!.getAttribute('aria-selected')).not.toBe('true')
    })

    // 確認按鈕仍 disabled（end 未選）
    const confirmBtn = body.getByRole('button', { name: '確定' })
    await expect(confirmBtn).toBeDisabled()

    // 結尾關閉面板，避免後置 a11y 檢查掃到 open dialog
    await userEvent.keyboard('{Escape}')
  },
}
