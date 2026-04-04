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
| `pnpm test:unit` | 執行 Storybook + Playwright 的 Vitest browser 測試 |

## 使用方式

### 引入元件

```ts
import { Button } from 'roger-ui'
```

## 元件

| 元件 | 說明 | 文件 |
|------|------|------|
| Accordion | 可摺疊的手風琴元件，支援受控/非受控模式、多選展開與禁止收合設定 | [查看文件](src/components/accordion/README.md) |
| Badge | 徽章元件，可用於顯示計數、狀態標籤或圓點提示 | [查看文件](src/components/badge/README.md) |
| Button | 通用按鈕，支援自訂顏色、尺寸、outline 模式與停用狀態 | [查看文件](src/components/button/README.md) |
| Card | 通用卡片容器，支援封面、header、footer 插槽與 hover 效果 | [查看文件](src/components/card/README.md) |
| Icon | SVG 裝飾性圖示元件，支援自訂尺寸與顏色 | [查看文件](src/components/icon/README.md) |
| Input | 文字輸入框，支援多種 type、錯誤狀態與前後綴插槽 | [查看文件](src/components/input/README.md) |
| Select | 下拉選單元件，支援單選、可搜尋、分組選項與鍵盤導航 | [查看文件](src/components/select/README.md) |
| TextArea | 多行文字輸入元件，支援自動高度調整、字元計數與錯誤狀態 | [查看文件](src/components/textarea/README.md) |

## 專案結構

```
src/
├── index.ts                  # 唯一公開入口
├── assets/
│   └── styles/
│       └── main.css          # Tailwind v4 設定與 design token
└── components/
    ├── button/
    │   ├── Button.vue        # 元件實作
    │   ├── Button.stories.ts # Storybook stories 與互動測試
    │   ├── types.ts          # Props 型別定義
    │   └── README.md         # 元件文件
    └── input/
        ├── Input.vue
        ├── Input.stories.ts
        ├── types.ts
        └── README.md
```

## IDE 設定

建議使用 [VS Code](https://code.visualstudio.com/) 搭配以下擴充套件：

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（請停用 Vetur）
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
