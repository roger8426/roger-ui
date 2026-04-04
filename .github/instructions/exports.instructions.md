---
description: 'Use when creating or modifying the library entry point, index files, or package exports. Covers named exports, type exports, tree-shaking, and public API surface design.'
applyTo: 'src/index.ts'
---

# 元件導出規範

## 基本原則

- **所有元件在公開 API 層只使用 named export**，禁止在 `src/index.ts` 直接對外做 default export
- 使用者應能透過 `import { Button } from 'roger-ui'` 直接使用
- `src/index.ts` 是唯一的公開入口，內部路徑不應被使用者直接引用
- Vue SFC 檔案可維持框架預設輸出，再由 `src/index.ts` 重新導出為 named export

## 元件導出

```ts
// src/index.ts

// 元件
export { default as Button } from './components/button/Button.vue'
export { default as Input } from './components/input/Input.vue'

// 型別（必須用 export type）
export type { ButtonProps } from './components/button/types'
export type { InputProps } from './components/input/types'
```

## Props 型別導出

- 本專案採用**型別與元件分離**的管理模式，Props interface 定義在 `types.ts`，由 `index.ts` 直接從 `types.ts` 導出
- 型別命名規則：`{ComponentName}Props`
- 在 `.vue` 內可使用 `import type { ButtonProps as Props } from './types'` 之類的別名簡化，不影響公開型別命名

```ts
// types.ts
export interface ButtonProps {
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

// index.ts（直接從 types.ts 導出）
export type { ButtonProps } from './components/button/types'
```

## 禁止事項

- 禁止在 `src/components/` 下建立 `index.ts` barrel file（破壞 tree-shaking）
- 禁止從 `src/index.ts` 以外路徑導出任何內容給使用者
- 禁止導出元件的內部 composables（除非明確設計為公開 API）
- 禁止在 `src/index.ts` 使用 `export * from`（隱式導出，難以追蹤公開 API 範圍）
- 禁止在 `src/index.ts` 使用 `export default ...` 對外暴露單一預設出口

## CSS 導出

- 元件樣式透過 Tailwind utilities 生成，使用者需在其專案引入 Tailwind 並 `@source` 指向本套件
- 若有需要導出的 CSS（如 design token），放在 `src/assets/styles/` 並在 `package.json` 的 `exports` 單獨條目

## package.json exports 設定

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/assets/styles/main.css"
  }
}
```
