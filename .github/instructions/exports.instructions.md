---
description: 'Use when creating or modifying the library entry point, index files, or package exports. Covers named exports, type exports, tree-shaking, and public API surface design.'
applyTo: 'src/index.ts'
---

# 元件導出規範

## 基本原則

- **所有元件只使用 named export**，禁止 default export 元件
- 使用者應能透過 `import { Button } from 'roger-ui'` 直接使用
- `src/index.ts` 是唯一的公開入口，內部路徑不應被使用者直接引用

## 元件導出

```ts
// src/index.ts

// 元件
export { default as Button } from './components/button/Button.vue'
export { default as Input } from './components/input/Input.vue'

// 型別（必須用 export type）
export type { ButtonProps } from './components/button/Button.vue'
export type { InputProps } from './components/input/Input.vue'
```

## Props 型別導出

- 每個元件的 Props interface 必須從元件檔案 `export`，並在 `index.ts` 用 `export type` 重新導出
- 型別命名規則：`{ComponentName}Props`

```ts
// Button.vue
export interface ButtonProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  loading?: boolean
}
```

## 禁止事項

- 禁止在 `src/components/` 下建立 `index.ts` barrel file（破壞 tree-shaking）
- 禁止從 `src/index.ts` 以外路徑導出任何內容給使用者
- 禁止導出元件的內部 composables（除非明確設計為公開 API）
- 禁止在 `src/index.ts` 使用 `export * from`（隱式導出，難以追蹤公開 API 範圍）

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
