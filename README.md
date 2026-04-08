# roger-ui

基於 Vue 3 的 UI 元件庫，採用 Tailwind CSS v4 設計系統、TypeScript strict 模式，並以 Storybook 作為唯一開發預覽與互動測試入口。

## 技術棧

| 技術         | 版本  |
| ------------ | ----- |
| Vue          | ^3.5  |
| TypeScript   | ~5.9  |
| Tailwind CSS | ^4.2  |
| Storybook    | ^10.3 |
| Vite         | ^7.3  |
| Vitest       | ^4.0  |

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

| 指令                   | 說明                                                |
| ---------------------- | --------------------------------------------------- |
| `pnpm storybook`       | 啟動 Storybook 開發伺服器（port 6006）              |
| `pnpm build-storybook` | 建置 Storybook 靜態站台                             |
| `pnpm ci`              | 執行 CI 全流程檢查（type-check、lint、test、build） |
| `pnpm type-check`      | TypeScript 型別檢查                                 |
| `pnpm lint`            | 執行 oxlint + ESLint（含自動修復）                  |
| `pnpm lint:check`      | 執行 oxlint + ESLint 檢查，不修改檔案               |
| `pnpm format`          | Prettier 格式化                                     |
| `pnpm test:unit`       | 執行 Storybook + Playwright 的 Vitest browser 測試  |
| `pnpm test:unit:ci`    | 以非 watch 模式執行 Storybook browser 測試          |

## 使用方式

### 引入元件

```ts
import { Button } from 'roger-ui'
```

## 元件

元件依用途分為三類：

- **UI**：獨立的視覺呈現或互動元件，不直接處理表單資料
- **Form**：具備 `v-model` 的表單輸入控制元件，負責收集使用者資料
- **Layout**：負責內容結構排列與容器組織的版面元件

### UI

| 元件       | 說明                                                                                      | 文件                                            |
| ---------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Badge      | 徽章元件，可用於顯示計數、狀態標籤或圓點提示                                              | [查看文件](src/components/badge/README.md)      |
| Button     | 通用按鈕，支援自訂顏色、尺寸、outline 模式與停用狀態                                      | [查看文件](src/components/button/README.md)     |
| Carousel   | 輪播元件，支援水平滑動與淡入淡出切換，具備自動播放、循環、鍵盤導航、觸控 swipe 與受控模式 | [查看文件](src/components/carousel/README.md)   |
| Icon       | SVG 裝飾性圖示元件，支援自訂尺寸與顏色                                                    | [查看文件](src/components/icon/README.md)       |
| Modal      | 對話框元件，支援受控/非受控模式、focus trap 與 scroll lock                                | [查看文件](src/components/modal/README.md)      |
| Pagination | 分頁導航元件，支援受控模式（`v-model:currentPage`）、頁碼視窗、自訂顏色與外框樣式         | [查看文件](src/components/pagination/README.md) |
| Table      | 通用資料表格，支援排序、多選、固定表頭、凍結欄位、分組資料與自訂 cell / header 渲染       | [查看文件](src/components/table/README.md)      |

### Form

| 元件                     | 說明                                                                                    | 文件                                          |
| ------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------- |
| Checkbox / CheckboxGroup | 勾選框元件，支援獨立使用與群組模式，具備半選（indeterminate）、尺寸、錯誤狀態與自訂顏色 | [查看文件](src/components/checkbox/README.md) |
| Input                    | 文字輸入框，支援多種 type、錯誤狀態與前後綴插槽                                         | [查看文件](src/components/input/README.md)    |
| Select                   | 下拉選單，支援單選、可搜尋、分組選項與鍵盤導航                                          | [查看文件](src/components/select/README.md)   |
| TextArea                 | 多行文字輸入，支援自動高度調整、字元計數與錯誤狀態                                      | [查看文件](src/components/textarea/README.md) |

### Layout

| 元件                      | 說明                                                                            | 文件                                              |
| ------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- |
| Accordion / AccordionItem | 可摺疊的手風琴元件，支援受控/非受控模式、多選展開與禁止收合設定                 | [查看文件](src/components/accordion/README.md)    |
| Card                      | 通用卡片容器，支援封面、header、footer 插槽與 hover 效果                        | [查看文件](src/components/card/README.md)         |
| VirtualList               | 虛擬滾動列表，僅渲染可視範圍項目，適合萬筆以上資料，支援垂直/水平方向與無限捲動 | [查看文件](src/components/virtual-list/README.md) |

## 專案結構

```
src/
├── index.ts                  # 唯一公開入口
├── assets/
│   └── styles/
│       └── main.css          # Tailwind v4 設定與 design token
└── components/
    ├── accordion/            # Accordion + AccordionItem
    ├── badge/
    ├── button/
    │   ├── Button.vue        # 元件實作
    │   ├── Button.stories.ts # Storybook stories 與互動測試
    │   ├── types.ts          # Props 型別定義
    │   └── README.md         # 元件文件
    ├── card/
    ├── carousel/
    ├── checkbox/             # Checkbox + CheckboxGroup
    ├── icon/
    ├── input/
    ├── modal/
    ├── pagination/
    ├── select/
    ├── table/
    ├── textarea/
    └── virtual-list/
```

## IDE 設定

建議使用 [VS Code](https://code.visualstudio.com/) 搭配以下擴充套件：

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（請停用 Vetur）
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## CI/CD

GitHub Actions 的第一階段 CI 已實作完成，會在 push 與 pull request 時自動執行型別檢查、lint、Storybook browser tests、library build 與 Storybook build。

### 部署 Storybook 到 GitHub Pages

專案已提供自動部署 workflow，會在 push 到 `main` 時建置並發佈 `storybook-static` 到 GitHub Pages。

1. 到 GitHub repository 的 Settings → Pages。
2. 在 Build and deployment 將 Source 設為 GitHub Actions。
3. push 到 `main`，或手動執行 `.github/workflows/deploy-storybook.yml`。

部署完成後，站台網址會是：

- `https://roger8426.github.io/roger-ui/`

若你是 fork 或改了 repository 名稱，網址會變成 `https://<github-username>.github.io/<repository-name>/`。
