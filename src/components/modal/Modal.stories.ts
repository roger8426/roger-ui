import { expect, userEvent, waitFor, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Modal from './Modal.vue'
import Button from '../button/Button.vue'

const meta = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: '受控模式：控制 Modal 開/關（v-model）',
      control: 'boolean',
      table: { category: 'State' },
    },
    defaultOpen: {
      description: '非受控模式：初始是否開啟',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    title: {
      description: '標題文字；header slot 存在時此 prop 被忽略',
      control: 'text',
      table: { category: 'Appearance' },
    },
    description: {
      description: '補充說明文字（對應 aria-describedby，不顯示在視覺上）',
      control: 'text',
      table: { category: 'Appearance' },
    },
    size: {
      description: 'Panel 寬度',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    showCloseButton: {
      description: '是否顯示右上角關閉按鈕',
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
    closeOnClickOutside: {
      description: '點擊 backdrop 是否關閉 Modal',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'true' } },
    },
    closeOnEscape: {
      description: '按下 Escape 鍵是否關閉 Modal',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'true' } },
    },
    trapFocus: {
      description: '是否將 Tab 焦點限制在 Panel 內',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'true' } },
    },
    restoreFocus: {
      description: '關閉後是否將焦點還原至觸發元素',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'true' } },
    },
    lockScroll: {
      description: '開啟時是否鎖住 body scroll',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'true' } },
    },
    bgColor: {
      description: 'Panel 背景顏色（任意 CSS 色彩值，預設使用 --rui-color-modal-bg token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    textColor: {
      description: 'Panel 文字顏色（任意 CSS 色彩值，預設使用 --rui-color-modal-text token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    borderColor: {
      description:
        'Panel 邊框與分隔線顏色（任意 CSS 色彩值，預設使用 --rui-color-modal-border token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
  },
  args: {
    title: '對話框標題',
    size: 'md',
    showCloseButton: true,
    closeOnClickOutside: true,
    closeOnEscape: true,
    trapFocus: true,
    restoreFocus: true,
    lockScroll: true,
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

// ── Default（受控模式，trigger 按鈕）─────────────────────────────
export const Default: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Modal, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button @click="updateArgs({ modelValue: true })">開啟 Modal</Button>
          <Modal
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            <p>這是 Modal 的內容區塊，可放入任意內容。</p>
          </Modal>
        </div>
      `,
    }
  },
  args: { modelValue: false },
}

// ── Sizes ─────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => ({
    components: { Modal, Button },
    setup() {
      const sm = ref(false)
      const md = ref(false)
      const lg = ref(false)
      return { sm, md, lg }
    },
    template: `
      <div style="display: flex; gap: 12px;">
        <Button @click="sm = true">開啟 sm</Button>
        <Button @click="md = true">開啟 md</Button>
        <Button @click="lg = true">開啟 lg</Button>
        <Modal v-model="sm" title="小型 Modal（sm）" size="sm">
          <p>max-width: 24rem（384px）</p>
        </Modal>
        <Modal v-model="md" title="中型 Modal（md）" size="md">
          <p>max-width: 32rem（512px）</p>
        </Modal>
        <Modal v-model="lg" title="大型 Modal（lg）" size="lg">
          <p>max-width: 42rem（672px）</p>
        </Modal>
      </div>
    `,
  }),
}

// ── NonDismissible（無法關閉）────────────────────────────────────
export const NonDismissible: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Modal, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button @click="updateArgs({ modelValue: true })">開啟（只能由內部按鈕關閉）</Button>
          <Modal
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            <p>此 Modal 禁用了所有外部關閉方式：背景點擊、Escape 鍵、右上角按鈕均無效。</p>
            <p>只能透過下方按鈕關閉。</p>
            <template #footer>
              <Button @click="updateArgs({ modelValue: false })">我知道了</Button>
            </template>
          </Modal>
        </div>
      `,
    }
  },
  args: {
    modelValue: false,
    title: '必讀通知',
    closeOnClickOutside: false,
    closeOnEscape: false,
    showCloseButton: false,
  },
}

// ── LongContent（長內容捲動）─────────────────────────────────────
export const LongContent: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Modal, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button @click="updateArgs({ modelValue: true })">開啟長內容 Modal</Button>
          <Modal
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            <p v-for="i in 20" :key="i" style="margin-bottom: 0.75rem;">
              第 {{ i }} 段：這是一段較長的說明文字，用於示範 body 區域的捲動行為。
              Header 與 Footer 應保持固定，只有 body 區會出現捲軸。
            </p>
            <template #footer>
              <Button @click="updateArgs({ modelValue: false })">關閉</Button>
            </template>
          </Modal>
        </div>
      `,
    }
  },
  args: {
    modelValue: false,
    title: '長內容示範',
  },
}

// ── ConfirmDialog（確認型對話框示範）────────────────────────────
export const ConfirmDialog: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Modal, Button },
      setup() {
        const confirmed = ref<boolean | null>(null)
        function handleConfirm() {
          confirmed.value = true
          updateArgs({ modelValue: false })
        }
        function handleCancel() {
          confirmed.value = false
          updateArgs({ modelValue: false })
        }
        return { args, updateArgs, confirmed, handleConfirm, handleCancel }
      },
      template: `
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
          <Button @click="updateArgs({ modelValue: true })">刪除項目</Button>
          <p v-if="confirmed === true" style="color: var(--rui-color-error)">已確認刪除</p>
          <p v-if="confirmed === false" style="color: var(--rui-color-text-muted)">已取消</p>
          <Modal
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            <p>刪除後將無法復原，確定要繼續嗎？</p>
            <template #footer>
              <Button outline @click="handleCancel">取消</Button>
              <Button
                :bg-color="'var(--rui-color-error)'"
                @click="handleConfirm"
              >確認刪除</Button>
            </template>
          </Modal>
        </div>
      `,
    }
  },
  args: {
    modelValue: false,
    title: '確認刪除',
    size: 'sm',
  },
}

// ── InteractionOpenClose（play: open → backdrop close）──────────
export const InteractionOpenClose: Story = {
  render: () => ({
    components: { Modal, Button },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div>
        <Button data-testid="trigger" @click="open = true">開啟 Modal</Button>
        <Modal v-model="open" title="對話框標題">
          <p>開啟 Modal 後應顯示 dialog。</p>
        </Modal>
      </div>
    `,
  }),
  args: { modelValue: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    // 開啟
    const trigger = canvas.getByTestId('trigger')
    await userEvent.click(trigger)

    // dialog 被 Teleport 至 body；等待 enter transition 完成再斷言
    await waitFor(() => expect(body.getByRole('dialog')).toBeVisible())
  },
}

// ── InteractionEscape（play: open → Escape close）────────────────
export const InteractionEscape: Story = {
  render: () => ({
    components: { Modal, Button },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div>
        <Button data-testid="trigger" @click="open = true">開啟 Modal</Button>
        <Modal v-model="open">
          <p>按 Escape 應關閉此 Modal。</p>
        </Modal>
      </div>
    `,
  }),
  args: { modelValue: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    const trigger = canvas.getByTestId('trigger')
    await userEvent.click(trigger)

    await waitFor(() => expect(body.getByRole('dialog')).toBeVisible())

    const closeButton = body.getByRole('button', { name: '\u95dc\u9589' })
    await waitFor(() => expect(closeButton).toHaveFocus())

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())

    // 焦點應回到 trigger
    await expect(trigger).toHaveFocus()
  },
}

// ── InteractionKeyboardFocus（play: Tab trap + focus restore）────
export const InteractionKeyboardFocus: Story = {
  render: () => ({
    components: { Modal, Button },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div>
        <Button data-testid="trigger" @click="open = true">開啟 Modal</Button>
        <Modal v-model="open" title="\u7126\u9ede\u6e2c\u8a66">
          <p>Modal 內有兩個可聚焦元素：關閉按鈕與送出按鈕。</p>
          <template #footer>
            <Button data-testid="submit">送出</Button>
          </template>
        </Modal>
      </div>
    `,
  }),
  args: { modelValue: false, title: '焦點測試' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    const trigger = canvas.getByTestId('trigger')
    await userEvent.click(trigger)

    // dialog 及其內部元素均被 Teleport 至 body；等 onAfterEnter 執行並將焦點移入
    await waitFor(() =>
      expect(body.getByRole('button', { name: '\u95dc\u9589' })).toHaveFocus(),
    )
    const closeButton = body.getByRole('button', { name: '\u95dc\u9589' })

    // Tab → 移到 submit
    await userEvent.tab()
    const submit = body.getByTestId('submit')
    await waitFor(() => expect(submit).toHaveFocus())

    // Tab → 循環回到關閉按鈕（focus trap）
    await userEvent.tab()
    await waitFor(() => expect(closeButton).toHaveFocus())

    // 關閉後焦點回到 trigger
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
