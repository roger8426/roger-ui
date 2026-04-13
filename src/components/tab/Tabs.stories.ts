import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Tabs from './Tabs.vue'
import Tab from './Tab.vue'

const meta = {
  title: 'Layout/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: '受控模式：目前選中的 tab value',
      control: 'text',
      table: { category: 'State' },
    },
    defaultValue: {
      description: '非受控模式：初始選中的 tab value',
      control: 'text',
      table: { category: 'State' },
    },
    disabled: {
      description: '停用整個 Tabs',
      control: 'boolean',
      table: { category: 'State' },
    },
    label: {
      description: 'tablist 的 aria-label',
      control: 'text',
      table: { category: 'Accessibility', defaultValue: { summary: 'undefined' } },
    },
    activationMode: {
      description: '鍵盤導航模式：auto 移焦即切換，manual 需 Enter/Space 確認',
      control: 'select',
      options: ['auto', 'manual'],
      table: { category: 'Behavior', defaultValue: { summary: 'auto' } },
    },
    activeColor: {
      description: '覆蓋 active 顏色（任意 CSS 色彩字串），僅 type !== none 時生效',
      control: 'color',
      table: { category: 'Appearance', defaultValue: { summary: 'undefined' } },
    },
    type: {
      description: 'Tab 外觀模式：underline（預設）| border（border-card）| none（無樣式）',
      control: 'select',
      options: ['underline', 'border', 'none'],
      table: { category: 'Appearance', defaultValue: { summary: 'underline' } },
    },
    swipeable: {
      description: '啟用左右滑動手勢切換 tab',
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
  },
  args: {
    disabled: false,
    activationMode: 'auto',
    label: 'Demo tabs',
    type: 'underline',
    swipeable: false,
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: 'home',
  },
  render: (args) => ({
    components: { Tabs, Tab },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args" style="width: 480px;">
        <Tab value="home" label="首頁">
          <div style="padding: 16px;">這是首頁的內容。</div>
        </Tab>
        <Tab value="profile" label="個人資料">
          <div style="padding: 16px;">這是個人資料的面板內容。</div>
        </Tab>
        <Tab value="settings" label="設定">
          <div style="padding: 16px;">這是設定的面板內容。</div>
        </Tab>
      </Tabs>
    `,
  }),
}

export const Disabled: Story = {
  args: {
    defaultValue: 'home',
    disabled: true,
  },
  render: (args) => ({
    components: { Tabs, Tab },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args" style="width: 480px;">
        <Tab value="home" label="首頁">
          <div style="padding: 16px;">整個 Tabs 已停用。</div>
        </Tab>
        <Tab value="profile" label="個人資料">
          <div style="padding: 16px;">個人資料內容。</div>
        </Tab>
      </Tabs>
    `,
  }),
}

export const DisabledTab: Story = {
  args: {
    defaultValue: 'home',
  },
  render: (args) => ({
    components: { Tabs, Tab },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args" style="width: 480px;">
        <Tab value="home" label="首頁">
          <div style="padding: 16px;">首頁內容。</div>
        </Tab>
        <Tab value="profile" label="個人資料（停用）" :disabled="true">
          <div style="padding: 16px;">此 tab 已停用，無法點擊。</div>
        </Tab>
        <Tab value="settings" label="設定">
          <div style="padding: 16px;">設定面板內容。</div>
        </Tab>
      </Tabs>
    `,
  }),
}

export const CustomLabel: Story = {
  args: {
    defaultValue: 'home',
  },
  render: (args) => ({
    components: { Tabs, Tab },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args" style="width: 480px;">
        <Tab value="home">
          <template #label="{ active }">
            <span style="display: flex; align-items: center; gap: 6px;">
              <span>🏠</span>
              <span>首頁</span>
            </span>
          </template>
          <div style="padding: 16px;">使用 #label scoped slot 搭配 emoji 圖示。</div>
        </Tab>
        <Tab value="profile">
          <template #label="{ active }">
            <span style="display: flex; align-items: center; gap: 6px;">
              <span>👤</span>
              <span>個人資料</span>
              <span style="font-size: 11px; background: oklch(55% 0.22 25); color: white; padding: 1px 6px; border-radius: 9999px;">3</span>
            </span>
          </template>
          <div style="padding: 16px;">自訂 label 可搭配 Badge、Icon 等內容。</div>
        </Tab>
        <Tab value="settings">
          <template #label>
            <span style="display: flex; align-items: center; gap: 6px;">
              <span>⚙️</span>
              <span>設定</span>
            </span>
          </template>
          <div style="padding: 16px;">設定頁面內容。</div>
        </Tab>
      </Tabs>
    `,
  }),
}

export const Interaction: Story = {
  args: {
    defaultValue: 'tab-1',
    label: 'Test tabs',
  },
  render: (args) => ({
    components: { Tabs, Tab },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args" style="width: 480px;">
        <Tab value="tab-1" label="第一個">
          <div style="padding: 16px;">第一個面板</div>
        </Tab>
        <Tab value="tab-2" label="第二個">
          <div style="padding: 16px;">第二個面板</div>
        </Tab>
        <Tab value="tab-3" label="第三個">
          <div style="padding: 16px;">第三個面板</div>
        </Tab>
      </Tabs>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 初始狀態：第一個 tab 為 selected
    const tabs = canvas.getAllByRole('tab')
    expect(tabs).toHaveLength(3)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false')

    // 可見第一個 panel
    const panels = canvas.getAllByRole('tabpanel')
    expect(panels).toHaveLength(1)
    expect(panels[0]).toHaveTextContent('第一個面板')

    // 點擊第二個 tab，應切換到第二面板
    await userEvent.click(tabs[1]!)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')

    const panels2 = canvas.getAllByRole('tabpanel')
    expect(panels2).toHaveLength(1)
    expect(panels2[0]).toHaveTextContent('第二個面板')

    // 鍵盤導航：在第二個 tab 上按 ArrowRight → 第三個
    await userEvent.keyboard('{ArrowRight}')
    expect(tabs[2]).toHaveFocus()
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true')

    const panels3 = canvas.getAllByRole('tabpanel')
    expect(panels3).toHaveLength(1)
    expect(panels3[0]).toHaveTextContent('第三個面板')

    // ArrowRight 循環到第一個
    await userEvent.keyboard('{ArrowRight}')
    expect(tabs[0]).toHaveFocus()
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

    // Home 鍵回到第一個
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard('{Home}')
    expect(tabs[0]).toHaveFocus()
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

    // End 鍵到最後一個
    await userEvent.keyboard('{End}')
    expect(tabs[2]).toHaveFocus()
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true')

    // ArrowLeft 循環
    await userEvent.keyboard('{ArrowLeft}')
    expect(tabs[1]).toHaveFocus()
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
  },
}

export const ManualActivation: Story = {
  args: {
    defaultValue: 'tab-1',
    activationMode: 'manual',
    label: 'Manual activation tabs',
  },
  render: (args) => ({
    components: { Tabs, Tab },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args" style="width: 480px;">
        <Tab value="tab-1" label="第一個">
          <div style="padding: 16px;">第一個面板</div>
        </Tab>
        <Tab value="tab-2" label="第二個">
          <div style="padding: 16px;">第二個面板</div>
        </Tab>
        <Tab value="tab-3" label="第三個">
          <div style="padding: 16px;">第三個面板</div>
        </Tab>
      </Tabs>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tabs = canvas.getAllByRole('tab')

    // 點擊第一個 tab 取得 focus
    await userEvent.click(tabs[0]!)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

    // Arrow 移焦但不切換 active tab
    await userEvent.keyboard('{ArrowRight}')
    expect(tabs[1]).toHaveFocus()
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

    // Enter 確認選取
    await userEvent.keyboard('{Enter}')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')

    // 回到第一個，測試 Space 確認選取
    await userEvent.click(tabs[0]!)
    await userEvent.keyboard('{ArrowRight}')
    expect(tabs[1]).toHaveFocus()
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
    await userEvent.keyboard(' ')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
  },
}

export const Border: Story = {
  args: {
    defaultValue: 'tab-1',
    type: 'border',
    label: 'Border tabs',
  },
  render: (args) => ({
    components: { Tabs, Tab },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args" style="width: 480px;">
        <Tab value="tab-1" label="首頁">
          <div style="padding: 16px;">首頁面板內容（border-card 模式）。</div>
        </Tab>
        <Tab value="tab-2" label="個人資料">
          <div style="padding: 16px;">個人資料面板內容。</div>
        </Tab>
        <Tab value="tab-3" label="設定">
          <div style="padding: 16px;">設定面板內容。</div>
        </Tab>
      </Tabs>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const tabs = canvas.getAllByRole('tab')
    expect(tabs).toHaveLength(3)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

    // 點擊第二個 tab，應切換面板
    await userEvent.click(tabs[1]!)
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false')

    const panels = canvas.getAllByRole('tabpanel')
    expect(panels).toHaveLength(1)
    expect(panels[0]).toHaveTextContent('個人資料面板內容')

    // 點擊第三個 tab
    await userEvent.click(tabs[2]!)
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
    const panels2 = canvas.getAllByRole('tabpanel')
    expect(panels2[0]).toHaveTextContent('設定面板內容')
  },
}

export const None: Story = {
  args: {
    defaultValue: 'tab-1',
    type: 'none',
    label: 'None tabs',
  },
  render: (args) => ({
    components: { Tabs, Tab },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args" style="width: 480px;">
        <Tab value="tab-1" label="首頁">
          <div style="padding: 16px;">首頁面板內容（none 模式，無 active 樣式）。</div>
        </Tab>
        <Tab value="tab-2" label="個人資料">
          <div style="padding: 16px;">個人資料面板內容。</div>
        </Tab>
        <Tab value="tab-3" label="設定">
          <div style="padding: 16px;">設定面板內容。</div>
        </Tab>
      </Tabs>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const tabs = canvas.getAllByRole('tab')
    expect(tabs).toHaveLength(3)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

    // 面板正常切換，即使無 active 視覺樣式
    await userEvent.click(tabs[1]!)
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')

    const panels = canvas.getAllByRole('tabpanel')
    expect(panels).toHaveLength(1)
    expect(panels[0]).toHaveTextContent('個人資料面板內容')

    // 回點第一個
    await userEvent.click(tabs[0]!)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    const panels2 = canvas.getAllByRole('tabpanel')
    expect(panels2[0]).toHaveTextContent('首頁面板內容')
  },
}

export const Swipeable: Story = {
  args: {
    defaultValue: 'tab-1',
    swipeable: true,
    label: 'Swipeable tabs',
  },
  render: (args) => ({
    components: { Tabs, Tab },
    setup() {
      return { args }
    },
    template: `
      <Tabs v-bind="args" style="width: 480px;">
        <Tab value="tab-1" label="第一個">
          <div style="padding: 16px; height: 200px; background-color: lightgray;">第一個面板</div>
        </Tab>
        <Tab value="tab-2" label="第二個">
          <div style="padding: 16px; height: 200px; background-color: lightgray;">第二個面板</div>
        </Tab>
        <Tab value="tab-3" label="第三個">
          <div style="padding: 16px; height: 200px; background-color: lightgray;">第三個面板</div>
        </Tab>
      </Tabs>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tabs = canvas.getAllByRole('tab')
    expect(tabs).toHaveLength(3)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

    const panel = canvas.getByRole('tabpanel')

    const mkTouch = (target: EventTarget, clientX: number, clientY: number) =>
      new Touch({ identifier: Date.now(), target, clientX, clientY })

    // 向左滑動 → 切到第二個 tab
    fireEvent.touchStart(panel, { changedTouches: [mkTouch(panel, 300, 100)] })
    fireEvent.touchEnd(panel, { changedTouches: [mkTouch(panel, 100, 105)] })
    await waitFor(() => expect(tabs[1]).toHaveAttribute('aria-selected', 'true'))
    expect(canvas.getByRole('tabpanel')).toHaveTextContent('第二個面板')

    // 向左滑動 → 切到第三個 tab
    fireEvent.touchStart(panel, { changedTouches: [mkTouch(panel, 300, 100)] })
    fireEvent.touchEnd(panel, { changedTouches: [mkTouch(panel, 80, 108)] })
    await waitFor(() => expect(tabs[2]).toHaveAttribute('aria-selected', 'true'))
    expect(canvas.getByRole('tabpanel')).toHaveTextContent('第三個面板')

    // 邊界：已是最後一個，向左滑不循環
    fireEvent.touchStart(panel, { changedTouches: [mkTouch(panel, 300, 100)] })
    fireEvent.touchEnd(panel, { changedTouches: [mkTouch(panel, 100, 105)] })
    await waitFor(() => expect(tabs[2]).toHaveAttribute('aria-selected', 'true'))

    // 向右滑動 → 切回第二個 tab
    fireEvent.touchStart(panel, { changedTouches: [mkTouch(panel, 100, 100)] })
    fireEvent.touchEnd(panel, { changedTouches: [mkTouch(panel, 300, 105)] })
    await waitFor(() => expect(tabs[1]).toHaveAttribute('aria-selected', 'true'))
    expect(canvas.getByRole('tabpanel')).toHaveTextContent('第二個面板')

    // 向右滑動 → 切回第一個 tab
    fireEvent.touchStart(panel, { changedTouches: [mkTouch(panel, 100, 100)] })
    fireEvent.touchEnd(panel, { changedTouches: [mkTouch(panel, 300, 105)] })
    await waitFor(() => expect(tabs[0]).toHaveAttribute('aria-selected', 'true'))

    // 邊界：已是第一個，向右滑不循環
    fireEvent.touchStart(panel, { changedTouches: [mkTouch(panel, 100, 100)] })
    fireEvent.touchEnd(panel, { changedTouches: [mkTouch(panel, 300, 105)] })
    await waitFor(() => expect(tabs[0]).toHaveAttribute('aria-selected', 'true'))

    // 垂直滑動不觸發切換
    fireEvent.touchStart(panel, { changedTouches: [mkTouch(panel, 100, 100)] })
    fireEvent.touchEnd(panel, { changedTouches: [mkTouch(panel, 50, 300)] })
    await waitFor(() => expect(tabs[0]).toHaveAttribute('aria-selected', 'true'))
  },
}
