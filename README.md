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

### 作為 Git Submodule 引入

#### 加入 Submodule

```sh
git submodule add https://github.com/roger8426/roger-ui.git packages/ui
```

#### 安裝依賴並建置

```sh
cd packages/ui && pnpm install --ignore-workspace && pnpm build
```

> 若父專案非 pnpm workspace，可省略 `--ignore-workspace`。

#### 在父專案的 package.json 中加入本地依賴

```json
{
  "dependencies": {
    "roger-ui": "file:packages/ui"
  }
}
```

#### 設定 Tailwind CSS 掃描路徑

在父專案的 CSS 入口檔中加入 `@source`，讓 Tailwind 掃描元件庫中使用的 class：

```css
@import 'tailwindcss';
@source '../../../packages/ui/src';
```

> `@source` 路徑須根據該 CSS 檔案相對於 submodule 的實際位置調整。

確保父專案載入該 CSS 入口檔。以 Nuxt 為例：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
})
```

#### 引入元件

```ts
import { Button, Modal, Input } from 'roger-ui'
import type { ButtonProps } from 'roger-ui'
```

#### 更新 Submodule

首次 clone 含 submodule 的專案：

```sh
git clone --recurse-submodules https://github.com/roger8426/roger-ui.git
# 或在已 clone 的專案中
git submodule update --init
```

拉取 submodule 最新版本：

```sh
git submodule update --remote packages/ui
cd packages/ui && pnpm install --ignore-workspace && pnpm build
```

#### 可選

自定義別名設定，寫入 nuxt.config.ts 即可生效

```ts
alias: {
  '@ui': fileURLToPath(new URL('./packages/ui/dist/index.d.ts', import.meta.url)),
},
```

submodule 更新指令整合

```json
"scripts": {
  "update:ui": "git submodule update --remote packages/ui && cd packages/ui && pnpm install --ignore-workspace && pnpm build && cd ../.. && git add packages/ui"
}
```

> **注意事項**
>
> - 父專案須安裝 **Tailwind CSS v4** 與 `@tailwindcss/vite`（或對應的框架整合）
> - 父專案的 Vue 版本須 `^3.5`，與本專案一致
> - `vue` 已標記為 external，會使用父專案的 Vue 實例，不會重複打包
> - 每次 submodule 內容更新後需重新執行 `pnpm build`
> - Design token（`--rui-*` CSS custom properties）會在 import 元件時自動注入，如需單獨引入可使用 `import 'roger-ui/styles'`

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
| Drawer     | 抽屜元件，支援從上下左右四個方向滑出，具備受控/非受控模式、focus trap 與 scroll lock      | [查看文件](src/components/drawer/README.md)     |
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
| Toggle                   | 開關切換元件，支援 v-model、多種尺寸、自訂顏色與 thumb slot                             | [查看文件](src/components/toggle/README.md)   |

### Layout

| 元件                      | 說明                                                                            | 文件                                              |
| ------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- |
| Accordion / AccordionItem | 可摺疊的手風琴元件，支援受控/非受控模式、多選展開與禁止收合設定                 | [查看文件](src/components/accordion/README.md)    |
| Card                      | 通用卡片容器，支援封面、header、footer 插槽與 hover 效果                        | [查看文件](src/components/card/README.md)         |
| Tabs / Tab                | 分頁導航元件，支援受控/非受控模式、鍵盤導航（ARIA Tabs Pattern）與三種外觀模式  | [查看文件](src/components/tab/README.md)          |
| VirtualList               | 虛擬滾動列表，僅渲染可視範圍項目，適合萬筆以上資料，支援垂直/水平方向與無限捲動 | [查看文件](src/components/virtual-list/README.md) |

## 專案結構

```
src/
├── index.ts
├── assets/
│   └── styles/
│       ├── main.css
│       └── tokens.css
└── components/
    ├── accordion/            # Accordion + AccordionItem
    ├── badge/
    ├── button/
    ├── card/
    ├── carousel/
    ├── checkbox/             # Checkbox + CheckboxGroup
    ├── drawer/
    ├── icon/
    ├── input/
    ├── modal/
    ├── pagination/
    ├── select/
    ├── tab/                  # Tabs + Tab
    ├── table/
    ├── textarea/
    ├── toggle/
    └── virtual-list/
```

每個元件目錄的檔案結構一致：

| 檔案                         | 說明                         |
| ---------------------------- | ---------------------------- |
| `{ComponentName}.vue`        | 元件實作                     |
| `{ComponentName}.stories.ts` | Storybook stories 與互動測試 |
| `types.ts`                   | Props 型別定義               |
| `README.md`                  | 元件文件                     |

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
