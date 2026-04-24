import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Toast from './Toast.vue'
import Button from '../button/Button.vue'

const meta = {
  title: 'Overlay/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: '受控模式：控制 Toast 顯示/隱藏（v-model）',
      control: 'boolean',
      table: { category: 'State' },
    },
    defaultOpen: {
      description: '非受控模式：初始是否顯示',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    x: {
      description: '水平位置',
      control: 'select',
      options: ['left', 'center', 'right'],
      table: { category: 'Position', defaultValue: { summary: 'center' } },
    },
    y: {
      description: '垂直位置',
      control: 'select',
      options: ['top', 'center', 'bottom'],
      table: { category: 'Position', defaultValue: { summary: 'center' } },
    },
    duration: {
      description: '自動關閉時間（毫秒）；傳 0 代表不自動關閉',
      control: { type: 'number', min: 0, step: 500 },
      table: { category: 'Behavior', defaultValue: { summary: '3000' } },
    },
    closable: {
      description: '是否顯示右上角關閉按鈕',
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'true' } },
    },
    bgColor: {
      description: '背景顏色（任意 CSS 色彩值，預設使用 --rui-color-toast-bg token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    textColor: {
      description: '文字顏色（任意 CSS 色彩值，預設使用 --rui-color-toast-text token）',
      control: 'color',
      table: { category: 'Appearance' },
    },
    offset: {
      description: '距離視窗邊緣的間距（px）',
      control: { type: 'number', min: 0 },
      table: { category: 'Position', defaultValue: { summary: '16' } },
    },
    gap: {
      description: '同位置堆疊時 Toast 之間的間距（px）',
      control: { type: 'number', min: 0 },
      table: { category: 'Position', defaultValue: { summary: '8' } },
    },
  },
  args: {
    x: 'center',
    y: 'center',
    duration: 3000,
    closable: true,
    offset: 16,
    gap: 8,
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

// ── Default（受控模式）────────────────────────────────────────────
export const Default: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Toast, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button @click="updateArgs({ modelValue: true })">顯示 Toast</Button>
          <Toast
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            這是一段通知訊息
          </Toast>
        </div>
      `,
    }
  },
  args: { modelValue: false },
}

// ── 九宮格位置 ────────────────────────────────────────────────────
export const Positions: Story = {
  render: () => ({
    components: { Toast, Button },
    setup() {
      const positions: Array<[string, 'left' | 'center' | 'right', 'top' | 'center' | 'bottom']> = [
        ['top-left', 'left', 'top'],
        ['top-center', 'center', 'top'],
        ['top-right', 'right', 'top'],
        ['middle-left', 'left', 'center'],
        ['middle-center', 'center', 'center'],
        ['middle-right', 'right', 'center'],
        ['bottom-left', 'left', 'bottom'],
        ['bottom-center', 'center', 'bottom'],
        ['bottom-right', 'right', 'bottom'],
      ]
      const states = ref<Record<string, boolean>>({})
      function show(label: string) {
        states.value[label] = true
      }
      function update(label: string, val: boolean) {
        states.value[label] = val
      }
      return { positions, states, show, update }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 480px;">
        <Button
          v-for="[label, x, y] in positions"
          :key="label"
          @click="show(label)"
        >{{ label }}</Button>
        <Toast
          v-for="[label, x, y] in positions"
          :key="label + '-toast'"
          :model-value="!!states[label]"
          :x="x"
          :y="y"
          @update:model-value="update(label, $event)"
        >
          {{ label }}
        </Toast>
      </div>
    `,
  }),
}

// ── 自訂顏色 ──────────────────────────────────────────────────────
export const BgColor: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Toast, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button @click="updateArgs({ modelValue: true })">顯示自訂色 Toast</Button>
          <Toast
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            使用自訂背景與文字色
          </Toast>
        </div>
      `,
    }
  },
  args: {
    modelValue: false,
    x: 'center',
    y: 'top',
    bgColor: 'oklch(55% 0.2 264)',
    textColor: 'oklch(98% 0.01 264)',
  },
}

// ── 不自動關閉（duration: 0）──────────────────────────────────────
export const NoAutoDismiss: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Toast, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button @click="updateArgs({ modelValue: true })">顯示 Toast (需手動關閉)</Button>
          <Toast
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            我不會自動消失，請點右上角 X
          </Toast>
        </div>
      `,
    }
  },
  args: { modelValue: false, duration: 0, y: 'top' },
}

// ── 不可關閉（closable: false）────────────────────────────────────
export const NotClosable: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Toast, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button @click="updateArgs({ modelValue: true })">顯示不可手動關閉的 Toast</Button>
          <Toast
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            5 秒後自動消失，沒有 X
          </Toast>
        </div>
      `,
    }
  },
  args: { modelValue: false, closable: false, duration: 5000, y: 'top' },
}

// ── 同位置堆疊 ────────────────────────────────────────────────────
export const Stacked: Story = {
  render: () => ({
    components: { Toast, Button },
    setup() {
      const items = ref<Array<{ id: number; text: string }>>([])
      let seq = 0
      function addOne() {
        seq += 1
        items.value.push({ id: seq, text: `第 ${seq} 則通知` })
      }
      function remove(id: number) {
        items.value = items.value.filter((it) => it.id !== id)
      }
      return { items, addOne, remove }
    },
    template: `
      <div>
        <Button @click="addOne">新增 Toast (top-right)</Button>
        <Toast
          v-for="item in items"
          :key="item.id"
          :model-value="true"
          x="right"
          y="top"
          :duration="4000"
          @update:model-value="remove(item.id)"
        >
          {{ item.text }}
        </Toast>
      </div>
    `,
  }),
}

// ── Hover 暫停倒數 ────────────────────────────────────────────────
export const HoverPause: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Toast, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button @click="updateArgs({ modelValue: true })">
            顯示 2 秒 Toast（hover 暫停倒數）
          </Button>
          <Toast
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            滑鼠移上來倒數會停止，移開恢復
          </Toast>
        </div>
      `,
    }
  },
  args: { modelValue: false, duration: 2000, y: 'top' },
}

// ── 自訂 Slot 內容 ────────────────────────────────────────────────
export const SlotContent: Story = {
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Toast, Button },
      setup() {
        return { args, updateArgs }
      },
      template: `
        <div>
          <Button @click="updateArgs({ modelValue: true })">顯示富文本 Toast</Button>
          <Toast
            v-bind="args"
            @update:modelValue="updateArgs({ modelValue: $event })"
          >
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <strong>操作成功</strong>
              <span>檔案已上傳至雲端。</span>
              <a href="#" style="color: inherit; text-decoration: underline;">檢視詳情</a>
            </div>
          </Toast>
        </div>
      `,
    }
  },
  args: { modelValue: false, duration: 0, y: 'bottom', x: 'right' },
}
