<template>
  <div ref="rootEl" class="relative inline-flex flex-col gap-0.5" :style="wrapperVars">
    <!-- Trigger -->
    <div
      :id="id"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-haspopup="'listbox'"
      :aria-controls="listboxId"
      :aria-disabled="disabled || undefined"
      :aria-activedescendant="activeDescendantId"
      :aria-label="controlAriaLabel"
      :aria-describedby="errorActive && errorMsg ? errorId : undefined"
      class="inline-flex cursor-pointer items-center justify-between rounded-md border transition-colors"
      :class="[sizeWrapperClasses, wrapperStateClasses]"
      :tabindex="disabled ? -1 : 0"
      @click="!disabled && toggle()"
      @keydown="handleNavKey"
    >
      <!-- searchable: input；否則 span 顯示選中值 -->
      <template v-if="searchable && isOpen">
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          class="min-w-0 flex-1 border-none bg-transparent outline-none placeholder:opacity-50"
          :class="sizeInputClasses"
          :style="color ? { color } : undefined"
          :placeholder="selectedLabel ?? placeholder"
          :aria-label="controlAriaLabel"
          aria-autocomplete="list"
          :aria-controls="listboxId"
          @keydown="handleNavKey"
          @click.stop
        />
      </template>
      <template v-else>
        <span
          class="min-w-0 flex-1 truncate"
          :class="[sizeInputClasses, selectedLabel ? '' : 'text-(--rui-color-text-muted)']"
          :style="color && selectedLabel ? { color } : undefined"
        >
          {{ selectedLabel ?? placeholder }}
        </span>
      </template>

      <!-- Chevron icon -->
      <span
        class="ml-2 flex shrink-0 items-center transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : 'rotate-0'"
        aria-hidden="true"
      >
        <Icon name="chevron-down" :size="16" />
      </span>
    </div>

    <!-- Listbox dropdown -->
    <Teleport :to="teleportTarget" :disabled="!teleport" defer>
      <ul
        v-show="isOpen"
        ref="listboxEl"
        :id="listboxId"
        role="listbox"
        class="max-h-60 overflow-y-auto rounded-md bg-(--select-dropdown-bg) py-1 shadow-md"
        :class="[
          teleport ? '' : 'absolute left-0 top-full mt-1 w-full',
          { 'select-no-scrollbar': !showScrollbar },
        ]"
        :style="listboxStyle"
      >
        <template v-if="!filteredOptions.length">
          <li class="px-3 py-2 text-sm text-(--rui-color-text-muted)" role="presentation">
            無符合選項
          </li>
        </template>
        <template v-else>
          <template v-for="item in filteredOptions" :key="isGroup(item) ? item.group : item.value">
            <!-- Option group -->
            <template v-if="isGroup(item)">
              <li role="presentation">
                <span
                  class="block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-(--rui-color-text-muted)"
                >
                  {{ item.group }}
                </span>
                <ul>
                  <li
                    v-for="opt in item.options"
                    :key="opt.value"
                    :id="`${listboxId}-opt-${opt.value}`"
                    role="option"
                    :aria-selected="opt.value === modelValue"
                    :aria-disabled="opt.disabled || undefined"
                    :data-focused="navigableOptions.indexOf(opt) === focusedIndex"
                    class="cursor-pointer truncate px-3 py-2"
                    :class="getOptionClasses(opt)"
                    @mousedown.prevent
                    @click="!opt.disabled && selectOption(opt)"
                    @mouseenter="!opt.disabled && (focusedIndex = navigableOptions.indexOf(opt))"
                  >
                    {{ opt.label }}
                  </li>
                </ul>
              </li>
            </template>

            <!-- Flat option -->
            <li
              v-else
              :id="`${listboxId}-opt-${item.value}`"
              role="option"
              :aria-selected="item.value === modelValue"
              :aria-disabled="item.disabled || undefined"
              :data-focused="navigableOptions.indexOf(item) === focusedIndex"
              class="cursor-pointer truncate px-3 py-2"
              :class="getOptionClasses(item)"
              @mousedown.prevent
              @click="!item.disabled && selectOption(item)"
              @mouseenter="!item.disabled && (focusedIndex = navigableOptions.indexOf(item))"
            >
              {{ item.label }}
            </li>
          </template>
        </template>
      </ul>
    </Teleport>

    <!-- Error message -->
    <span v-if="errorActive && errorMsg" :id="errorId" class="text-xs text-(--rui-color-error)">
      {{ errorMsg }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, useTemplateRef, watch } from 'vue'
import type { CSSProperties } from 'vue'
import Icon from '../icon/Icon.vue'
import { isGroup } from './types'
import type { SelectExpose, SelectItem, SelectOption, SelectProps } from './types'

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: null,
  options: () => [],
  size: 'md',
  placeholder: '請選擇...',
  searchable: false,
  disabled: false,
  error: false,
  errorMsg: '',
  border: true,
  dropdownBg: undefined,
  optionHoverColor: undefined,
  optionSelectedColor: undefined,
  showScrollbar: false,
  teleport: 'body',
  placement: 'auto',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  change: [value: string | number | null, option: SelectOption | null]
}>()

const rootEl = useTemplateRef<HTMLElement>('rootEl')
const listboxEl = useTemplateRef<HTMLElement>('listboxEl')
const searchInputRef = useTemplateRef<HTMLInputElement>('searchInputRef')
const listboxId = `${useId()}-listbox`
const errorId = `${useId()}-error`

const teleportTarget = computed<string | HTMLElement>(() => {
  const t = props.teleport
  return typeof t === 'string' || t instanceof HTMLElement ? t : 'body'
})

const isOpen = ref(false)
const searchQuery = ref('')
const focusedIndex = ref(-1)

// ── Computed ──────────────────────────────────────────────────────────────────

const errorActive = computed(() => props.error || !!props.errorMsg)

const controlAriaLabel = computed(() => props.placeholder || '請選擇項目')

const selectedLabel = computed(() => {
  for (const item of props.options) {
    if (isGroup(item)) {
      const found = item.options.find((o) => o.value === props.modelValue)
      if (found) return found.label
    } else if (item.value === props.modelValue) {
      return item.label
    }
  }
  return null
})

const filteredOptions = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return props.options

  return props.options.reduce<SelectItem[]>((acc, item) => {
    if (isGroup(item)) {
      const matched = item.options.filter((o) => o.label.toLowerCase().includes(q))
      if (matched.length > 0) acc.push({ group: item.group, options: matched })
    } else if (item.label.toLowerCase().includes(q)) {
      acc.push(item)
    }
    return acc
  }, [])
})

const navigableOptions = computed(() => {
  const result: SelectOption[] = []
  for (const item of filteredOptions.value) {
    if (isGroup(item)) {
      result.push(...item.options.filter((o) => !o.disabled))
    } else if (!item.disabled) {
      result.push(item)
    }
  }
  return result
})

const activeDescendantId = computed(() => {
  if (focusedIndex.value < 0) return undefined
  const opt = navigableOptions.value[focusedIndex.value]
  return opt ? `${listboxId}-opt-${opt.value}` : undefined
})

const wrapperVars = computed(
  (): Record<string, string> => ({
    '--select-active-border': props.borderColor ?? 'var(--rui-color-default)',
    '--select-dropdown-bg': props.dropdownBg ?? 'var(--rui-color-select-bg)',
    '--select-option-hover': props.optionHoverColor ?? 'var(--rui-color-surface-hover)',
    '--select-option-selected': props.optionSelectedColor ?? 'var(--rui-color-select-selected)',
    // 內嵌渲染才需 wrapper 提層；teleport 模式 z-index 套在 listbox 自身
    ...(isOpen.value && !props.teleport ? { 'z-index': 'var(--rui-z-dropdown)' } : {}),
  }),
)

// ── Teleport 浮動定位 ────────────────────────────────────────────────────────
// 下拉清單 teleport 至 body 後不再受 Select 祖先 (Modal panel/body) overflow 限制；
// 改以 fixed 定位、跟隨 trigger rect 重新計算 top/left/width，避免被 Modal 邊界裁切。
const floatingStyle = ref<CSSProperties>({})

function updatePosition() {
  if (!rootEl.value) return
  const r = rootEl.value.getBoundingClientRect()
  const gap = 4
  const dropdownMaxH = 240 // 對應 max-h-60
  const spaceBelow = window.innerHeight - r.bottom
  const flip =
    props.placement === 'top' ||
    (props.placement === 'auto' && spaceBelow < dropdownMaxH && r.top > spaceBelow)
  floatingStyle.value = {
    position: 'fixed',
    left: `${r.left}px`,
    width: `${r.width}px`,
    top: flip ? 'auto' : `${r.bottom + gap}px`,
    bottom: flip ? `${window.innerHeight - r.top + gap}px` : 'auto',
    zIndex: 'var(--rui-z-dropdown)',
  }
}

// teleport 後 listbox 不再繼承 rootEl 的 CSS custom properties，需直接掛在 listbox
const listboxStyle = computed<CSSProperties | undefined>(() => {
  if (!props.teleport) return undefined
  return {
    ...floatingStyle.value,
    '--select-dropdown-bg': props.dropdownBg ?? 'var(--rui-color-select-bg)',
    '--select-option-hover': props.optionHoverColor ?? 'var(--rui-color-surface-hover)',
    '--select-option-selected': props.optionSelectedColor ?? 'var(--rui-color-select-selected)',
  } as CSSProperties
})

let resizeObserver: ResizeObserver | null = null

function attachPositionListeners() {
  window.addEventListener('scroll', updatePosition, { capture: true, passive: true })
  window.addEventListener('resize', updatePosition)
  if (rootEl.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updatePosition)
    resizeObserver.observe(rootEl.value)
  }
}

function detachPositionListeners() {
  window.removeEventListener('scroll', updatePosition, { capture: true } as EventListenerOptions)
  window.removeEventListener('resize', updatePosition)
  resizeObserver?.disconnect()
  resizeObserver = null
}

const sizeWrapperClasses = computed(
  () =>
    ({
      sm: 'h-8 px-2',
      md: 'h-10 px-3',
      lg: 'h-12 px-4',
    })[props.size],
)

const sizeInputClasses = computed(
  () =>
    ({
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    })[props.size],
)

const wrapperStateClasses = computed(() => {
  if (props.disabled) {
    return [
      'cursor-not-allowed',
      'opacity-60',
      'bg-(--rui-color-disabled-bg)',
      props.border ? 'border-(--select-active-border)' : 'border-transparent',
    ]
  }
  if (errorActive.value) {
    return [
      'focus-within:ring-1',
      'focus-within:ring-(--rui-color-error)',
      props.border ? 'border-(--rui-color-error)' : 'border-transparent',
    ]
  }
  if (props.border) {
    return [
      'border-(--select-active-border)',
      'focus-within:ring-1',
      'focus-within:ring-(--select-active-border)',
    ]
  }
  return ['border-transparent']
})

// ── Option class helper ───────────────────────────────────────────────────────

function getOptionClasses(opt: SelectOption): string {
  if (opt.disabled) return 'cursor-not-allowed opacity-40'
  const isFocused = navigableOptions.value.indexOf(opt) === focusedIndex.value
  const isSelected = opt.value === props.modelValue
  if (isSelected) return 'bg-(--select-option-selected) font-medium'
  if (isFocused) return 'bg-(--select-option-hover)'
  return 'hover:bg-(--select-option-hover)'
}

// ── Actions ───────────────────────────────────────────────────────────────────

function toggle() {
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

function openDropdown() {
  isOpen.value = true
  focusedIndex.value = -1
  if (props.teleport) {
    updatePosition()
    attachPositionListeners()
    // 等 Teleport 與 transition 渲染完成後再校正一次，避免初次定位偏差
    nextTick(() => requestAnimationFrame(updatePosition))
  }
  if (props.searchable) {
    nextTick(() => searchInputRef.value?.focus())
  }
}

function closeDropdown() {
  isOpen.value = false
  focusedIndex.value = -1
  searchQuery.value = ''
  detachPositionListeners()
}

function selectOption(opt: SelectOption) {
  emit('update:modelValue', opt.value)
  emit('change', opt.value, opt)
  closeDropdown()
}

// ── Keyboard navigation ───────────────────────────────────────────────────────

function handleNavKey(e: KeyboardEvent) {
  const len = navigableOptions.value.length

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (!isOpen.value) {
      openDropdown()
      return
    }
    focusedIndex.value = focusedIndex.value < len - 1 ? focusedIndex.value + 1 : 0
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (!isOpen.value) {
      openDropdown()
      return
    }
    focusedIndex.value = focusedIndex.value > 0 ? focusedIndex.value - 1 : len - 1
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (!isOpen.value) {
      openDropdown()
      return
    }
    const target = navigableOptions.value[focusedIndex.value]
    if (target) selectOption(target)
  } else if (e.key === 'Escape' || e.key === 'Tab') {
    closeDropdown()
  }
}

// ── Click outside ─────────────────────────────────────────────────────────────

function onOutsideClick(e: MouseEvent) {
  // teleport 後 listbox 不在 rootEl 內，需另外檢查 listboxEl 才不會誤關閉
  const t = e.target as Node
  if (rootEl.value?.contains(t) || listboxEl.value?.contains(t)) return
  closeDropdown()
}

onMounted(() => document.addEventListener('mousedown', onOutsideClick))
onUnmounted(() => {
  document.removeEventListener('mousedown', onOutsideClick)
  detachPositionListeners()
})

// Reset focused index when filtered options change
watch(filteredOptions, () => {
  focusedIndex.value = -1
})

// ── Public API ────────────────────────────────────────────────────────────────

defineExpose<SelectExpose>({
  focus: () => {
    if (props.searchable && isOpen.value) {
      searchInputRef.value?.focus()
    } else {
      rootEl.value?.focus()
    }
  },
})
</script>

<style scoped>
.select-no-scrollbar {
  scrollbar-width: none;
}
.select-no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
