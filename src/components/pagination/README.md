# Pagination

分頁導航元件，支援受控模式（`v-model:currentPage`）、頁碼視窗、自訂顏色與外框樣式。

## 使用範例

```vue
<!-- 基本用法 -->
<Pagination :total="100" v-model:currentPage="page" />

<!-- 自訂每頁筆數與視窗寬度 -->
<Pagination :total="200" :pageSize="20" :visiblePages="3" v-model:currentPage="page" />

<!-- 顯示外框並套用自訂顏色 -->
<Pagination :total="50" border color="oklch(55% 0.2 250)" v-model:currentPage="page" />
```

## Props

| Prop           | 型別      | 預設值                     | 說明                                                                           |
| -------------- | --------- | -------------------------- | ------------------------------------------------------------------------------ |
| `total`        | `number`  | —                          | 資料總筆數（必填）                                                             |
| `currentPage`  | `number`  | `1`                        | 目前所在頁碼（從 1 開始），支援 `v-model:currentPage`                          |
| `pageSize`     | `number`  | `10`                       | 每頁筆數，用於計算總頁數                                                       |
| `visiblePages` | `number`  | `5`                        | 頁碼視窗顯示的頁碼數量                                                         |
| `border`       | `boolean` | `false`                    | 是否為頁碼按鈕顯示外框；active 頁碼外框顏色由 `color` 決定                     |
| `color`        | `string`  | `var(--rui-color-default)` | Active 頁碼的文字顏色，以及 `border` 模式下 active 外框顏色（任意 CSS 色彩值） |

## Emits

| 事件                 | Payload        | 說明                                            |
| -------------------- | -------------- | ----------------------------------------------- |
| `update:currentPage` | `page: number` | 頁碼變更時觸發；配合 `v-model:currentPage` 使用 |
| `change`             | `page: number` | 頁碼變更時同步觸發，可用於非 v-model 場景       |

## 預設顏色

| 使用情境              | 預設值                           |
| --------------------- | -------------------------------- |
| Active 頁碼文字及外框 | `var(--rui-color-default)`       |
| Hover 背景            | `var(--rui-color-surface-hover)` |
| Border 模式一般外框   | `var(--rui-color-border)`        |

## 備註

- `currentPage` 超出合法範圍時，元件內部會自動 clamp 至 `[1, totalPages]`，不會拋出錯誤。
- `total` 為 0 時，`totalPages` 視為 1，所有導航按鈕均 disabled。
- 元件為純受控設計，未傳入 `v-model:currentPage` 時頁碼不會自動更新。
