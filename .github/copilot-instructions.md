# Copilot 專案全域指示

本專案是以 Vue 3 + TypeScript 為核心的 UI 元件庫（純 client-side，無 Nuxt）。

Copilot 在生成、修改、解釋、審查程式碼時，必須優先遵守以下規則。

## 核心原則

1. 優先最小必要改動，不做無授權的大範圍重寫。
2. 優先可讀性、可維護性、可審查性，不追求炫技式抽象。
3. 優先符合 Vue 慣例，而不是套用通用但不貼合框架的模式。
4. 清楚區分 UI 呈現、狀態、資料轉換與副作用。
5. 型別安全是基本要求，除非明確允許，否則不要使用 `any`。
6. 將 breaking change 視為一級約束，公開 API 的異動需明確標示。
7. 除非明確要求，不要新增第三方套件。
8. 產出的程式碼必須讓人類工程師容易理解、容易 review、容易接手。

## Vue 規則

1. Vue SFC 預設使用 `<script setup lang="ts">`。
2. 可推導資料優先使用 `computed`。
3. `watch` 只用於副作用、同步行為或監聽外部變化，不作為預設資料推導工具。
4. 避免把複雜邏輯直接寫在 template。
5. props、emits、slots 必須具備清楚語意。
6. 不要為了理論上的重用而過度抽象元件。
7. 不要在單一 component 中混合 rendering、資料轉換與流程控制。

## 工具鏈約束

1. 套件管理只使用 `pnpm`，禁止 `npm` 或 `yarn`。
2. Storybook 是**唯一的開發預覽入口**，禁止啟動 Vite dev server。
3. 元件測試一律透過 Storybook + Playwright 的 `play()` function，禁止 jsdom。
4. 測試斷言使用 `@storybook/test` 的 `expect`、`userEvent`、`within`。
5. Linting：oxlint + ESLint 兩者皆不可單獨停用。

## TypeScript 規則

1. 避免 `any`。
2. 優先使用明確的 domain type，而不是寬鬆物件結構。
3. DTO、API response、UI model 在需要時應分層。
4. 不要用不安全 assertion 掩蓋型別設計問題。
5. 保留 narrowing、nullable safety 與 optional 欄位處理。

## 元件開發約束

1. 每個元件必須有對應的 `.stories.ts` 檔案才算完成。
2. 有互動行為的元件必須有帶 `play()` 的 story。
3. 新增 prop 必須有預設值。
4. 禁止 default export 元件。
5. 禁止 `@apply` 在 `<style scoped>`。
6. 禁止直接使用 Tailwind 預設顏色 class（如 `text-blue-500`）。
7. 禁止動態拼接 Tailwind class 字串（如 `` `bg-${color}-500` ``）。

## 預設輸出期待

當使用者要求實作時，通常應輸出：

1. 任務理解或問題分析
2. 建議方案
3. 程式碼或 diff
4. 風險與驗證建議

當使用者要求 review 時，通常應輸出：

1. 問題列表
2. 風險等級
3. 最小修正方案
4. 可選的深入重構方向

## 應避免的反模式

1. 可用 `computed` 解決的問題卻使用 `watch`
2. 單一 composable 同時承擔過多責任（UI 狀態 + 副作用 + 流程控制）
3. 動態拼接 Tailwind class 字串
4. 在沒有需求前就新增抽象層
5. 未經授權的大範圍重構
6. 變更公開 prop/emit API 而不標示 breaking change

## 範圍控制

除非使用者明確要求，否則不要：

- 大範圍重新命名檔案
- 新增新套件
- 重設資料夾結構
- 變更既有對外 component API
- 修改不相關模組
