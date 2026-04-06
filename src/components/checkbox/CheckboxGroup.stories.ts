import { expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import CheckboxGroup from './CheckboxGroup.vue'
import Checkbox from './Checkbox.vue'

const OPTIONS = ['apple', 'banana', 'cherry'] as const
const LABELS: Record<string, string> = { apple: '蘋果', banana: '香蕉', cherry: '櫻桃' }

const meta = {
  title: 'Form/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: '已勾選的值陣列',
      control: false,
      table: { category: 'State' },
    },
    disabled: {
      description: '停用整個群組（所有子 Checkbox 均不可互動）',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    name: {
      description: '套用至所有子 Checkbox 的 name 屬性',
      control: 'text',
      table: { category: 'Accessibility' },
    },
  },
  args: {
    modelValue: [],
    disabled: false,
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { CheckboxGroup, Checkbox },
      setup() {
        return { args, updateArgs, OPTIONS, LABELS }
      },
      template: `
        <CheckboxGroup
          v-bind="args"
          @update:model-value="updateArgs({ modelValue: $event })"
          v-slot="{ allChecked, indeterminate, toggleAll }"
        >
          <div class="flex flex-col gap-2">
            <Checkbox
              :model-value="allChecked"
              :indeterminate="indeterminate"
              label="全選"
              @update:model-value="toggleAll"
            />
            <hr class="border-(--rui-color-border)" />
            <Checkbox
              v-for="opt in OPTIONS"
              :key="opt"
              :value="opt"
              :label="LABELS[opt]"
            />
          </div>
        </CheckboxGroup>
      `,
    }
  },
} satisfies Meta<typeof CheckboxGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSomeSelected: Story = {
  args: { modelValue: ['apple'] },
}

export const AllSelected: Story = {
  args: { modelValue: [...OPTIONS] },
}

export const Disabled: Story = {
  args: { modelValue: ['apple'], disabled: true },
}

export const Interaction: Story = {
  render: () => ({
    components: { CheckboxGroup, Checkbox },
    setup() {
      const selected = ref<string[]>([])
      return { selected, OPTIONS, LABELS }
    },
    template: `
      <CheckboxGroup v-model="selected" v-slot="{ allChecked, indeterminate, toggleAll }">
        <div class="flex flex-col gap-2">
          <Checkbox
            :model-value="allChecked"
            :indeterminate="indeterminate"
            label="全選"
            @update:model-value="toggleAll"
          />
          <hr class="border-(--rui-color-border)" />
          <Checkbox value="apple" label="蘋果" />
          <Checkbox value="banana" label="香蕉" />
          <Checkbox value="cherry" label="櫻桃" />
        </div>
      </CheckboxGroup>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const master = canvas.getByRole('checkbox', { name: '全選' })
    const apple = canvas.getByRole('checkbox', { name: '蘋果' })
    const banana = canvas.getByRole('checkbox', { name: '香蕉' })
    const cherry = canvas.getByRole('checkbox', { name: '櫻桃' })

    // Initial state: all unchecked
    await expect(master).not.toBeChecked()
    await expect(apple).not.toBeChecked()

    // Check one child → master should not be checked (indeterminate, but not checked attr)
    await userEvent.click(apple)
    await expect(apple).toBeChecked()
    await expect(master).not.toBeChecked()

    // Check a second child → still not all
    await userEvent.click(banana)
    await expect(banana).toBeChecked()
    await expect(master).not.toBeChecked()

    // Check last child → master becomes checked
    await userEvent.click(cherry)
    await expect(cherry).toBeChecked()
    await expect(master).toBeChecked()

    // Click master to clear all
    await userEvent.click(master)
    await expect(apple).not.toBeChecked()
    await expect(banana).not.toBeChecked()
    await expect(cherry).not.toBeChecked()
    await expect(master).not.toBeChecked()

    // Click master to select all
    await userEvent.click(master)
    await expect(apple).toBeChecked()
    await expect(banana).toBeChecked()
    await expect(cherry).toBeChecked()
    await expect(master).toBeChecked()
  },
}
