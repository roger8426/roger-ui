<template>
  <div :style="props.activeColor ? { '--rui-color-tab-indicator': props.activeColor } : undefined">
    <div
      class="relative"
      :class="{ 'border-b border-(--rui-color-tab-border)': props.type === 'border' }"
    >
      <div
        ref="tablistEl"
        :id="tablistId"
        role="tablist"
        :aria-label="label"
        class="flex"
        :class="{ 'gap-1 px-2 pt-1': props.type === 'border' }"
        @keydown="handleKeydown"
      />
      <div
        v-if="indicatorWidth > 0 && props.type === 'underline'"
        aria-hidden="true"
        class="absolute bottom-0 h-0.5 bg-(--rui-color-tab-indicator) transition-[left,width] duration-300 ease-in-out"
        :style="{ left: `${indicatorLeft}px`, width: `${indicatorWidth}px` }"
      />
    </div>
    <div
      :class="props.type === 'border' ? 'bg-(--rui-color-surface)' : ''"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  ref,
  useId,
  useTemplateRef,
  watch,
} from 'vue'
import { TABS_CONTEXT_KEY, type TabsProps } from './types'

defineOptions({ name: 'Tabs' })

const props = withDefaults(defineProps<TabsProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  disabled: false,
  label: undefined,
  activationMode: 'auto',
  activeColor: undefined,
  inactiveColor: undefined,
  type: 'underline',
  swipeable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const tablistId = `rui-tablist-${useId()}`

const internalValue = ref<string | undefined>(props.defaultValue)

const activeValue = computed<string | undefined>(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue
  }
  return internalValue.value
})

function select(value: string): void {
  if (props.modelValue !== undefined) {
    emit('update:modelValue', value)
  } else {
    internalValue.value = value
    emit('update:modelValue', value)
  }
}

const tablistEl = useTemplateRef<HTMLDivElement>('tablistEl')

function getTabs(): HTMLElement[] {
  if (!tablistEl.value) return []
  return Array.from(tablistEl.value.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'))
}

function handleKeydown(event: KeyboardEvent): void {
  const tabs = getTabs()
  if (tabs.length === 0) return

  const currentIndex = tabs.indexOf(event.target as HTMLElement)
  if (currentIndex === -1) return

  let nextIndex: number | undefined

  switch (event.key) {
    case 'ArrowRight':
      nextIndex = (currentIndex + 1) % tabs.length
      break
    case 'ArrowLeft':
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = tabs.length - 1
      break
    default:
      return
  }

  event.preventDefault()
  const nextTab = tabs[nextIndex]
  if (!nextTab) return
  nextTab.focus()

  if (props.activationMode === 'auto') {
    const value = nextTab.dataset['value']
    if (value !== undefined) {
      select(value)
    }
  }
}

const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

function updateIndicator(): void {
  const tablist = tablistEl.value
  if (!tablist) return
  const activeTab = tablist.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
  if (!activeTab) {
    indicatorWidth.value = 0
    return
  }
  const tablistRect = tablist.getBoundingClientRect()
  const tabRect = activeTab.getBoundingClientRect()
  indicatorLeft.value = tabRect.left - tablistRect.left
  indicatorWidth.value = tabRect.width
}

let touchStartX: number | null = null
let touchStartY: number | null = null

function handleTouchStart(e: TouchEvent): void {
  const touch = e.changedTouches[0]
  if (!touch) return
  touchStartX = touch.clientX
  touchStartY = touch.clientY
}

function handleTouchEnd(e: TouchEvent): void {
  if (!props.swipeable || touchStartX === null || touchStartY === null) return

  const touch = e.changedTouches[0]
  if (!touch) return

  const deltaX = touch.clientX - touchStartX
  const deltaY = touch.clientY - touchStartY

  touchStartX = null
  touchStartY = null

  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return

  const tabs = getTabs()
  if (tabs.length === 0) return

  const activeIndex = tabs.findIndex((t) => t.dataset['value'] === activeValue.value)
  const baseIndex = activeIndex === -1 ? 0 : activeIndex

  const nextIndex = deltaX < 0 ? baseIndex + 1 : baseIndex - 1
  if (nextIndex < 0 || nextIndex >= tabs.length) return

  const nextTab = tabs[nextIndex]
  if (!nextTab) return

  const value = nextTab.dataset['value']
  if (value !== undefined) {
    select(value)
  }
}

let rafId: ReturnType<typeof requestAnimationFrame> | null = null
let observer: MutationObserver | null = null

function scheduleUpdate(): void {
  if (rafId !== null) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    rafId = null
    updateIndicator()
  })
}

onMounted(() => {
  const tablist = tablistEl.value
  if (tablist) {
    observer = new MutationObserver(scheduleUpdate)
    observer.observe(tablist, { childList: true })
  }
  scheduleUpdate()
})

onUnmounted(() => {
  observer?.disconnect()
  if (rafId !== null) cancelAnimationFrame(rafId)
})

watch(activeValue, () => {
  nextTick(updateIndicator)
})

provide(
  TABS_CONTEXT_KEY,
  reactive({
    tablistId,
    activeValue,
    select,
    get disabled() {
      return props.disabled
    },
    get activationMode() {
      return props.activationMode
    },
    get activeColor() {
      return props.activeColor
    },
    get inactiveColor() {
      return props.inactiveColor
    },
    get type() {
      return props.type
    },
  }),
)
</script>
