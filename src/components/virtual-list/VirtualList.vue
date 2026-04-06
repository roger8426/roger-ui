<template>
  <div
    ref="containerRef"
    class="virtual-list"
    :class="{ 'virtual-list--horizontal': isHorizontal }"
    tabindex="0"
    @scroll.passive="handleScroll"
  >
    <template v-if="items.length">
      <!-- 撐開捲動空間的 spacer，並作為項目的定位父層 -->
      <div class="virtual-list-spacer" :style="spacerStyle" role="list" :aria-label="ariaLabel">
        <div
          v-for="{ item, index } in visibleItems"
          :key="itemKeys[index]"
          role="listitem"
          :aria-setsize="items.length"
          :aria-posinset="index + 1"
          :style="getItemStyle(index)"
          class="virtual-list-item"
        >
          <slot :item="item" :index="index" />
        </div>
      </div>
    </template>

    <slot v-else name="empty" />
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { VirtualListProps, VirtualListEmits, VirtualListExpose } from './types'

const props = withDefaults(defineProps<VirtualListProps<T>>(), {
  direction: 'vertical',
  overscan: 3,
  keyField: undefined,
  threshold: 0,
  loading: false,
  ariaLabel: undefined,
})

const emit = defineEmits<VirtualListEmits>()

// ─── Refs ──────────────────────────────────────────────────────

const containerRef = ref<HTMLElement | null>(null)
const scrollOffset = ref(0)
const containerSize = ref(0)

// reach-end 去重旗標，當 items 長度增加時自動重置
let reachEndEmitted = false

// ─── 方向 ──────────────────────────────────────────────────────

const isHorizontal = computed(() => props.direction === 'horizontal')

// ─── 核心計算 ──────────────────────────────────────────────────

const totalSize = computed(() => props.items.length * props.itemSize)

const startIndex = computed(() => {
  const raw = Math.floor(scrollOffset.value / props.itemSize) - props.overscan
  return Math.max(0, raw)
})

const endIndex = computed(() => {
  const visibleCount = Math.ceil(containerSize.value / props.itemSize)
  const raw = Math.floor(scrollOffset.value / props.itemSize) + visibleCount + props.overscan
  return Math.min(props.items.length - 1, raw)
})

const visibleItems = computed(() => {
  const result: Array<{ item: T; index: number }> = []
  for (let i = startIndex.value; i <= endIndex.value; i++) {
    const item = props.items[i]
    if (item !== undefined) result.push({ item, index: i })
  }
  return result
})

const objectItemKeys = new WeakMap<object, number>()
let nextGeneratedKey = 0

const itemKeys = computed(() => {
  const primitiveOccurrences = new Map<string, number>()

  return props.items.map((item) => {
    if (props.keyField !== undefined) {
      const keyValue = item[props.keyField]
      if (keyValue !== undefined && keyValue !== null) {
        return String(keyValue)
      }
    }

    if ((typeof item === 'object' && item !== null) || typeof item === 'function') {
      const objectItem = item as object
      const existingKey = objectItemKeys.get(objectItem)

      if (existingKey !== undefined) {
        return existingKey
      }

      const generatedKey = nextGeneratedKey
      nextGeneratedKey += 1
      objectItemKeys.set(objectItem, generatedKey)
      return generatedKey
    }

    const primitiveKey = `${typeof item}:${String(item)}`
    const occurrence = primitiveOccurrences.get(primitiveKey) ?? 0
    primitiveOccurrences.set(primitiveKey, occurrence + 1)

    return `${primitiveKey}:${occurrence}`
  })
})

// ─── 樣式計算 ──────────────────────────────────────────────────

const spacerStyle = computed(() => {
  if (isHorizontal.value) {
    return { position: 'relative' as const, width: `${totalSize.value}px`, height: '100%' }
  }
  return { position: 'relative' as const, height: `${totalSize.value}px`, width: '100%' }
})

function getItemStyle(index: number): Record<string, string> {
  const offset = `${index * props.itemSize}px`
  const size = `${props.itemSize}px`
  if (isHorizontal.value) {
    return {
      position: 'absolute',
      left: offset,
      top: '0',
      width: size,
      height: '100%',
    }
  }
  return {
    position: 'absolute',
    top: offset,
    left: '0',
    width: '100%',
    height: size,
  }
}

// ─── 事件處理 ──────────────────────────────────────────────────

function handleScroll(event: Event): void {
  const el = event.target as HTMLElement
  const offset = isHorizontal.value ? el.scrollLeft : el.scrollTop
  scrollOffset.value = offset
  emit('scroll', offset, event)

  const distanceToEnd = totalSize.value - offset - containerSize.value
  if (distanceToEnd <= props.threshold && !props.loading && !reachEndEmitted) {
    reachEndEmitted = true
    emit('reach-end')
  }
}

// ─── items 增加時重置 reach-end flag ───────────────────────────

watch(
  () => props.items.length,
  (newLen, oldLen) => {
    if (newLen > oldLen) {
      reachEndEmitted = false
    }
  },
)

// ─── ResizeObserver ────────────────────────────────────────────

let resizeObserver: ResizeObserver | null = null

function updateContainerSize(): void {
  if (!containerRef.value) return
  containerSize.value = isHorizontal.value
    ? containerRef.value.clientWidth
    : containerRef.value.clientHeight
}

function updateScrollOffset(): void {
  if (!containerRef.value) return
  scrollOffset.value = isHorizontal.value
    ? containerRef.value.scrollLeft
    : containerRef.value.scrollTop
}

function syncViewportMetrics(): void {
  updateContainerSize()
  updateScrollOffset()
}

watch(
  isHorizontal,
  () => {
    syncViewportMetrics()
  },
  { flush: 'post' },
)

onMounted(() => {
  syncViewportMetrics()
  resizeObserver = new ResizeObserver(() => {
    syncViewportMetrics()
  })
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

// ─── 公開的命令式 API ───────────────────────────────────────────

function scrollToIndex(index: number, behavior: ScrollBehavior = 'auto'): void {
  scrollToOffset(index * props.itemSize, behavior)
}

function scrollToOffset(offset: number, behavior: ScrollBehavior = 'auto'): void {
  if (!containerRef.value) return
  if (isHorizontal.value) {
    containerRef.value.scrollTo({ left: offset, behavior })
  } else {
    containerRef.value.scrollTo({ top: offset, behavior })
  }
}

defineExpose<VirtualListExpose>({ scrollToIndex, scrollToOffset })
</script>

<style scoped>
.virtual-list {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}

.virtual-list--horizontal {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
}

.virtual-list-item {
  box-sizing: border-box;
}
</style>
