---
description: 'Use when writing TypeScript in any .ts or .vue file. Covers type declarations, Vue integration patterns, forbidden constructs, and type safety conventions for this UI library.'
applyTo: '**/*.{ts,vue}'
---

# TypeScript 規範

## 1. 編譯器設定要求

- 必須開啟 `strict` 模式，不得透過 `tsconfig` override 關閉任何 strict flag
- `noUncheckedIndexedAccess` 不得關閉
- 不得新增 `// @ts-nocheck` 於任何檔案頂層

---

## 2. 禁止事項

- **禁止 `any`**，包含隱式 any（未標記型別的函式參數、寬鬆物件等）
- **禁止 `@ts-ignore`**，無任何例外
- **禁止 unsafe double assertion**：`x as unknown as Y` 視為設計問題，應修正型別而非強制轉型
- **禁止 `enum`**：改用字串 union 或 `as const` 物件（見第 4 節）
- **禁止 `@ts-expect-error`**（無說明）：若確實無法繞過 third-party 型別缺陷，允許使用，但必須緊鄰附上說明 comment

```ts
// ❌
// @ts-expect-error
someLib.brokenMethod()

// ✅
// @ts-expect-error: someLib v2 的型別定義錯誤未修正，實際回傳 string
someLib.brokenMethod()
```

---

## 3. `interface` / `type` 使用時機

### 使用 `interface`

物件結構優先使用 `interface`：Props、Context、SlotProps、API model 等可被繼承的結構。

```ts
// ✅
export interface ButtonProps {
  disabled?: boolean
  size?: ButtonSize
}

export interface AccordionContext {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}
```

### 使用 `type`

`interface` 無法表達的情況才使用 `type`：union、intersection、Mapped Types、條件型別、tuple。

```ts
// ✅ union
export type ButtonSize = 'sm' | 'md' | 'lg'

// ✅ Mapped Type
export type PropsWithDefaults<T> = { [K in keyof T]-?: T[K] }

// ✅ 條件型別
export type MaybeRef<T> = T | Ref<T>
```

### 命名慣例

| 型別                      | 命名格式                   | 範例                     |
| ------------------------- | -------------------------- | ------------------------ |
| Props                     | `{ComponentName}Props`     | `ButtonProps`            |
| Context（provide/inject） | `{ComponentName}Context`   | `AccordionContext`       |
| Slot Props                | `{ComponentName}SlotProps` | `CheckboxGroupSlotProps` |
| Size union                | `{ComponentName}Size`      | `ButtonSize`             |
| Emits                     | `{ComponentName}Emits`     | `InputEmits`             |

---

## 4. `enum` 替代方案

禁止使用 TypeScript `enum`，理由：會在 runtime 產生 IIFE 物件包裝，不利 tree-shaking；消費者需額外 import 才能使用值。

### 情境 A：純型別選項（最常見）

```ts
// ✅ 字串 union，無 runtime overhead
export type ButtonSize = 'sm' | 'md' | 'lg'
```

### 情境 B：需要 runtime 遍歷（如 `Object.values`）

```ts
// ✅ as const 物件 + 推導型別
export const BUTTON_SIZE = { sm: 'sm', md: 'md', lg: 'lg' } as const
export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE]
```

```ts
// ❌ enum
enum ButtonSize {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}
```

---

## 5. `readonly` 規範

Props 中的陣列型別必須加 `readonly`，防止元件內部意外 mutate 上層傳入的陣列。

```ts
// ✅
export interface SelectProps {
  options: readonly SelectOption[]
}

// ❌
export interface SelectProps {
  options: SelectOption[]
}
```

Tuple 型別同樣應加 `readonly`：

```ts
// ✅
type Range = readonly [number, number]
```

---

## 6. 泛型元件設計

可接受任意使用者資料的元件（如 `VirtualList`、`Select`）應使用泛型參數，而非退化到 `unknown[]`。

```ts
// ✅ 泛型元件 Props
export interface VirtualListProps<T> {
  items: readonly T[]
  itemHeight: number
}

// ✅ 搭配 Vue defineProps（Vue 3.3+）
const props = defineProps<VirtualListProps<T>>()
```

泛型參數應盡量加型別約束，避免過於寬鬆：

```ts
// ✅ 有約束
interface SelectProps<T extends { label: string; value: unknown }> { ... }

// 可接受，但較寬鬆
interface SelectProps<T> { ... }
```

---

## 7. Discriminated Union 互斥 Prop 建模

當元件有互斥的操作模式時，用 discriminated union 建模，而非把所有 props 堆在同一個 interface 並讓部分 props 在某模式下被忽略。

```ts
// ✅ discriminated union（有明確判別欄位）
type BadgeMode = { dot: true } | { dot?: false; value?: number; max?: number }

// 可接受，但 dot / value 並存時行為需在文件說明優先順序
export interface BadgeProps {
  dot?: boolean
  value?: number
}
```

---

## 8. Type Guard

優先使用語言內建的 narrowing 方式，不需要自訂 guard：

```ts
// ✅ instanceof
if (err instanceof Error) { ... }

// ✅ in
if ('label' in option) { ... }

// ✅ typeof
if (typeof value === 'string') { ... }
```

需要自訂型別判斷函式時才使用 `is` predicate：

```ts
// ✅ 自訂 guard
function isSelectOption(v: unknown): v is SelectOption {
  return typeof v === 'object' && v !== null && 'label' in v && 'value' in v
}
```

---

## 9. `never` Exhaustive Check

在 discriminated union 的 `switch` 或 `if-else` 需窮舉所有分支時，於 default 加 `never` 驗證，確保未來新增成員時 TypeScript 能立即報錯。

```ts
type Placement = 'top' | 'bottom' | 'left' | 'right'

function getOffset(placement: Placement): number {
  switch (placement) {
    case 'top':
      return -8
    case 'bottom':
      return 8
    case 'left':
      return -8
    case 'right':
      return 8
    default: {
      const _exhaustive: never = placement
      throw new Error(`Unhandled placement: ${_exhaustive}`)
    }
  }
}
```

---

## 10. `Record<K, V>` vs Index Signature

| 情境               | 使用                                                 |
| ------------------ | ---------------------------------------------------- |
| Key 集合固定且已知 | `Record<ButtonSize, string>`                         |
| Key 為任意動態字串 | `{ [key: string]: string }` 或 `Map<string, string>` |

```ts
// ✅ 固定 key 集合
const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-7 text-xs',
  md: 'h-9 text-sm',
  lg: 'h-11 text-base',
}

// ✅ 動態 key（prefer Map 如需頻繁增刪）
const cache: Record<string, string> = {}
```

---

## 11. Template Ref 型別寫法

使用 Vue 3.5+ 的 `useTemplateRef`，而非 `ref<T | null>(null)` 搭配手動標記。

```ts
// ✅ DOM element ref
const inputRef = useTemplateRef<HTMLInputElement>('input')

// ✅ Component instance ref
const modalRef = useTemplateRef<InstanceType<typeof Modal>>('modal')

// ❌ 舊式寫法（仍可運作但不推薦）
const inputRef = ref<HTMLInputElement | null>(null)
```

若確實需要 `as` 斷言取值，必須附 comment（見第 13 節）。

---

## 12. Vue 整合型別慣例

### defineProps / defineEmits

一律使用泛型型別版本，不使用 runtime object 版本：

```ts
// ✅
const props = defineProps<ButtonProps>()
const emit = defineEmits<{
  click: [event: MouseEvent]
  change: [value: string]
}>()

// ❌
const props = defineProps({ disabled: Boolean })
```

### withDefaults

搭配 `withDefaults` 提供 runtime 預設值，**所有非必填 prop 都必須有預設值**：

```ts
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  size: 'md',
  radius: 'full',
  disabled: false,
  loading: false,
  outline: false,
})
```

### provide / inject（InjectionKey 模式）

provide/inject 必須透過 `InjectionKey<T>` 確保型別安全，不得使用字串 key：

```ts
// ✅ types.ts 中定義
import type { InjectionKey } from 'vue'

export const ACCORDION_CONTEXT_KEY: InjectionKey<AccordionContext> = Symbol('accordion')

// ✅ 父元件 provide
provide(ACCORDION_CONTEXT_KEY, context)

// ✅ 子元件 inject（附預設值或明確處理 undefined）
const ctx = inject(ACCORDION_CONTEXT_KEY)
if (!ctx) throw new Error('AccordionItem must be used inside Accordion')
```

### Ref 在 Context 物件中的標記

Context 物件內的 reactive 欄位明確以 `Ref<T>` 標記，不使用裸值：

```ts
// ✅
export interface CheckboxGroupContext {
  selectedValues: Ref<unknown[]>
  disabled: Ref<boolean>
  toggle: (value: unknown) => void
}
```

---

## 13. `import type` 規範

純型別引用（不在 runtime 使用）一律使用 `import type`：

```ts
// ✅
import type { InjectionKey, Ref } from 'vue'
import type { ButtonProps } from './types'

// ❌
import { InjectionKey, Ref } from 'vue'
```

---

## 14. `unknown` vs `any`

| 情境                                      | 型別       |
| ----------------------------------------- | ---------- |
| 使用者傳入的不確定值（如 checkbox value） | `unknown`  |
| 外部 API / JSON 回應尚未解析              | `unknown`  |
| 任何情況                                  | 禁止 `any` |

`unknown` 必須先經過 narrowing 才能操作；若某個值確實需要跳過型別檢查，應優先修正型別設計。

```ts
// ✅
export interface CheckboxProps {
  value?: unknown // 使用者自定義的選項值，型別不確定
}
```

---

## 15. `satisfies` 使用場景

`satisfies` 保留值的推導型別，同時驗證其符合某個型別約束，適用於 config 物件與 Storybook story meta。

```ts
// ✅ Storybook meta（保留 args 推導，同時驗證符合 Meta<T>）
const meta = {
  title: 'UI/Button',
  component: Button,
  args: { size: 'md' },
} satisfies Meta<typeof Button>

// ✅ 固定 key config 物件（保留各 key 的細部型別）
const radiusMap = {
  full: '9999px',
  sm: '4px',
  md: '8px',
} satisfies Record<ButtonRadius, string>
```

---

## 16. `as` 型別斷言使用規則

`as` 斷言有條件允許，僅限 TypeScript 無法自動推導的框架邊界情境：

- Vue template ref 取值時
- DOM event target 轉型（`e.target as HTMLInputElement`）
- 無法修改的 third-party 型別缺陷

**使用時必須緊鄰附上 comment 說明原因**：

```ts
// ✅
const input = inputRef.value as HTMLInputElement
// 因 useTemplateRef 在 onMounted 後保證非 null，但型別仍為 T | null

// ✅
const target = e.target as HTMLInputElement
// input 事件的 target 在此 listener 所屬 template 結構中保證為 HTMLInputElement

// ❌ 無說明
const x = someValue as SomeType
```

---

## 17. 工具型別使用準則

| 工具型別                          | 使用判斷                                                                |
| --------------------------------- | ----------------------------------------------------------------------- |
| `Partial<T>`                      | 可用，但避免用於建立「全選填版本」的公開 API 參數（應明確定義哪些選填） |
| `Required<T>`                     | 可用                                                                    |
| `Pick<T, K>`                      | 可用                                                                    |
| `Omit<T, K>`                      | 可用，但若刪減後的型別有明確語意，優先新增獨立 interface                |
| `ReturnType<typeof fn>`           | 禁止作為公開 API 型別，應明確定義並命名回傳型別                         |
| `Parameters<typeof fn>`           | 同上，不作為公開 API 型別                                               |
| `NonNullable<T>`                  | 可用                                                                    |
| `Extract<T, U>` / `Exclude<T, U>` | 可用，但避免堆疊多層造成型別難以閱讀                                    |
