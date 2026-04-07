import { expect, userEvent, within } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Pagination from './Pagination.vue'

const meta = {
  title: 'Layout/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    total: {
      description: '資料總筆數',
      control: 'number',
    },
    pageSize: {
      description: '每頁筆數，預設 10',
      control: 'number',
    },
    currentPage: {
      description: '目前所在頁碼（從 1 開始），支援 v-model',
      control: 'number',
    },
    border: {
      description: '是否為頁碼按鈕顯示外框',
      control: 'boolean',
    },
    visiblePages: {
      description: '頁碼視窗顯示的頁碼數量，預設 5',
      control: 'number',
    },
    color: {
      description: '頁碼顏色，同時套用於 active 文字與外框（任意 CSS 色彩值）',
      control: 'color',
    },
  },
  args: {
    total: 50,
    pageSize: 10,
    currentPage: 1,
    border: false,
  },
  render: () => {
    const [args, updateArgs] = useArgs()
    return {
      components: { Pagination },
      setup() {
        function onUpdate(page: number) {
          updateArgs({ currentPage: page })
        }
        return { args, onUpdate }
      },
      template: '<Pagination v-bind="args" @update:currentPage="onUpdate" />',
    }
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithBorder: Story = {
  args: {
    border: true,
  },
}

export const CustomColor: Story = {
  args: {
    color: '#d0391e',
    border: true,
  },
}

export const ManyPages: Story = {
  args: {
    total: 200,
    pageSize: 10,
    currentPage: 20,
  },
}

export const NarrowWindow: Story = {
  args: {
    total: 200,
    pageSize: 10,
    currentPage: 10,
    visiblePages: 3,
  },
}

export const Interaction: Story = {
  render: () => {
    return {
      components: { Pagination },
      setup() {
        const currentPage = ref(1)
        return { currentPage }
      },
      template:
        '<Pagination :total="50" :pageSize="10" :currentPage="currentPage" @update:currentPage="currentPage = $event" />',
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const firstBtn = canvas.getByRole('button', { name: '第一頁' })
    const prevBtn = canvas.getByRole('button', { name: '上一頁' })
    const nextBtn = canvas.getByRole('button', { name: '下一頁' })
    const lastBtn = canvas.getByRole('button', { name: '最末頁' })

    // 初始狀態：First 與 Prev 應 disabled
    await expect(firstBtn).toBeDisabled()
    await expect(prevBtn).toBeDisabled()
    await expect(nextBtn).not.toBeDisabled()
    await expect(lastBtn).not.toBeDisabled()

    // 點擊 Next → 移至第 2 頁
    await userEvent.click(nextBtn)
    await expect(canvas.getByRole('button', { name: '第 2 頁' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    // Prev 應可點擊
    await expect(prevBtn).not.toBeDisabled()

    // 點擊 Prev → 回到第 1 頁
    await userEvent.click(prevBtn)
    await expect(canvas.getByRole('button', { name: '第 1 頁' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(firstBtn).toBeDisabled()
    await expect(prevBtn).toBeDisabled()

    // 點擊 Last → 移至最末頁
    await userEvent.click(lastBtn)
    await expect(canvas.getByRole('button', { name: '第 5 頁' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(nextBtn).toBeDisabled()
    await expect(lastBtn).toBeDisabled()

    // 鍵盤導航：先回到第 1 頁，確保 next/last 可用
    await userEvent.click(firstBtn)
    await expect(canvas.getByRole('button', { name: '第 1 頁' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    // Tab 依序跳過 disabled 的 first/prev，聚焦至第 1 頁按鈕
    await userEvent.click(canvasElement)
    // Tab 順序：第 1~5 頁（5次）→ 下一頁（第 6 次）
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    const focusedNext = canvas.getByRole('button', { name: '下一頁' })
    await expect(focusedNext).not.toBeDisabled()
    await expect(focusedNext).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByRole('button', { name: '第 2 頁' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  },
}
