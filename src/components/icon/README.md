# Icon

SVG 圖示元件，透過 `import.meta.glob` 靜態打包 `src/assets/icons/` 內的圖示，支援自訂尺寸、顏色與無障礙標籤。

## 使用範例

```vue
<!-- 基本使用 -->
<Icon name="list" />

<!-- 自訂尺寸 -->
<Icon name="check" :size="24" />

<!-- 自訂顏色 -->
<Icon name="close" color="oklch(55% 0.2 15)" />

<!-- 語意性圖示（提供 aria-label） -->
<Icon name="list" ariaLabel="開啟選單" />
```

## Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `name` | `string` | — | 圖示名稱（必填），對應 `src/assets/icons/{name}.svg` |
| `size` | `number` | `20` | 圖示尺寸（px） |
| `color` | `string` | — | 圖示顏色（任意 CSS 色彩值），未設定則繼承父元素 `currentColor` |
| `ariaLabel` | `string` | — | 無障礙標籤，設定後元素加上 `role="img"`，未設定則為 `aria-hidden="true"` |

## 可用圖示

| 名稱 | 說明 |
|------|------|
| `list` | 清單 |
| `check` | 勾選 |
| `close` | 關閉 |

新增圖示：將 `.svg` 檔案放於 `src/assets/icons/`，重新啟動 Storybook 後即可使用。

## 無障礙

- **裝飾性圖示**（不傳 `ariaLabel`）：自動加上 `aria-hidden="true"`，螢幕閱讀器會略過。
- **語意性圖示**（傳入 `ariaLabel`）：加上 `role="img"` 與 `aria-label`，螢幕閱讀器會朗讀標籤文字。

```vue
<!-- 裝飾性：螢幕閱讀器忽略 -->
<Icon name="check" />

<!-- 語意性：螢幕閱讀器朗讀「已完成」 -->
<Icon name="check" ariaLabel="已完成" />
```
