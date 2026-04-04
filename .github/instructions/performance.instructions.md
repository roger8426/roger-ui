---
description: 'Use when optimizing performance, reducing bundle size, analyzing build output, or improving runtime rendering efficiency in a Vue UI library.'
---

# 效能優化規範

## Bundle Size

- 元件一律以 named export 提供，支援使用者 tree-shaking（禁止 `export * from`）
- 禁止在元件內 import 整個工具庫，僅 import 需要的函式

```ts
// 正確
import { debounce } from 'lodash-es'

// 錯誤
import _ from 'lodash'
```

- 大型或非首屏元件可在**應用層或 Story** 使用 `defineAsyncComponent` 懶載入；不要把公開 library entry 的同步 named export 改成 async component 包裝

```ts
// 在應用層或 story 中
const Modal = defineAsyncComponent(() => import('./Modal.vue'))
```

- 定期執行 `pnpm build-storybook` 並檢視 bundle 大小，不允許單一元件超過 10KB（gzip）

## 響應式效能

- 避免在 `computed` 內進行大量計算或 DOM 查詢
- 大型列表使用虛擬滾動（不在套件內強制依賴，但設計 API 時需預留 `virtual` prop 擴充點）
- `watch` 加上 `{ immediate: false }` 除非確實需要立即觸發
- 避免不必要的 `watchEffect`，優先用 `computed`

## 渲染效能

- 條件渲染優先使用 `v-show`（元件已掛載且頻繁切換），`v-if` 用於真正不需要的元素
- 禁止在 `v-for` 內使用 `v-if`（先用 `computed` 過濾）
- `v-for` 必須提供穩定的 `:key`，禁止使用 index 作為 key（除非列表不會重排）

```html
<!-- 錯誤 -->
<li v-for="(item, i) in list" :key="i">

<!-- 正確 -->
<li v-for="item in list" :key="item.id">
```

## Tailwind & CSS 效能

- 不使用 `@apply`（主因是降低樣式抽象層、維持 template 與 token 關係可讀，不是為了避免重複 CSS 輸出）
- 元件的 Tailwind class 在 build 時由使用者端 scan 生成，本套件不包含預編譯的 utility CSS
- 動態 class 的字串必須是完整 class name，不可使用字樣拼接（Tailwind 無法靜態分析）

```ts
// 錯誤：Tailwind 無法靜態分析
const cls = `bg-${color}-500`

// 正確：完整 class name（使用語意 token class，不使用 Tailwind 預設顏色）
const variantMap = { primary: 'bg-primary', danger: 'bg-danger' }
const cls = variantMap[variant]
```

## Storybook Build 效能

- story 檔案不 import 非必要的 decorators 或全域元件
- `play()` function 中避免不必要的 `waitFor`，優先用 `expect().resolves`
- 大型 story 集分拆為多個 story 檔案
