---
description: 'Core design philosophy for this UI library. Apply when designing new components, planning APIs, or making architectural decisions.'
applyTo: '**'
---

# UI 元件庫設計與 API 規劃理念

## 1. 文件目的

本文件用於定義 UI 元件庫的核心理念，作為元件設計、API 規劃與後續擴充時的共同準則。  
其目的不是描述某個單一元件的實作細節，而是建立一套可持續延伸的判準，確保元件庫在開發過程中仍能維持一致的抽象方向、穩定的 API 契約與清楚的責任邊界。

本文件主要提供給以下對象使用：

- 開發者
- AI 輔助工具
- Copilot 類型的程式碼生成工具
- 未來在 monorepo 中使用此元件庫的其他專案

---

## 2. 專案定位

本元件庫是一套 **獨立存在的 Vue 3 UI component library**，不依附任何特定產品、品牌視覺或業務場景。  
它的目標不是建立一套強約束的設計系統，也不是為公開 npm 發佈而過度工程化，而是提供：

- 穩定的元件結構
- 一致的互動行為
- 清楚可預測的 API
- 高自由度的樣式控制能力

目前此元件庫的定位為：

> 以 GitHub 為主要維護載體，未來透過 monorepo 方式被多個專案共享使用的內部 UI library。

這代表本專案的主要設計重點應放在：

- 可重用性
- 抽象邊界
- API 一致性
- 與上層專案的低耦合

而不是優先放在：

- npm 發佈流程
- 公開套件市場化包裝
- 對陌生使用者的極致兼容
- 過早追求過度通用的對外發行架構

---

## 3. 核心設計理念

### 3.1 Behavior First

元件的首要價值在於其 **行為、語義與結構的一致性**，而不是預設視覺風格的一致性。

元件設計時應優先考慮以下面向：

- HTML 語義是否正確
- 互動行為是否穩定
- 狀態切換是否清楚
- 可存取性是否合理
- 結構是否可預測

本元件庫應優先保證：

- Button 的互動規則一致
- Dialog 的開關邏輯一致
- Input 的狀態行為一致
- Tabs、Dropdown、Tooltip 等元件的結構與操作模型一致

而不是優先保證所有元件都遵守同一套強主題視覺語言。

---

### 3.2 Style Open

本元件庫採取 **高度自由的樣式策略**。

原則如下：

- 絕大部分樣式應允許由使用者決定
- library 不應強加品牌色、產品色或固定視覺語言
- library 的預設樣式僅作為初始可用展示
- 使用者應能透過明確接口直接控制視覺結果

這意味著本元件庫追求的是：

> 結構穩定、行為一致、樣式開放。

而不是：

> 視覺強約束、主題高度集中、使用者只能在有限選項中挑選。

---

### 3.3 Token Minimal

design token 在本元件庫中不是核心抽象，而只是預設樣式的保底機制。

其定位如下：

- token 僅存在於初始預設樣式與 fallback
- token 不作為主要客製化手段
- 元件設計不應以 token-first 為前提
- 新元件應盡量避免依賴 token 建立整體樣式策略

更精確地說：

> token 的責任是讓元件在未客製化時不至於毫無樣式，而不是成為整套元件系統的主導設計語言。

因此本元件庫不應被描述為：

- token-driven UI library
- theme-first component system
- design system first architecture

---

### 3.4 Explicit Over Semantic

在樣式控制上，本元件庫優先採用 **顯式樣式 API**，而不是高度語意化抽象。

較符合本元件庫方向的設計方式：

- `bgColor`
- `textColor`
- `borderColor`
- `radius`

而非優先依賴這類語意化接口：

- `theme="primary"`
- `tone="danger"`
- `surface="soft"`

這代表本元件庫傾向：

- 讓使用者直接指定想要的樣式結果
- 降低多層語意映射造成的理解成本
- 將視覺控制權交回使用者

語意化 API 不是完全禁止，但若要使用，必須滿足以下條件：

- 規則明確
- 範圍有限
- 可預測
- 不掩蓋真實行為

---

### 3.5 Stable Contract

即使樣式高度自由，以下內容仍必須保持穩定：

- props 命名
- slots 結構
- emits 行為
- 狀態規則
- 互斥邏輯
- disabled / loading / focus / selected / open 等互動契約

高自由度不代表 API 可以隨意漂移。  
元件的視覺可以由使用者決定，但元件契約必須穩定、清楚且可推論。

---

## 4. 非目標

為了避免抽象方向失焦，本元件庫明確 **不以以下目標為核心**。

### 4.1 不是產品 UI 的抽離版

本元件庫不應直接承載特定產品的視覺語言、業務語意或資料模型。  
不得將某個 app 的畫面樣式或領域概念直接包裝成通用元件。

禁止出現以下傾向：

- 預設樣式帶有明顯產品品牌色
- props 名稱帶有特定業務語意
- 元件內部假設某個專案特有的資料結構
- 通用元件偷渡特定專案的互動規則

---

### 4.2 不是強約束設計系統

本元件庫不以「強制全域視覺一致性」為首要目標。  
因此不應過度設計以下內容：

- 複雜 token map
- 過度語意化 theme provider
- 多層品牌色票系統
- 為了一致性而過度犧牲使用自由度的 API

---

### 4.3 不是完全 headless library

本元件庫不是純邏輯與狀態工具庫。  
它可以提供基礎預設樣式，只是這些樣式應保持中立，並讓使用者容易覆蓋。

---

### 4.4 不是以 npm 發佈為前提的公共套件

至少在現階段，本元件庫不以公開發佈到 npm 為主要前提。  
因此設計決策應優先服務於：

- GitHub 維護
- monorepo 導入
- 多專案共享
- 自身長期擴充與維護

而不是優先滿足公共 npm 套件的完整發佈場景。

---

## 5. 元件設計原則

### 5.1 優先設計 UI Primitive

元件庫應優先收錄可跨場景重用的 UI primitives，例如：

- Button
- Input
- Textarea
- Checkbox
- Radio
- Select
- Card
- Badge
- Dialog
- Tabs
- Tooltip
- Dropdown
- Table
- Pagination

這些元件的特徵是：

- 不依賴特定領域
- 可在多種專案中重用
- 抽象邊界清楚
- 易於透過組合形成上層介面

---

### 5.2 避免將業務型元件混入核心 library

以下類型元件不應優先納入 library 核心：

- CharacterCard
- DicePanel
- InventoryBlock
- SkillEditor
- CharacterStatRow

這類元件屬於特定業務或產品層，應存在於上層專案，而不是通用 UI library 本體。

---

### 5.3 元件應保持單一責任

每個元件只負責自身應處理的事情，不應內建與 UI primitive 無關的業務邏輯。

例如 Button 應負責：

- 正確 button 語義
- disabled / loading 狀態
- 基本尺寸與外觀控制
- 可存取性相關行為

但不應負責：

- 特定 API submit 流程
- 資料驗證邏輯
- 領域型狀態判斷
- 頁面層業務規則

---

### 5.4 API 必須可推論

元件的 prop 命名與規則應讓使用者能快速推知其作用。  
避免設計出需要依賴隱含知識才能理解的接口。

良好的 API 應具備以下特性：

- 命名通用
- 行為清楚
- 覆蓋規則明確
- 使用成本低
- 不依賴過多隱含語意

---

### 5.5 互斥與覆蓋規則必須明確

若 props 之間存在互斥、忽略或覆蓋關係，必須符合以下條件：

- 規則固定
- 可預測
- 文件可描述
- 開發者可理解
- 必要時在開發模式提供警告

例如：

- `loading = true` 時，自動視為不可互動
- `outline = true` 時，背景固定透明
- `outline = true` 時，`bgColor` 被忽略
- `disabled = true` 時，不應出現 hover 狀態效果

這類規則是合理的，但必須穩定，不能模糊。

---

## 6. API 規劃理念

## 6.1 Props 分層原則

所有元件的 props 應盡量從三個層次思考：

### Behavior Props

負責行為與狀態控制，例如：

- `disabled`
- `loading`
- `type`
- `modelValue`
- `open`
- `readonly`
- `multiple`

這類 props 的責任是控制元件怎麼運作，而不是控制元件長什麼樣子。

---

### Structure Props

負責尺寸、形狀與布局特徵，例如：

- `size`
- `radius`
- `block`
- `orientation`
- `placement`

這類 props 描述的是元件的結構特徵，而非業務語意。

---

### Visual Props

負責外觀控制，例如：

- `bgColor`
- `textColor`
- `borderColor`
- `outline`
- `shadow`

這類 props 應直接對應視覺結果，避免語意過度抽象化。

---

### 6.2 Props 分層的目的

將 props 分層的目的不是形式化，而是為了讓 API 更容易維持一致：

- Behavior props 不應偷帶視覺含義
- Visual props 不應偷偷改變行為
- Structure props 不應被用來承載業務語意

一旦某個 prop 同時負責多個層級，API 就容易混亂。

---

### 6.3 命名一致性

相同概念必須在不同元件之間維持相同命名。  
一旦某個概念已被採用，就不應在其他元件中任意改名。

例如：

- 若使用 `radius`，就不要在其他元件改成 `rounded` 或 `corner`
- 若使用 `bgColor`，就不要在其他元件改成 `background` 或 `surfaceColor`

命名一致性優先於局部個人偏好。

---

### 6.4 Boolean Prop 必須保持單一語義

boolean prop 僅應代表一個清楚且穩定的概念。  
它不應同時暗示多種效果。

例如 `outline` 若存在，就應只代表一個主要規則，例如：

- 背景透明

而不應同時偷偷綁定：

- 自動更改文字顏色
- 自動決定邊框顏色
- 自動切換特定 hover 效果

若某個概念未來明顯會擴充成多種模式，應優先考慮改用列舉型 prop，例如：

- `variant`
- `tone`
- `placement`

---

### 6.5 顯式樣式優先，但不可無限制開洞

本元件庫雖然強調樣式自由，但自由度不應建立在「到處都能傳 class」之上。

不鼓勵以下這種無邊界的 API：

- `wrapperClass`
- `innerClass`
- `contentClass`
- `headerClass`
- `bodyClass`
- `textClass`

除非該元件天生具有穩定且必要的多區塊結構，否則不應透過大量 class props 來提供自由度。

更合理的方式是：

- 提供少量且責任清楚的 visual props
- 提供穩定的 slot 結構
- 僅在必要時提供有限的 class 擴充點

---

## 7. 樣式設計原則

### 7.1 樣式優先權順序

元件樣式的優先權應遵循以下順序：

1. 使用者顯式傳入的樣式 props
2. 元件內部必要的結構性樣式
3. 元件預設樣式
4. token fallback

這表示：

- 使用者樣式優先
- 結構性樣式不得被任意破壞
- 預設樣式只是起點
- token 只是保底，不主導元件風格

---

### 7.2 預設樣式應中立

預設樣式存在的目的在於：

- 讓元件初始可用
- 避免完全白底黑字或過於粗糙的展示
- 方便開發與 Storybook 驗證
- 作為未客製化時的基本視覺起點

預設樣式不應被視為最終推薦風格，也不應帶有過強品牌感。

---

### 7.3 Token 僅作 fallback

若元件使用 CSS variables 或 token，應將其視為 fallback，而不是 API 主體。

例如：

- `var(--rui-color-default)`
- `var(--rui-color-default-foreground)`

這些值可以存在，但只應在使用者未傳入明確樣式時提供保底效果。

---

### 7.4 Token 應避免污染宿主專案

若使用 CSS variables，建議加上 library namespace，以降低與宿主專案變數衝突的風險。

例如：

- `--rui-color-default`
- `--rui-color-default-foreground`
- `--rui-border-default`

不建議直接使用過於通用的命名，例如：

- `--color-default`
- `--text-color`
- `--border-color`

---

### 7.5 自由度不等於允許破壞結構

即使使用者能控制多數視覺樣式，仍不應讓其輕易破壞元件的核心結構與互動契約。

例如以下部分通常不應隨意開放到足以破壞元件本質：

- loading indicator 的定位邏輯
- dropdown 浮層定位容器
- dialog overlay 的行為樣式基礎
- tabs indicator 的結構基礎
- 表單控制元件的可存取性結構

原則是：

> 可自由的是視覺結果，不可自由的是元件契約。

---

## 8. 可存取性與狀態設計

### 8.1 可存取性是基本要求

樣式自由度再高，也不能放棄基本 a11y。  
所有元件都應至少考慮以下事項：

- HTML 語義正確
- disabled 狀態處理正確
- focus-visible 可辨識
- loading / busy 狀態具有適當語義
- 表單元件可建立 label 關聯
- 互動元件具備基本鍵盤操作能力

這不是附加功能，而是元件設計的底線。

---

### 8.2 狀態必須被主動定義

設計元件時，應主動思考是否需要處理以下狀態：

- default
- hover
- active
- focus-visible
- disabled
- loading
- selected
- open
- readonly
- error

不是每個元件都必須具備全部狀態，但每個元件都應對自身可能出現的狀態有清楚判斷。

---

## 9. Monorepo 導入前提下的設計要求

既然此元件庫未來將以 monorepo 模式被其他專案引用，則在設計上應特別注意以下事項。

### 9.1 不依賴特定 app 的資源與上下文

元件庫不應直接依賴：

- 特定 app 的 router
- 特定 app 的 store
- 特定 app 的 composables
- 特定 app 的 domain type
- 特定 app 的頁面結構與樣式上下文

元件庫應能在 monorepo 中被不同專案獨立引用，而不需要綁定某個既有應用。

---

### 9.2 API 必須比單專案元件更穩定

即使不發 npm，只要會被多個專案共享，API 仍應被視為共享契約。  
因此設計時必須避免：

- 相同概念在不同元件中命名不一致
- 臨時性 props 持續累積
- 以專案需求為由破壞通用抽象
- 讓元件庫退化成某個 app 的共用資料夾

---

### 9.3 應以可抽離、可引用、可維護為優先

元件設計時應優先思考：

- 未來能否被其他 workspace 乾淨引用
- 是否存在不必要的專案耦合
- 型別與樣式是否能獨立維護
- 是否具備清楚 package 邊界

---

## 10. Button 作為基準案例

Button 可作為本元件庫設計理念的代表性案例。

### 10.1 Button 的責任

Button 應負責：

- 提供正確的 button 語義
- 支援 `type`
- 支援 `disabled`
- 支援 `loading`
- 支援尺寸控制
- 支援圓角控制
- 支援顯式顏色控制
- 提供中立預設樣式

---

### 10.2 Button 不應負責

Button 不應處理：

- 領域型視覺語意
- 特定業務流程
- 提交後資料處理
- 產品專屬規則
- 頁面級狀態判斷

---

### 10.3 Button 的 props 分層示例

#### Behavior Props

- `type`
- `disabled`
- `loading`

#### Structure Props

- `size`
- `radius`

#### Visual Props

- `outline`
- `bgColor`
- `textColor`
- `borderColor`

---

### 10.4 Button 的規則示例

- `loading = true` 時，元件應自動視為不可互動
- `outline = true` 時，背景固定透明
- `outline = true` 時，`bgColor` 被忽略
- `textColor` 與 `borderColor` 的控制邏輯可獨立存在
- hover 樣式僅在可互動狀態下生效

這些規則體現的不是「強設計語言」，而是「清楚且穩定的元件契約」。

---

## 11. 給 AI / Copilot 的執行原則

在協助設計或實作此 UI library 時，必須遵守以下規則：

1. 優先維持語義正確、互動一致、結構穩定與可存取性。
2. 不要將元件庫設計成 token-first、theme-first 或 design-system-first 架構。
3. 樣式應以使用者顯式控制為主，token 僅作預設與 fallback。
4. 不要將任何特定產品、業務場景或品牌風格偷渡進通用元件。
5. props 命名必須保持通用、一致、可推論。
6. 若 props 存在互斥、忽略或覆蓋規則，必須明確定義並保持穩定。
7. 不要為了自由度而無限制增加 class props。
8. 優先設計 UI primitives，不將業務型元件混入核心 library。
9. 新元件的 API 應盡量延續既有元件的命名與分層方式。
10. 若某個設計會增加 API 混亂、隱含規則或業務耦合，應優先拒絕。
11. 設計時需考慮未來在 monorepo 中被其他專案引用的情境，避免引入 app-specific 依賴。
12. 不以公開 npm 套件的複雜發佈需求作為優先設計前提。

---

## 12. 總結

本 UI 元件庫的核心不是主題系統，也不是強約束設計系統。  
它是一套以穩定元件結構、一致互動行為與可預測 API 為基礎，並將大部分視覺決策交還給使用者的高自由度元件庫。

在現階段，它的主要使用情境不是公開發佈，而是：

- 在 GitHub 上維護
- 在 monorepo 中共享
- 被多個專案重用
- 作為長期可演進的 UI 基礎設施

因此，它的設計判準不應是「是否足夠像某個品牌」，而應是：

- 是否足夠穩定
- 是否足夠通用
- 是否足夠清楚
- 是否足夠容易被客製
- 是否足夠容易在多專案之間重用
