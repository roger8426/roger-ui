# Card

通用卡片容器元件，支援封面、header、footer 插槽、陰影等級、自訂圓角與可互動的 hover 效果。

## 使用範例

```vue
<!-- 基本用法 -->
<Card>
  這是卡片內容
</Card>

<!-- 完整插槽用法 -->
<Card>
  <template #cover>
    <img src="cover.jpg" alt="封面" class="w-full object-cover" />
  </template>
  <template #header>
    <h2>卡片標題</h2>
  </template>
  卡片主體內容
  <template #footer>
    <Button>操作</Button>
  </template>
</Card>

<!-- 自訂陰影、圓角與內距 -->
<Card shadow="lg" :radius="8" :padding="24">
  深陰影、小圓角、大內距
</Card>

<!-- 停用陰影 -->
<Card shadow="none">
  無陰影扁平風格
</Card>

<!-- 可互動（hover 上浮效果，點擊時觸發） -->
<Card hoverable @click="handleClick">
  點我有反應
</Card>

<!-- 自訂背景色 -->
<Card bgColor="oklch(95% 0.02 264)">
  自訂背景
</Card>
```

## Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `shadow` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 陰影濃度 |
| `padding` | `number` | `16` | 各插槽區塊的內距（px） |
| `radius` | `number \| 'full'` | `12` | 圓角半徑（px 數值或 `'full'` 表示完整圓形） |
| `bgColor` | `string` | — | 背景顏色（任意 CSS 色彩值，預設使用 `--rui-color-card-bg` token） |
| `hoverable` | `boolean` | `false` | 是否啟用 hover 上浮效果；`shadow: 'none'` 時僅有位移，無陰影增強 |

## Slots

| Slot | 說明 |
|------|------|
| `default` | 卡片主體內容（必要） |
| `cover` | 封面區塊，位於卡片頂部，無內距 |
| `header` | 標題區塊，位於主體上方，底部帶分隔線 |
| `footer` | 底部區塊，位於主體下方，頂部帶分隔線 |

## 無障礙

- 啟用 `hoverable` 時，元素自動加上 `role="button"` 與 `tabindex="0"`，支援鍵盤 `Enter` / `Space` 觸發點擊。
