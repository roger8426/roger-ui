---
description: 'Use when creating new components, planning directory layout, naming files, or organizing the project structure of this UI library.'
---

# 專案結構規範

## 目錄結構

```
src/
├── assets/
│   └── styles/
│       └── main.css          # Tailwind 入口，@theme token 定義
├── components/
│   └── {component-name}/     # kebab-case 目錄名
│       ├── {ComponentName}.vue
│       ├── {ComponentName}.stories.ts
│       └── types.ts          # 複雜型別定義
├── composables/              # 專案內部共用 composable
│   └── use{Name}.ts
└── index.ts                  # 唯一公開入口
```

## 元件目錄命名

- 目錄名使用 **kebab-case**：`button/`、`date-picker/`、`dropdown-menu/`
- 元件檔名使用 **PascalCase**：`Button.vue`、`DatePicker.vue`
- Story 檔名與元件相同：`Button.stories.ts`
- 禁止在元件目錄內建立 `index.ts`

## 元件分層

根據元件的抽象程度分為三層，反映在 Storybook 的 title 分類：

| 層級                                             | 說明                     | 範例                         |
| ------------------------------------------------ | ------------------------ | ---------------------------- |
| `UI`                                             | 無業務邏輯的原子元件     | Button、Input、Badge、Icon   |
| `Form`                                           | 具備完整 form 行為的元件 | Checkbox、Select、DatePicker |
| `Layout` / `Feedback` / `Navigation` / `Overlay` | 功能性複合元件           | Card、Toast、Tabs、Modal     |

- 原子元件不應依賴其他元件（可依賴 composables）
- 複合元件可依賴原子元件，但禁止跨層反向依賴

## 檔案命名規則

| 類型       | 命名格式                        | 範例                |
| ---------- | ------------------------------- | ------------------- |
| Vue 元件   | `PascalCase.vue`                | `Button.vue`        |
| Story      | `PascalCase.stories.ts`         | `Button.stories.ts` |
| Composable | `use{Name}.ts`                  | `useFloating.ts`    |
| 型別定義   | `types.ts` 或 `{name}.types.ts` | `types.ts`          |
| 樣式       | `{name}.css`                    | `main.css`          |

## Composables

- `src/composables/` 存放**跨元件共用**的 composable
- 若邏輯只在單一元件內使用，直接內聯於該元件的 `<script setup>` 即可，不必抽離
- composable 檔名和函式名一致：`useFocusTrap.ts` 導出 `useFocusTrap`

## 禁止的結構

- 禁止在 `src/` 根目錄直接放 `.vue` 元件檔案
- 禁止建立 `src/utils/` 通用工具目錄（工具應作為 composable 或內聯）
- 禁止建立深度超過 3 層的元件巢狀目錄
- 禁止在一個目錄內混放不同元件的檔案
