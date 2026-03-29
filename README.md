# roger-ui

基於 Vue 3 的 UI 元件庫，採用 Tailwind CSS v4 設計系統、TypeScript strict 模式，並以 Storybook 作為唯一開發預覽與互動測試入口。

## 技術棧

| 技術 | 版本 |
|------|------|
| Vue | ^3.5 |
| TypeScript | ~5.9 |
| Tailwind CSS | ^4.2 |
| Storybook | ^10.3 |
| Vite | ^7.3 |
| Vitest | ^4.0 |

## 環境需求

- Node.js `^20.19.0` 或 `>=22.12.0`
- pnpm（禁止使用 npm 或 yarn）

## 安裝

```sh
pnpm install
```

## 開發

啟動 Storybook 開發伺服器（本專案唯一的開發預覽入口）：

```sh
pnpm storybook
```

瀏覽器開啟 [http://localhost:6006](http://localhost:6006)

## 指令

| 指令 | 說明 |
|------|------|
| `pnpm storybook` | 啟動 Storybook 開發伺服器（port 6006） |
| `pnpm build-storybook` | 建置 Storybook 靜態站台 |
| `pnpm type-check` | TypeScript 型別檢查 |
| `pnpm lint` | 執行 oxlint + ESLint（含自動修復） |
| `pnpm format` | Prettier 格式化 |
| `pnpm test:unit` | 執行 Vitest 單元測試 |

## 使用方式

### 引入元件

```ts
import { Button } from 'roger-ui'
import 'roger-ui/styles'
```

### 引入樣式 Token

所有設計 token 定義於 `src/assets/styles/main.css`，可在專案的 CSS 中直接引用：

```css
color: var(--color-primary);
background: var(--color-surface);
```

## 元件

### Button

通用按鈕元件，支援自訂顏色、尺寸、outline 模式與停用狀態。

```vue
<Button label="送出" />
<Button label="取消" outline />
<Button label="刪除" color="oklch(58% 0.22 15)" textColor="white" />
<Button label="大按鈕" size="lg" />
<Button label="停用" disabled />
```

#### Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `label` | `string` | — | 按鈕文字（必填） |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `outline` | `boolean` | `false` | Outline 模式（透明背景、主色邊框與文字） |
| `color` | `string` | `var(--color-primary)` | 背景顏色（任意 CSS 色彩值） |
| `textColor` | `string` | `white` | 文字顏色（任意 CSS 色彩值） |
| `borderColor` | `string` | — | 邊框顏色（未設定則無邊框） |
| `disabled` | `boolean` | `false` | 是否停用 |

#### Emits

| 事件 | 說明 |
|------|------|
| `press` | 按鈕被點擊時觸發 |

## 元件預設顏色

Button 元件的內建預設色（當未傳入 `color`／`textColor`／`borderColor` 時）：

| 使用情境 | 顏色 | 色碼 |
|----------|------|------|
| 一般模式背景 | 中藍 | `#3b5bdb` |
| 一般模式文字 | 白 | `#ffffff` |
| Outline 模式邊框與文字 | 中藍 | `#3b5bdb` |
| Outline 模式背景 | 全透明 | `#ffffff00` |

## 專案結構

```
src/
├── index.ts                  # 唯一公開入口
├── assets/
│   └── styles/
│       └── main.css          # Tailwind v4 設定與 design token
└── components/
    └── button/
        ├── Button.vue        # 元件實作
        ├── Button.stories.ts # Storybook stories 與互動測試
        └── types.ts          # Props 型別定義
```

## IDE 設定

建議使用 [VS Code](https://code.visualstudio.com/) 搭配以下擴充套件：

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（請停用 Vetur）
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
