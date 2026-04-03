import { expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Accordion from './Accordion.vue'
import AccordionItem from './AccordionItem.vue'

const meta = {
  title: 'Layout/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: '受控模式：目前展開的 item value',
      control: 'text',
      table: { category: 'State' },
    },
    defaultValue: {
      description: '非受控模式：初始展開的 item value',
      control: 'text',
      table: { category: 'State' },
    },
    multiple: {
      description: '是否允許同時展開多個 item',
      control: 'boolean',
      table: { category: 'State' },
    },
    disabled: {
      description: '是否停用整個 accordion',
      control: 'boolean',
      table: { category: 'State' },
    },
    collapsible: {
      description: '已展開的 item 是否可再次點擊收合（multiple: false 時有效）',
      control: 'boolean',
      table: { category: 'State' },
    },
  },
  args: {
    multiple: false,
    disabled: false,
    collapsible: true,
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Accordion, AccordionItem },
      setup() {
        function onUpdate(value: string | string[]) {
          updateArgs({ modelValue: value })
        }
        return { args, onUpdate }
      },
      template: `
        <Accordion v-bind="args" @update:modelValue="onUpdate" style="width: 360px; border: 1px solid var(--rui-color-accordion-border); border-radius: 8px; overflow: hidden;">
          <AccordionItem value="a" title="第一個項目">
            這是第一個項目的內容，可以是任意文字或富文本內容。
          </AccordionItem>
          <AccordionItem value="b" title="第二個項目">
            這是第二個項目的內容，展開後顯示在面板區域內。
          </AccordionItem>
          <AccordionItem value="c" title="第三個項目">
            這是第三個項目的內容，每個項目相互獨立。
          </AccordionItem>
        </Accordion>
      `,
    }
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: 'a',
  },
}

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ['a', 'b'],
  },
  render: () => {
    const [args] = useArgs()
    return {
      components: { Accordion, AccordionItem },
      setup() {
        return { args }
      },
      template: `
        <Accordion v-bind="args" style="width: 360px; border: 1px solid var(--rui-color-accordion-border); border-radius: 8px; overflow: hidden;">
          <AccordionItem value="a" title="第一個項目">
            這是第一個項目的內容，可以是任意文字或富文本內容。
          </AccordionItem>
          <AccordionItem value="b" title="第二個項目">
            這是第二個項目的內容，展開後顯示在面板區域內。
          </AccordionItem>
          <AccordionItem value="c" title="第三個項目">
            這是第三個項目的內容，每個項目相互獨立。
          </AccordionItem>
        </Accordion>
      `,
    }
  },
}

export const DisabledItem: Story = {
  render: () => {
    const [args] = useArgs()
    return {
      components: { Accordion, AccordionItem },
      setup() {
        return { args }
      },
      template: `
        <Accordion v-bind="args" style="width: 360px; border: 1px solid var(--rui-color-accordion-border); border-radius: 8px; overflow: hidden;">
          <AccordionItem value="a" title="正常 Item">
            這個 item 可以正常展開收合。
          </AccordionItem>
          <AccordionItem value="b" title="已停用的 Item" :disabled="true">
            這段內容無法透過點擊展開。
          </AccordionItem>
          <AccordionItem value="c" title="另一個正常 Item">
            這個 item 也可以正常展開收合。
          </AccordionItem>
        </Accordion>
      `,
    }
  },
}

export const DisabledAll: Story = {
  args: {
    disabled: true,
  },
}

export const CustomTitle: Story = {
  render: () => {
    const [args] = useArgs()
    return {
      components: { Accordion, AccordionItem },
      setup() {
        return { args }
      },
      template: `
        <Accordion v-bind="args" style="width: 360px; border: 1px solid var(--rui-color-accordion-border); border-radius: 8px; overflow: hidden;">
          <AccordionItem value="a">
            <template #title>
              <span style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">⚡</span>
                <span>自訂 Title Slot</span>
                <span style="margin-left: auto; font-size: 12px; color: var(--rui-color-default); background: oklch(93% 0.015 264); padding: 2px 6px; border-radius: 4px;">NEW</span>
              </span>
            </template>
            透過 <code>#title</code> slot 可以完全自訂 header 的內容。
          </AccordionItem>
          <AccordionItem value="b" title="一般標題">
            這個 item 使用普通的 title prop。
          </AccordionItem>
        </Accordion>
      `,
    }
  },
}

export const Interaction: Story = {
  args: {
    defaultValue: '',
  },
  render: () => {
    const [args] = useArgs()
    return {
      components: { Accordion, AccordionItem },
      setup() {
        return { args }
      },
      template: `
        <Accordion v-bind="args" style="width: 360px; border: 1px solid var(--rui-color-accordion-border); border-radius: 8px; overflow: hidden;">
          <AccordionItem value="item-1" title="點擊展開第一項">
            第一項的內容已展開。
          </AccordionItem>
          <AccordionItem value="item-2" title="點擊展開第二項">
            第二項的內容已展開。
          </AccordionItem>
        </Accordion>
      `,
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 初始狀態：所有 header 均為 collapsed
    const buttons = canvas.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')

    // 點擊第一個 header，應展開
    await userEvent.click(buttons[0]!)
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')

    // 點擊第二個 header，第一個收合、第二個展開（單選模式）
    await userEvent.click(buttons[1]!)
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true')

    // 再次點擊第二個 header，應收合（collapsible: true）
    await userEvent.click(buttons[1]!)
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')
  },
}
