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

## 元件

| 元件 | 說明 | 文件 |
|------|------|------|
| Button | 通用按鈕，支援自訂顏色、尺寸、outline 模式與停用狀態 | [查看文件](src/components/button/README.md) |
| Input | 文字輸入框，支援多種 type、錯誤狀態與前後綴插槽 | [查看文件](src/components/input/README.md) |

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
