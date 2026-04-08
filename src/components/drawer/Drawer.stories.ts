import { expect, userEvent, waitFor, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Drawer from './Drawer.vue'
import Button from '../button/Button.vue'
import Modal from '../modal/Modal.vue'

const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: '受控模式：控制 Drawer 開/關（v-model）',
      control: 'boolean',
      table: { category: 'State' },
    },
    defaultOpen: {
      description: '非受控模式：初始是否開啟',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    placement: {
      description: 'Drawer 滑出方向',
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      table: { category: 'Appearance', defaultValue: { summary: 'right' } },
    },
    size: {
      description: 'Drawer 尺寸（left/right 控制寬度；top/bottom 控制高度）',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
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
    showCloseButton: {
      description: '是否顯示右上角關閉按鈕',
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
    closeOnClickOutside: {
      description: '點擊 backdrop 是否關閉 Drawer',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'true' } },
    },
    closeOnEscape: {
      description: '按下 Escape 鍵是否關閉 Drawer',
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
      description: 'Panel 背景顏色（任意 CSS 色彩值，預設使用 --rui-color-drawer-bg token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    textColor: {
      description: 'Panel 文字顏色（任意 CSS 色彩值，預設使用 --rui-color-drawer-text token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    borderColor: {
      description:
        'Panel 邊框與分隔線顏色（任意 CSS 色彩值，預設使用 --rui-color-drawer-border token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    teleportTo: {
      description: 'Teleport 掛載目標（CSS selector 字串或 HTMLElement）',
      control: 'text',
      table: { category: 'Advanced', defaultValue: { summary: "'body'" } },
    },
  },
  args: {
    title: 'Drawer 標題',
    placement: 'right',
    size: 'md',
    showCloseButton: true,
    closeOnClickOutside: true,
    closeOnEscape: true,
    trapFocus: true,
    restoreFocus: true,
    lockScroll: true,
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

// ── Default（受控模式，trigger 按鈕）─────────────────────────────
export const Default: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Drawer, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button data-testid="trigger" @click="updateArgs({ modelValue: true })">開啟 Drawer</Button>
          <Drawer
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            <p>這是 Drawer 的內容區塊，可放入任意內容。</p>
          </Drawer>
        </div>
      `,
    }
  },
  args: { modelValue: false },
}

// ── Placements（四個方向）────────────────────────────────────────
export const Placements: Story = {
  render: () => ({
    components: { Drawer, Button },
    setup() {
      const left = ref(false)
      const right = ref(false)
      const top = ref(false)
      const bottom = ref(false)
      return { left, right, top, bottom }
    },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <Button @click="left = true">← 從左滑出</Button>
        <Button @click="right = true">→ 從右滑出</Button>
        <Button @click="top = true">↑ 從上滑出</Button>
        <Button @click="bottom = true">↓ 從下滑出</Button>
        <Drawer v-model="left" placement="left" title="左側 Drawer">
          <p>從左側滑入的 Drawer。</p>
        </Drawer>
        <Drawer v-model="right" placement="right" title="右側 Drawer">
          <p>從右側滑入的 Drawer。</p>
        </Drawer>
        <Drawer v-model="top" placement="top" title="上方 Drawer">
          <p>從頂部滑入的 Drawer。</p>
        </Drawer>
        <Drawer v-model="bottom" placement="bottom" title="下方 Drawer">
          <p>從底部滑入的 Drawer。</p>
        </Drawer>
      </div>
    `,
  }),
}

// ── Sizes ─────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => ({
    components: { Drawer, Button },
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
        <Drawer v-model="sm" title="小型 Drawer（sm）" size="sm">
          <p>width: 20rem（320px）</p>
        </Drawer>
        <Drawer v-model="md" title="中型 Drawer（md）" size="md">
          <p>width: 25rem（400px）</p>
        </Drawer>
        <Drawer v-model="lg" title="大型 Drawer（lg）" size="lg">
          <p>width: 35rem（560px）</p>
        </Drawer>
      </div>
    `,
  }),
}

// ── WithFooter（含 footer slot）──────────────────────────────────
export const WithFooter: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Drawer, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button @click="updateArgs({ modelValue: true })">開啟含底部操作的 Drawer</Button>
          <Drawer
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            <p>此 Drawer 底部包含操作按鈕。</p>
            <template #footer>
              <Button variant="secondary" @click="updateArgs({ modelValue: false })">取消</Button>
              <Button @click="updateArgs({ modelValue: false })">確認</Button>
            </template>
          </Drawer>
        </div>
      `,
    }
  },
  args: {
    modelValue: false,
    title: '確認操作',
  },
}

// ── NonDismissible（無法關閉）────────────────────────────────────
export const NonDismissible: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Drawer, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button @click="updateArgs({ modelValue: true })">開啟（只能由內部按鈕關閉）</Button>
          <Drawer
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            <p>此 Drawer 禁用了所有外部關閉方式：背景點擊、Escape 鍵、右上角按鈕均無效。</p>
            <template #footer>
              <Button @click="updateArgs({ modelValue: false })">我知道了</Button>
            </template>
          </Drawer>
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

// ── DrawerWithModal（Drawer 內開啟 Modal）───────────────────────
export const DrawerWithModal: Story = {
  render: () => ({
    components: { Drawer, Button, Modal },
    setup() {
      const drawerOpen = ref(false)
      const modalOpen = ref(false)
      return { drawerOpen, modalOpen }
    },
    template: `
      <div>
        <Button @click="drawerOpen = true">開啟 Drawer</Button>
        <Drawer v-model="drawerOpen" title="包含 Modal 的 Drawer">
          <p>點擊下方按鈕，可在 Drawer 上方再開啟一個 Modal。</p>
          <template #footer>
            <Button variant="secondary" @click="drawerOpen = false">關閉 Drawer</Button>
            <Button data-testid="open-modal" @click="modalOpen = true">開啟 Modal</Button>
          </template>
        </Drawer>
        <Modal v-model="modalOpen" title="疊加的 Modal">
          <p>此 Modal 疊加於 Drawer 之上。關閉 Modal 後，焦點會回到 Drawer 內的觸發按鈕。</p>
          <template #footer>
            <Button @click="modalOpen = false">關閉 Modal</Button>
          </template>
        </Modal>
      </div>
    `,
  }),
}

// ── InteractionOpenClose（play()）────────────────────────────────
export const InteractionOpenClose: Story = {
  render: () => ({
    components: { Drawer, Button },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div>
        <Button data-testid="trigger" @click="open = true">開啟 Drawer</Button>
        <Drawer v-model="open" title="互動測試 Drawer">
          <p>Drawer 內容</p>
        </Drawer>
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

    const closeBtn = body.getByRole('button', { name: '關閉' })
    await userEvent.click(closeBtn)
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

// ── InteractionEscape（play()）───────────────────────────────────
export const InteractionEscape: Story = {
  render: () => ({
    components: { Drawer, Button },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div>
        <Button data-testid="trigger" @click="open = true">開啟 Drawer</Button>
        <Drawer v-model="open" title="Escape 測試">
          <p>按 Escape 可關閉</p>
        </Drawer>
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

    // 等待 focus trap 完成後再按 Escape（對齊 Modal 測試寫法）
    const closeBtn = body.getByRole('button', { name: '關閉' })
    await waitFor(() => expect(closeBtn).toHaveFocus())

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())

    // 關閉後焦點應回到觸發按鈕
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
