# Icon

SVG 圖示元件，透過 `import.meta.glob` 靜態打包 `src/assets/icons/` 內的圖示，支援自訂尺寸與顏色。

## 使用範例

```vue
<!-- 基本使用 -->
<Icon name="list" />

<!-- 自訂尺寸 -->
<Icon name="check" :size="24" />

<!-- 自訂顏色 -->
<Icon name="close" color="oklch(55% 0.2 15)" />
```

## Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `name` | `string` | — | 圖示名稱（必填），對應 `src/assets/icons/{name}.svg` |
| `size` | `number` | `20` | 圖示尺寸（px） |
| `color` | `string` | — | 圖示顏色（任意 CSS 色彩值），未設定則繼承父元素 `currentColor` |

## 可用圖示

| 名稱 | 說明 |
|------|------|
| `list` | 清單 |
| `check` | 勾選 |
| `close` | 關閉 |

新增圖示：將 `.svg` 檔案放於 `src/assets/icons/`，重新啟動 Storybook 後即可使用。

## 無障礙

- Icon 預設為**裝飾性圖示**，會加上 `aria-hidden="true"`，讓螢幕閱讀器略過。
- 若畫面需要可朗讀的語意，應由外層互動元件或文字內容提供，不由 Icon 本身承擔。

```vue
<!-- 裝飾性：螢幕閱讀器忽略 -->
<Icon name="check" />
```
