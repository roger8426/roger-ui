---
description: 'Hard constraints and non-negotiable rules for this UI library project. Apply these rules to all code in this project at all times.'
applyTo: '**'
---

# 專案硬性約束

這些規則不可例外，不論任何理由。

## 框架與版本

- Vue 版本：`^3.5`，使用 Composition API + `<script setup>`
- TypeScript：strict 模式，禁止關閉 `noUncheckedIndexedAccess`
- Storybook：本專案**唯一的開發預覽入口**，禁止啟動 Vite dev server（`pnpm dev` 已移除）

## 程式碼禁止事項

- 禁止 `any` 型別（包含隱式）
- 禁止 Options API 和 `defineComponent`
- 禁止在**公開導出層**使用 default export 元件；Vue SFC 檔案可維持框架預設輸出，但 `src/index.ts` 對外只能提供 named export
- 禁止 barrel `index.ts`（除 `src/index.ts` 唯一入口）
- 禁止 `export * from`
- 禁止 `@apply` 在 `<style scoped>`
- 禁止直接使用 Tailwind 預設顏色 class（如 `text-blue-500`）
- 禁止動態拼接 Tailwind class 字串（如 `` `bg-${color}-500` ``）
- 禁止在元件 template 內直接撰寫 inline `<svg>`；所有圖示一律以 `.svg` 檔存放於 `src/assets/icons/`，並透過 `Icon` 元件引用

## 元件開發約束

- 每個公開元件必須有對應的 `.stories.ts` 檔案才算完成；僅作為父元件內部封裝的附屬子元件可由父元件 story 一併覆蓋
- 有互動行為的元件必須有帶 `play()` 的 story
- 所有非必填 prop 必須有明確預設值，不能只靠 TypeScript optional (`?`) 取代 runtime 預設值
- 公開 API（props/emits/expose）的異動視為 breaking change

## 測試約束

- 不使用 jsdom 進行元件測試，一律透過 Storybook + Playwright 的 `play()` function
- 測試斷言使用 `@storybook/test` 的 `expect`、`userEvent`、`within`

## 專案工具鏈

- 套件管理：`pnpm`，禁止使用 `npm` 或 `yarn`
- Linting：oxlint（快速規則）+ ESLint（框架規則），兩者皆不可單獨停用
- 格式化：Prettier，禁止手動調整格式規則達到 bypass 目的

> TypeScript 詳細規範（型別宣告方式、禁止構造、Vue 整合慣例）詳見 `.github/instructions/typescript.instructions.md`。
