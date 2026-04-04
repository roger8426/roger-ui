---
description: 'Use when reviewing code, conducting PR review, auditing a component, or checking code quality. Covers API compatibility, TypeScript safety, a11y, test coverage, and breaking change detection for a UI library.'
---

# Code Review 規範

## 元件 API 審查

- [ ] Props 是否有完整 TypeScript 型別（無 `any`、無隱式 `unknown`）
- [ ] 新增的非必填 prop 是否有明確預設值（不能讓現有使用者必須更新）
- [ ] 移除或重新命名 prop 是否標記 `@deprecated`
- [ ] Emits 是否有明確的 payload 型別定義
- [ ] `defineExpose` 僅在必要時使用，且方法有型別

## Breaking Change 偵測

下列情況一律視為 breaking change，不得在 minor/patch 版本發布：

- 移除任何已導出的 props、emits、slot、expose 方法
- 更改 prop 的型別（收窄 union type 亦屬 breaking）
- 更改 `v-model` 的行為或 event name
- 更改元件的 DOM 結構導致使用者的 CSS 選擇器失效
- 更改導出名稱（`export { Btn }` → `export { Button }`）

## TypeScript 審查

- [ ] 無 `as any` 強制轉型
- [ ] 無 `// @ts-ignore` 或 `// @ts-expect-error`（除非附上原因說明）
- [ ] Interface 或 type 的命名符合規範（`ComponentNameProps`）
- [ ] 所有導出型別使用 `export type`

## 樣式審查

- [ ] 無直接使用 Tailwind 預設顏色 class（應使用 design token）
- [ ] 無 `@apply` 在 `<style scoped>` 內
- [ ] 動態 class 邏輯提取為 `computed`，非內嵌三元運算
- [ ] Dark mode 透過 CSS variable 切換，非 `dark:` variant

## 測試覆蓋審查

- [ ] 互動元件有對應的 `play()` function story
- [ ] 鍵盤操作能在 story 中正確觸發
- [ ] a11y 規則無 violations（可在 Storybook Test UI 檢視）
- [ ] 新增 story 覆蓋所有 variant 和重要狀態
- [ ] 若某元件為父元件內部附屬封裝，其主要狀態與互動是否已在父元件 story 中被覆蓋

## A11y 審查

- [ ] 互動元素有語意化 HTML 標籤（`<button>`、`<a>`、`<input>`）
- [ ] img 元素有 `alt`，裝飾性圖片使用 `alt=""`
- [ ] focus 狀態可見（outline、ring 等視覺提示）
- [ ] 顏色對比度符合 WCAG AA 標準（4.5:1 for text）
- [ ] ARIA 屬性使用正確（`aria-label`、`aria-expanded`、`role`）

## Story 審查

- [ ] story `title` 符合分類規範（`UI/`、`Form/`、`Layout/` 等）
- [ ] meta 使用 `satisfies Meta<typeof Component>`
- [ ] 有 `tags: ['autodocs']`
- [ ] ArgTypes 有 `description` 和正確的 `control` 類型
