---
description: 'Core design philosophy for this UI library. Apply when designing new components, planning APIs, or making architectural decisions.'
applyTo: '**'
---

# UI 元件庫設計與 API 規劃理念

## 1. 文件目的

本文件用於定義 UI 元件庫的核心理念，作為元件設計、API 規劃與後續擴充時的共同準則。  
其目的是確保元件庫在持續開發的過程中，仍能維持一致的設計方向、穩定的 API 契約，以及明確的抽象邊界。

本文件應優先提供給 AI 輔助工具、Copilot 與開發者作為設計參考，而非作為單純的展示型說明文件。

---

## 2. 元件庫定位

本元件庫是一套 **獨立存在的 Vue 3 UI component library**，不依附任何特定產品、專案或業務場景。  
其核心目標不是建立強約束的設計系統，而是提供：

- 穩定的元件結構
- 一致的互動行為
- 可預測的 API 設計
- 高自由度的樣式控制能力

此元件庫應可套用於多種不同類型的前端專案，而不預設其視覺風格、領域模型或品牌規範。

---

## 3. 核心設計理念

### 3.1 Behavior First

元件設計優先考慮以下要素：

- HTML 語義正確
- 互動邏輯一致
- 狀態規則明確
- 可存取性合理
- 結構穩定

本元件庫的主要價值在於「元件的行為與契約一致」，而不是「預設外觀高度統一」。

---

### 3.2 Style Open

本元件庫採取高度自由的樣式策略。  
除了必要的初始預設樣式外，絕大部分的視覺樣式應交由使用者決定。

這代表：

- 元件不應綁定特定品牌色
- 元件不應內建過強的產品視覺風格
- 使用者應能透過明確介面直接控制樣式
- library 本身不應過度主導最終視覺呈現

此元件庫追求的是「結構一致、樣式開放」，而不是「樣式一致、客製困難」。

---

### 3.3 Token Minimal

design token 在本元件庫中不是核心抽象，而只是預設樣式的保底機制。

原則如下：

- token 只存在於初始預設樣式與 fallback
- token 不作為主要客製化入口
- 新元件不應依賴 token 建立整體樣式架構
- 元件設計不應以 theme-first 或 token-first 為前提

更精確地說，token 的責任是：

> 在使用者未明確指定樣式時，提供最低限度且中立的預設展示。

---

### 3.4 Explicit Over Semantic

在樣式控制上，優先採用顯式樣式 API，而非高度語意化的設計抽象。

較符合本元件庫方向的設計方式：

- `bgColor`
- `textColor`
- `borderColor`
- `radius`

而不是優先依賴：

- `theme="primary"`
- `tone="danger"`
- `surface="soft"`

本元件庫傾向讓使用者直接指定視覺結果，而不是透過多層語意映射間接控制樣式。

---

### 3.5 Stable Contract

即使樣式高度自由，以下內容仍必須保持穩定：

- props 命名
- slots 結構
- emits 規則
- 狀態切換邏輯
- 互斥規則
- disabled、loading、focus 等互動行為

高自由度不能成為 API 混亂的藉口。  
元件可以自由，但契約必須穩定。

---

## 4. 元件設計原則

### 4.1 優先設計 UI Primitive

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

不應優先收錄與特定領域強耦合的元件，例如：

- CharacterCard
- DicePanel
- InventoryBlock
- SkillEditor

業務型元件應屬於上層專案，不屬於通用元件庫的核心範圍。

---

### 4.2 保持單一責任

每個元件只應負責自身應處理的結構、狀態與互動。  
不應內建業務邏輯、資料流程或產品專屬判斷。

例如 Button 應處理：

- button 語義
- disabled / loading
- 尺寸與基本外觀控制

但不應處理：

- 特定 API submit 流程
- 領域狀態判斷
- 頁面權限邏輯
- 產品專屬互動規則

---

### 4.3 維持可推論的 API

prop 名稱應讓使用者能直接推知用途。  
避免使用語意模糊、覆蓋關係不明、責任邊界不清的命名。

API 應符合以下原則：

- 命名通用
- 規則清楚
- 行為穩定
- 不依賴隱含推論

---

### 4.4 互斥與覆蓋規則必須明確

若元件 props 存在互斥、忽略或覆蓋關係，必須符合以下條件：

- 規則固定
- 可預測
- 文件可描述
- 實作可驗證
- 開發模式下可提供警告

例如：

- `loading = true` 時自動視為不可互動
- `outline = true` 時背景固定透明
- `outline = true` 時 `bgColor` 被忽略
- `disabled = true` 時 hover 樣式不應生效

---

## 5. API 規劃理念

### 5.1 Props 分層原則

所有元件的 props 應盡量以三層結構思考：

### Behavior Props
負責行為與狀態控制，例如：

- `disabled`
- `loading`
- `type`
- `modelValue`
- `open`
- `readonly`
- `multiple`

### Structure Props
負責尺寸、形狀與布局特徵，例如：

- `size`
- `radius`
- `block`
- `orientation`
- `placement`

### Visual Props
負責外觀控制，例如：

- `bgColor`
- `textColor`
- `borderColor`
- `outline`
- `shadow`

> **顏色 props 的套用方式**：`bgColor`、`textColor`、`borderColor` 等顏色類 props 接受任意合法 CSS 色彩值，應透過 CSS inline style 或 CSS variable 套用至元件。**禁止**將這些值動態拼接成 Tailwind class（如 `` `bg-${bgColor}-500` ``）。

這三層應盡量分工明確，避免單一 prop 同時承擔多種責任。

---

### 5.2 命名一致性

相同概念應在不同元件之間保持相同命名。  
若某個概念已在既有元件中確立，就不應在其他元件中任意改名。

例如：

- 已使用 `radius`，就不要在其他元件改成 `rounded` 或 `corner`
- 已使用 `bgColor`，就不要在其他元件改成 `background` 或 `surfaceColor`

命名一致性比局部命名偏好更重要。

---

### 5.3 Boolean Prop 應保持單一語義

boolean prop 僅應代表一個明確概念，不應同時暗示多個視覺與行為效果。

例如 `outline` 若存在，應只代表一個穩定規則，例如：

- 背景固定透明

而不應同時不透明地綁定：

- 自動變更文字色
- 強制套用特定邊框色
- 強制變更 hover 模式

若某種模式未來存在明顯擴充空間，應考慮改用列舉型 prop，例如 `variant`。

---

### 5.4 顯式樣式優先，但不可無限制開洞

本元件庫支持使用者直接控制樣式，但不代表每個元件都應暴露大量零散樣式入口。

不鼓勵這類無邊界擴充方式：

- `wrapperClass`
- `contentClass`
- `innerClass`
- `headerClass`
- `bodyClass`

除非該元件本身具有穩定且明確的多區塊結構，否則不應透過大量 class props 提供自由度。

應優先使用：

- 有明確責任的 visual props
- 有穩定結構的 slots
- 有清楚邊界的樣式接口

---

## 6. 樣式設計原則

### 6.1 樣式優先權順序

元件樣式的優先權應遵循以下順序：

1. 使用者顯式傳入的樣式 props
2. 元件內部必要的結構性樣式
3. 預設樣式
4. token fallback

這代表：

- 使用者樣式優先
- 結構性樣式不可任意破壞
- token 僅為保底，不主導最終結果

---

### 6.2 預設樣式應中立

預設樣式的存在目的在於：

- 保證元件初始可用
- 避免展示過於原始
- 方便開發與文件展示

預設樣式不應帶有過強品牌感或業務語意。  
它應只是「中立起點」，而不是「建議最終風格」。

---

### 6.3 避免將 token 作為主體設計基礎

未來新元件應盡量避免依賴大規模 token 驅動設計。  
若使用 CSS variables，也應只作為初始 fallback，而非主要抽象層。

若需要預設 token，建議加上 namespace，以降低與宿主專案衝突的風險，例如：

- `--rui-color-default`
- `--rui-color-default-foreground`

---

## 7. 可存取性與狀態設計

### 7.1 可存取性是基本要求

高自由樣式不代表可忽略 a11y。  
所有元件都應至少考慮：

- 正確 HTML 語義
- disabled 狀態處理正確
- focus-visible 可辨識
- loading / busy 狀態具有適當語義
- 表單元件可建立 label 關聯
- 互動元件具備基本鍵盤操作能力

---

### 7.2 狀態必須被主動定義

元件設計時應主動檢查是否需要處理以下狀態：

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

不是每個元件都必須具備所有狀態，但不應在未分析的情況下省略。

---

## 8. Button 作為基準案例

Button 可作為本元件庫的代表性案例，用以說明設計理念如何落實。

### 8.1 Button 的責任

Button 應負責：

- 提供正確 button 語義
- 支援 `type`
- 支援 `disabled`
- 支援 `loading`
- 支援尺寸控制
- 支援圓角控制
- 支援顯式顏色控制
- 提供中立預設樣式

### 8.2 Button 不應負責

Button 不應處理：

- 領域型視覺語意
- 特定業務流程
- 提交後資料處理
- 產品專屬規則

### 8.3 Button 的 props 分層示例

**Behavior Props**
- `type`
- `disabled`
- `loading`

**Structure Props**
- `size`
- `radius`

**Visual Props**
- `outline`
- `bgColor`
- `textColor`
- `borderColor`

### 8.4 Button 的規則示例

- `loading = true` 時，元件應自動視為不可互動
- `outline = true` 時，背景固定透明
- `outline = true` 時，`bgColor` 被忽略
- `textColor` 與 `borderColor` 的控制邏輯可獨立存在
- hover 樣式僅在可互動狀態下生效

---

## 9. 給 AI / Copilot 的執行原則

在協助設計或實作此 UI library 時，必須遵守以下規則：

1. 優先維持語義正確、行為一致、結構穩定與可存取性。
2. 不要將元件庫設計成 token-first 或 theme-first 架構。
3. 樣式應以使用者顯式控制為主，token 僅作 fallback。
4. 不要將任何特定產品、業務場景或品牌風格偷渡進通用元件。
5. props 命名必須保持通用、一致、可推論。
6. 若 props 存在互斥或忽略規則，必須明確定義並保持穩定。
7. 不要為了自由度而無限制增加 class props。
8. 優先設計 UI primitives，不將業務型元件混入核心 library。
9. 新元件的 API 應延續既有元件的命名與分層方式。
10. 若某個設計會增加 API 混亂、隱含規則或業務耦合，應優先拒絕。

---

## 10. 總結

本 UI 元件庫的核心不是主題系統，也不是強約束設計系統。  
它是一套以穩定元件結構、一致互動行為與可預測 API 為基礎，並將大部分視覺決策交還給使用者的高自由度元件庫。

其設計判準不是「是否足夠像某個品牌」，而是：

- 是否足夠穩定
- 是否足夠通用
- 是否足夠清楚
- 是否足夠容易被客製
