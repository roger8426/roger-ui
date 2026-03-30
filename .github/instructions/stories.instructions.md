---
description: 'Use when creating or editing Storybook stories. Covers story structure, meta configuration, args, play functions, interaction testing, a11y validation, and story naming conventions for a UI component library.'
applyTo: '**/*.stories.{ts,tsx}'
---

# Storybook Story 規範

## 檔案結構

- 每個元件對應一個 `ComponentName.stories.ts` 檔案，與元件並置
- 必須有 `default export`（meta）和至少一個 `export const`（story）
- 使用 `satisfies Meta<typeof Component>` 而非直接型別標註

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from './Button.vue'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    onClick: { action: 'clicked' },
  },
  args: {
    size: 'md',
    variant: 'primary',
    disabled: false,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>
```

## Title 命名規範

- 格式：`{Category}/{ComponentName}`
- Category 使用以下固定分類：
  - `UI` — 基礎 UI 元件（Button、Input、Badge）
  - `Form` — 表單相關元件（Checkbox、Select、DatePicker）
  - `Layout` — 佈局元件（Card、Divider、Grid）
  - `Feedback` — 回饋元件（Toast、Alert、Skeleton）
  - `Navigation` — 導航元件（Tabs、Breadcrumb、Menu）
  - `Overlay` — 浮層元件（Modal、Drawer、Tooltip）

## Story 命名與覆蓋率

- `Default`：最常見的使用狀態，args 使用 meta 預設值
- 每個重要 variant 獨立一個 story（`Primary`、`Secondary`）
- 每個重要狀態獨立一個 story（`Disabled`、`Loading`、`Error`）
- 複雜互動場景獨立一個 story 並加上 `play()` function

```ts
export const Default: Story = {}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Loading: Story = {
  args: { loading: true },
}
```

## play() Function

- **所有有互動行為的元件必須有至少一個帶 `play()` 的 story**
- 使用 `storybook/test` 的 `userEvent` 和 `expect`，不使用 Testing Library 直接引入
- 測試斷言需涵蓋：DOM 狀態、a11y 角色、事件觸發

```ts
import { expect, userEvent, within } from 'storybook/test'

export const Interaction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const button = canvas.getByRole('button', { name: /submit/i })
    await userEvent.click(button)

    await expect(button).toBeDisabled()
  },
}
```

## A11y 驗收

- 每個元件至少一個 story 通過 `addon-a11y` 的自動檢測（無 violations）
- 有鍵盤操作需求的元件，必須在 `play()` 內測試鍵盤導航：
  - 可聚焦元件：`userEvent.tab()` 能聚焦
  - 下拉/展開：`userEvent.keyboard('{Enter}')` 和 `'{Escape}'` 能操作
- a11y 規則等級在 `.storybook/preview.ts` 統一設定，不在 story 層級單獨覆蓋

## ArgTypes 文件

- 每個 prop 需透過 `argTypes` 提供 `description` 和對應的 control 類型
- 使用 `table.category` 分組：`'Appearance'`、`'State'`、`'Events'`
- 複雜型別的 prop 提供 `table.type.summary`

```ts
argTypes: {
  size: {
    description: '元件尺寸',
    control: 'select',
    options: ['sm', 'md', 'lg'],
    table: {
      category: 'Appearance',
      defaultValue: { summary: 'md' },
    },
  },
}
```
