import { computed, reactive, type ComputedRef, type Ref } from 'vue'

interface StackItem {
  id: string
  height: number
}

// 模組層級 singleton：以 `${x}-${y}` 為 key，記錄該位置目前開啟中的 Toast 清單（依註冊順序）
const stacks = reactive<Record<string, StackItem[]>>({})

function ensureStack(key: string): StackItem[] {
  const existing = stacks[key]
  if (existing) return existing
  stacks[key] = []
  // 重新取一次以拿到 reactive proxy
  return stacks[key] as StackItem[]
}

export interface UseToastStackReturn {
  register: () => void
  unregister: () => void
  updateHeight: (height: number) => void
  offset: ComputedRef<number>
}

/**
 * 管理單一 Toast 實例在同位置堆疊中的註冊與位移計算。
 * 每個 Toast 實例以其 id 註冊到對應 stackKey 的清單中，
 * offset 會依該 id 在清單中的索引累加前面所有 Toast 的高度 + gap。
 */
export function useToastStack(
  stackKey: Ref<string> | ComputedRef<string>,
  id: string,
  gap: Ref<number> | ComputedRef<number>,
): UseToastStackReturn {
  function register() {
    const list = ensureStack(stackKey.value)
    if (!list.some((item) => item.id === id)) {
      list.push({ id, height: 0 })
    }
  }

  function unregister() {
    for (const key of Object.keys(stacks)) {
      const list = stacks[key]
      if (!list) continue
      const idx = list.findIndex((item) => item.id === id)
      if (idx >= 0) list.splice(idx, 1)
    }
  }

  function updateHeight(height: number) {
    const list = stacks[stackKey.value]
    if (!list) return
    const item = list.find((it) => it.id === id)
    if (item) item.height = height
  }

  const offset = computed(() => {
    const list = stacks[stackKey.value]
    if (!list) return 0
    const idx = list.findIndex((item) => item.id === id)
    if (idx <= 0) return 0
    let acc = 0
    for (let i = 0; i < idx; i++) {
      const item = list[i]
      if (item) acc += item.height + gap.value
    }
    return acc
  })

  return { register, unregister, updateHeight, offset }
}
