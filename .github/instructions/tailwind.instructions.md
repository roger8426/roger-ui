---
description: 'Use when writing Vue components or CSS files with Tailwind. Covers Tailwind v4 syntax, @theme design tokens, class ordering, dark mode, and UI library theming conventions.'
applyTo: '**/*.{vue,css}'
---

# Tailwind CSS 規範（v4）

## 基礎語法

- CSS 入口使用 `@import "tailwindcss"`，不使用舊版 `@tailwind base/components/utilities`
- 自訂設定放在 CSS 內的 `@theme` 區塊，不使用 `tailwind.config.js`
- 禁止直接在元件寫 `<style>` 覆蓋 Tailwind utilities，應透過 `@theme` 定義 token

```css
/* src/assets/styles/main.css */
@import 'tailwindcss';

@theme {
  --color-primary: oklch(55% 0.2 250);
  --color-primary-hover: oklch(50% 0.2 250);
  --spacing-component-sm: 0.5rem;
  --spacing-component-md: 0.75rem;
  --spacing-component-lg: 1rem;
}
```

## Design Token 命名

- 所有自訂 token 以語意命名，不以視覺值命名
- 顏色 token：`--color-{role}` 或 `--color-{role}-{modifier}`
- 間距 token：`--spacing-{context}-{size}`
- 字體 token：`--font-{role}`

```css
/* 正確：語意命名 */
--color-surface: oklch(98% 0.01 250);
--color-surface-raised: oklch(100% 0 0);
--color-text: oklch(20% 0.02 250);
--color-text-muted: oklch(50% 0.02 250);

/* 錯誤：視覺值命名 */
--color-gray-100: ...;
--color-blue: ...;
```

## Class 撰寫規範

- Class 排列順序：佈局 → 尺寸 → 間距 → 顏色 → 字體 → 邊框 → 效果 → 互動狀態
- 使用 `class` 綁定時，優先使用靜態 class，動態部分用 `:class` 分開
- 避免 arbitrary value（`w-[137px]`），若需要則應提升為 design token

```vue
<!-- 正確：靜態與動態分離 -->
<button
  class="inline-flex items-center justify-center rounded-md font-medium transition-colors"
  :class="[sizeClasses, variantClasses, { 'opacity-50 cursor-not-allowed': disabled }]"
>

<!-- 避免：所有 class 混在一起難以維護 -->
<button :class="`...${size}...${variant}...`">
```

## 變體樣式管理

- 使用 computed object 管理 variant/size 的 class 映射，不要在 template 寫三元判斷
- 推薦使用 `cva`（class-variance-authority）管理複雜元件的變體

```ts
const sizeClasses = computed(
  () =>
    ({
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    })[props.size],
)
```

## Dark Mode

- 使用 CSS `prefers-color-scheme` media query 方式，透過 `@theme` 的 CSS variable 切換
- 不使用 Tailwind 的 `dark:` class variant（避免使用者環境的 class strategy 衝突）

```css
@theme {
  --color-surface: oklch(98% 0.01 250);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: oklch(15% 0.02 250);
  }
}
```

## 禁止事項

- 禁止在元件 `<style scoped>` 內使用 `@apply`（破壞 tree-shaking 並增加 bundle）
- 禁止使用 `!important` 覆蓋 Tailwind utilities
- 禁止直接使用 Tailwind 預設的顏色 class（如 `bg-blue-500`），應透過 token 對應
