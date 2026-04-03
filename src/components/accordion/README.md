# Accordion

可摺疊的手風琴元件，由 `Accordion`（容器）與 `AccordionItem`（子項目）組成，支援受控/非受控模式、多選展開與禁止收合設定。

## 使用範例

```vue
<!-- 基本用法（非受控） -->
<Accordion defaultValue="item-1">
  <AccordionItem value="item-1" title="第一項">
    第一項的內容
  </AccordionItem>
  <AccordionItem value="item-2" title="第二項">
    第二項的內容
  </AccordionItem>
</Accordion>

<!-- 受控模式 -->
<Accordion v-model="openValue">
  <AccordionItem value="item-1" title="第一項">內容</AccordionItem>
  <AccordionItem value="item-2" title="第二項">內容</AccordionItem>
</Accordion>

<!-- 多選展開 -->
<Accordion multiple :defaultValue="['item-1', 'item-2']">
  <AccordionItem value="item-1" title="第一項">內容</AccordionItem>
  <AccordionItem value="item-2" title="第二項">內容</AccordionItem>
</Accordion>

<!-- 禁止收合（單選模式下不允許收起已展開的項目） -->
<Accordion :collapsible="false" defaultValue="item-1">
  <AccordionItem value="item-1" title="永遠有一項展開">內容</AccordionItem>
  <AccordionItem value="item-2" title="第二項">內容</AccordionItem>
</Accordion>

<!-- 停用整組 -->
<Accordion disabled>
  <AccordionItem value="item-1" title="停用中">內容</AccordionItem>
</Accordion>

<!-- 自訂標題插槽 -->
<AccordionItem value="custom">
  <template #title>
    <span class="font-bold">自訂標題</span>
  </template>
  內容
</AccordionItem>
```

## Accordion Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `modelValue` | `string \| string[]` | — | 受控模式：目前展開的 item value（單選傳 `string`，多選傳 `string[]`） |
| `defaultValue` | `string \| string[]` | — | 非受控模式：初始展開的 item value |
| `multiple` | `boolean` | `false` | 是否允許同時展開多個項目 |
| `disabled` | `boolean` | `false` | 是否停用整個 Accordion |
| `collapsible` | `boolean` | `true` | 已展開的項目是否可再次點擊收合（僅在 `multiple: false` 時有效） |

## Accordion Emits

| 事件 | Payload | 說明 |
|------|---------|------|
| `update:modelValue` | `string \| string[] \| undefined` | 展開狀態變更（v-model） |

## Accordion Slots

| Slot | 說明 |
|------|------|
| `default` | 放置 `AccordionItem` 元件 |

## AccordionItem Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `value` | `string` | **必填** | 唯一識別鍵，不可含空格 |
| `title` | `string` | `''` | Header 文字，可被 `#title` slot 覆寫 |
| `disabled` | `boolean` | `false` | 停用此項目（獨立停用，不影響其他項目） |

## AccordionItem Slots

| Slot | 說明 |
|------|------|
| `default` | 面板內容 |
| `title` | 自訂標題（覆寫 `title` prop） |

## 無障礙

- Header 按鈕帶有 `aria-expanded` 屬性，反映展開狀態。
- 面板帶有 `role="region"` 與 `aria-labelledby`，關聯對應的 header。
- 支援鍵盤操作：`Tab` 導航、`Enter` / `Space` 切換展開/收合。
- 停用狀態下按鈕帶有 `disabled` 屬性，螢幕閱讀器可正確識別。
