<template>
  <div :style="props.activeColor ? { '--rui-color-tab-indicator': props.activeColor } : undefined">
    <div class="tabs-no-scrollbar overflow-x-auto">
      <div
        class="relative min-w-max"
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
        >
          <button
            v-for="tab in collectTabs()"
            :key="tab.value"
            :id="tab.tabId"
            role="tab"
            type="button"
            :aria-selected="tab.value === activeValue"
            :aria-controls="tab.panelId"
            :tabindex="tab.value === activeValue ? 0 : -1"
            :disabled="isTabDisabled(tab) || undefined"
            :data-value="tab.value"
            class="relative shrink-0 cursor-pointer px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--rui-color-default)"
            :class="buttonClasses(tab)"
            :style="buttonStyle(tab)"
            @click="handleClick(tab)"
          >
            <SlotRenderer
              v-if="tab.labelSlot"
              :fn="tab.labelSlot"
              :active="tab.value === activeValue"
              :disabled="isTabDisabled(tab)"
            />
            <template v-else>{{ tab.label }}</template>
          </button>
        </div>
        <div
          v-if="indicatorWidth > 0 && props.type === 'underline'"
          aria-hidden="true"
          class="absolute bottom-0 h-0.5 bg-(--rui-color-tab-indicator) transition-[left,width] duration-300 ease-in-out"
          :style="{ left: `${indicatorLeft}px`, width: `${indicatorWidth}px` }"
        />
      </div>
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
  Comment,
  Fragment,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  ref,
  useId,
  useSlots,
  useTemplateRef,
  watch,
  type Slot,
  type VNode,
} from 'vue'
import Tab from './Tab.vue'
import { TABS_CONTEXT_KEY, type TabIds, type TabsProps } from './types'

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

const slots = useSlots()
const tablistId = `rui-tablist-${useId()}`

interface TabDescriptor extends TabIds {
  value: string
  label: string
  disabled: boolean
  labelSlot: Slot | undefined
}

// 用 functional component 包 scoped slot 呼叫，避免在 template 直接 invoke slot fn
const SlotRenderer = (slotProps: {
  fn: Slot
  active: boolean
  disabled: boolean
}): ReturnType<Slot> => slotProps.fn({ active: slotProps.active, disabled: slotProps.disabled })

// 以 tablistId + value 組合，確保 panelId / tabId 在多個 Tabs 並存時不衝突
const makeIds = (value: string): TabIds => ({
  tabId: `${tablistId}-tab-${value}`,
  panelId: `${tablistId}-panel-${value}`,
})

// 從 default slot 蒐集所有 <Tab> 子節點，每次 render 重新解析以反映 i18n / props 變動
const collectTabs = (): TabDescriptor[] => {
  const result: TabDescriptor[] = []
  walk(slots.default?.() ?? [], result)
  return result
}

const walk = (vnodes: VNode[], out: TabDescriptor[]): void => {
  for (const node of vnodes) {
    if (!node || typeof node !== 'object') continue
    if (node.type === Comment) continue
    if (node.type === Fragment) {
      const children = Array.isArray(node.children) ? (node.children as VNode[]) : []
      walk(children, out)
      continue
    }
    if (node.type !== Tab) continue
    const tabProps = (node.props ?? {}) as {
      value?: string
      label?: string
      disabled?: unknown
    }
    if (typeof tabProps.value !== 'string') continue
    const childSlots =
      node.children && typeof node.children === 'object' && !Array.isArray(node.children)
        ? (node.children as Record<string, Slot | undefined>)
        : {}
    out.push({
      value: tabProps.value,
      label: tabProps.label ?? '',
      disabled: tabProps.disabled === true || tabProps.disabled === '',
      labelSlot: childSlots['label'],
      ...makeIds(tabProps.value),
    })
  }
}

const isTabDisabled = (tab: TabDescriptor): boolean => tab.disabled || props.disabled

const internalValue = ref<string | undefined>(props.defaultValue)

const activeValue = computed<string | undefined>(() => {
  if (props.modelValue !== undefined) return props.modelValue
  return internalValue.value
})

const select = (value: string): void => {
  if (props.modelValue !== undefined) {
    emit('update:modelValue', value)
  } else {
    internalValue.value = value
    emit('update:modelValue', value)
  }
}

const handleClick = (tab: TabDescriptor): void => {
  if (isTabDisabled(tab)) return
  select(tab.value)
}

const tablistEl = useTemplateRef<HTMLDivElement>('tablistEl')

const getTabButtons = (): HTMLElement[] => {
  if (!tablistEl.value) return []
  return Array.from(tablistEl.value.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'))
}

const handleKeydown = (event: KeyboardEvent): void => {
  const tabs = getTabButtons()
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
    if (value !== undefined) select(value)
  }
}

const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

const updateIndicator = (): void => {
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

const handleTouchStart = (e: TouchEvent): void => {
  const touch = e.changedTouches[0]
  if (!touch) return
  touchStartX = touch.clientX
  touchStartY = touch.clientY
}

const handleTouchEnd = (e: TouchEvent): void => {
  if (!props.swipeable || touchStartX === null || touchStartY === null) return

  const touch = e.changedTouches[0]
  if (!touch) return

  const deltaX = touch.clientX - touchStartX
  const deltaY = touch.clientY - touchStartY

  touchStartX = null
  touchStartY = null

  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return

  const tabs = getTabButtons()
  if (tabs.length === 0) return

  const activeIndex = tabs.findIndex((t) => t.dataset['value'] === activeValue.value)
  const baseIndex = activeIndex === -1 ? 0 : activeIndex

  const nextIndex = deltaX < 0 ? baseIndex + 1 : baseIndex - 1
  if (nextIndex < 0 || nextIndex >= tabs.length) return

  const nextTab = tabs[nextIndex]
  if (!nextTab) return

  const value = nextTab.dataset['value']
  if (value !== undefined) select(value)
}

let rafId: ReturnType<typeof requestAnimationFrame> | null = null
let observer: MutationObserver | null = null

const scheduleUpdate = (): void => {
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
    observer.observe(tablist, { childList: true, subtree: true })
  }
  scheduleUpdate()
})

onUnmounted(() => {
  observer?.disconnect()
  if (rafId !== null) cancelAnimationFrame(rafId)
})

watch(activeValue, () => {
  void nextTick(updateIndicator)
})

const buttonStyle = (tab: TabDescriptor): Record<string, string> | undefined => {
  if (props.type !== 'border') return undefined
  const result: Record<string, string> = {}
  const isActive = tab.value === activeValue.value
  if (isActive) {
    if (!props.activeColor) return undefined
    result['backgroundColor'] = props.activeColor
  } else {
    if (!props.inactiveColor) return undefined
    result['backgroundColor'] = props.inactiveColor
  }
  return result
}

const buttonClasses = (tab: TabDescriptor): string[] => {
  const classes: string[] = []
  const isActive = tab.value === activeValue.value
  const disabled = isTabDisabled(tab)

  if (disabled) {
    classes.push('cursor-not-allowed opacity-50')
  }

  if (props.type === 'border') {
    classes.push('rounded-t-sm border border-(--rui-color-tab-border) border-b-0')
    if (isActive) {
      classes.push(
        'relative z-[1] -mb-px border-b-(--rui-color-surface) bg-(--rui-color-surface) text-(--rui-color-tab-text-active)',
      )
    } else {
      classes.push('bg-(--rui-color-tab-hover) text-(--rui-color-tab-text)')
      if (!disabled) classes.push('hover:bg-(--rui-color-surface-hover)')
    }
    return classes
  }

  if (!disabled) classes.push('hover:bg-(--rui-color-tab-hover)')

  if (props.type === 'none') {
    classes.push('text-(--rui-color-tab-text)')
  } else if (isActive) {
    classes.push('text-(--rui-color-tab-text-active)')
  } else {
    classes.push('text-(--rui-color-tab-text)')
  }
  return classes
}

provide(
  TABS_CONTEXT_KEY,
  reactive({
    activeValue,
    get disabled() {
      return props.disabled
    },
    getIds: makeIds,
  }),
)
</script>

<style scoped>
.tabs-no-scrollbar {
  scrollbar-width: none;
}
.tabs-no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
