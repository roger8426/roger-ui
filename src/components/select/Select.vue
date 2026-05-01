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
      <!-- 多選：chips 區塊 + 可選 search input -->
      <template v-if="multiple">
        <!-- multiple + searchable：簡化為 +N 指示 + 搜尋輸入，避免 chips 干擾輸入焦點 -->
        <template v-if="searchable">
          <div class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
            <span
              v-if="selectedOptions.length > 0"
              class="inline-flex shrink-0 items-center rounded-sm bg-(--select-option-hover) px-1.5 py-0.5 text-sm"
              :style="color ? { color } : undefined"
              :aria-label="`已選 ${selectedOptions.length} 項`"
            >
              +{{ selectedOptions.length }}
            </span>
            <input
              v-if="isOpen"
              ref="searchInputRef"
              v-model="searchQuery"
              class="min-w-10 flex-1 border-none bg-transparent outline-none placeholder:opacity-50"
              :class="sizeInputClasses"
              :style="color ? { color } : undefined"
              :placeholder="selectedOptions.length === 0 ? placeholder : ''"
              :aria-label="controlAriaLabel"
              aria-autocomplete="list"
              :aria-controls="listboxId"
              @keydown="handleNavKey"
              @click.stop
            />
            <span
              v-else-if="selectedOptions.length === 0"
              class="truncate text-(--rui-color-text-muted)"
              :class="sizeInputClasses"
            >
              {{ placeholder }}
            </span>
          </div>
        </template>

        <!-- multiple 不搭 searchable：依 multipleDisplay 渲染 chips/count/comma -->
        <template v-else>
          <div
            ref="chipsContainerEl"
            class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden"
          >
            <template v-if="selectedOptions.length === 0">
              <span class="truncate text-(--rui-color-text-muted)" :class="sizeInputClasses">
                {{ placeholder }}
              </span>
            </template>

            <!-- chips 顯示模式 -->
            <template v-if="multipleDisplay === 'chips'">
              <span
                v-for="(opt, i) in selectedOptions"
                :key="opt.value"
                data-chip
                :hidden="visibleChipCount !== null && i >= visibleChipCount"
                class="inline-flex shrink-0 items-center gap-1 rounded-sm bg-(--select-option-hover) px-1.5 py-0.5 text-sm"
                :style="color ? { color } : undefined"
              >
                <span class="truncate">{{ opt.label }}</span>
                <button
                  v-if="!disabled"
                  type="button"
                  class="inline-flex shrink-0 items-center opacity-60 hover:opacity-100"
                  :aria-label="`移除 ${opt.label}`"
                  @click.stop="removeValue(opt.value)"
                  @mousedown.stop.prevent
                >
                  <Icon name="close" :size="12" />
                </button>
              </span>
              <span
                v-if="hiddenChipCount > 0"
                data-chip-overflow
                class="inline-flex shrink-0 items-center rounded-sm bg-(--select-option-hover) px-1.5 py-0.5 text-sm"
                :style="color ? { color } : undefined"
              >
                +{{ hiddenChipCount }}
              </span>
            </template>

            <!-- count 模式 -->
            <template v-else-if="multipleDisplay === 'count' && selectedOptions.length > 0">
              <span
                class="truncate"
                :class="sizeInputClasses"
                :style="color ? { color } : undefined"
              >
                已選 {{ selectedOptions.length }} 項
              </span>
            </template>

            <!-- comma 模式 -->
            <template v-else-if="multipleDisplay === 'comma' && selectedOptions.length > 0">
              <span
                class="truncate"
                :class="sizeInputClasses"
                :style="color ? { color } : undefined"
              >
                {{ selectedOptions.map((o) => o.label).join(', ') }}
              </span>
            </template>
          </div>
        </template>
      </template>

      <!-- 單選：原行為 -->
      <template v-else>
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
      </template>

      <!-- Clear-all 按鈕（多選且已選 ≥ 1 時顯示） -->
      <button
        v-if="multiple && !disabled && selectedOptions.length > 0"
        type="button"
        class="ml-2 inline-flex shrink-0 items-center opacity-60 hover:opacity-100"
        aria-label="清除全部"
        @click.stop="clearAll"
        @mousedown.stop.prevent
      >
        <Icon name="close" :size="14" />
      </button>

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
        :id="listboxId"
        ref="listboxEl"
        role="listbox"
        :aria-multiselectable="multiple || undefined"
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
                    :id="`${listboxId}-opt-${opt.value}`"
                    :key="opt.value"
                    role="option"
                    :aria-selected="isOptionSelected(opt)"
                    :aria-disabled="isOptionBlocked(opt) || undefined"
                    :data-focused="navigableOptions.indexOf(opt) === focusedIndex"
                    class="flex cursor-pointer items-center gap-2 truncate px-3 py-2"
                    :class="getOptionClasses(opt)"
                    :style="color ? { color } : undefined"
                    @mousedown.prevent
                    @click="!isOptionBlocked(opt) && selectOption(opt)"
                    @mouseenter="
                      !isOptionBlocked(opt) && (focusedIndex = navigableOptions.indexOf(opt))
                    "
                  >
                    <span
                      v-if="multiple"
                      class="inline-flex w-4 shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <Icon v-if="isOptionSelected(opt)" name="check" :size="14" />
                    </span>
                    <span class="truncate">{{ opt.label }}</span>
                  </li>
                </ul>
              </li>
            </template>

            <!-- Flat option -->
            <li
              v-else
              :id="`${listboxId}-opt-${item.value}`"
              role="option"
              :aria-selected="isOptionSelected(item)"
              :aria-disabled="isOptionBlocked(item) || undefined"
              :data-focused="navigableOptions.indexOf(item) === focusedIndex"
              class="flex cursor-pointer items-center gap-2 truncate px-3 py-2"
              :class="getOptionClasses(item)"
              :style="color ? { color } : undefined"
              @mousedown.prevent
              @click="!isOptionBlocked(item) && selectOption(item)"
              @mouseenter="
                !isOptionBlocked(item) && (focusedIndex = navigableOptions.indexOf(item))
              "
            >
              <span
                v-if="multiple"
                class="inline-flex w-4 shrink-0 items-center justify-center"
                aria-hidden="true"
              >
                <Icon v-if="isOptionSelected(item)" name="check" :size="14" />
              </span>
              <span class="truncate">{{ item.label }}</span>
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
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useId,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue'
import type { CSSProperties } from 'vue'
import Icon from '../icon/Icon.vue'
import { isGroup } from './types'
import type {
  SelectExpose,
  SelectItem,
  SelectModelValue,
  SelectOption,
  SelectProps,
  SelectValue,
} from './types'

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
  multiple: false,
  maxSelected: undefined,
  multipleDisplay: 'chips',
})

const emit = defineEmits<{
  'update:modelValue': [value: SelectModelValue]
  change: [value: SelectModelValue, option: SelectOption | SelectOption[] | null]
}>()

const rootEl = useTemplateRef<HTMLElement>('rootEl')
const listboxEl = useTemplateRef<HTMLElement>('listboxEl')
const searchInputRef = useTemplateRef<HTMLInputElement>('searchInputRef')
const chipsContainerEl = useTemplateRef<HTMLElement>('chipsContainerEl')
const listboxId = `${useId()}-listbox`
const errorId = `${useId()}-error`

const teleportTarget = computed<string | HTMLElement>(() => {
  const t = props.teleport
  return typeof t === 'string' || t instanceof HTMLElement ? t : 'body'
})

const isOpen = ref(false)
const searchQuery = ref('')
const focusedIndex = ref(-1)
const visibleChipCount = ref<number | null>(null)

// ── Computed ──────────────────────────────────────────────────────────────────

const errorActive = computed(() => props.error || !!props.errorMsg)

const controlAriaLabel = computed(() => props.placeholder || '請選擇項目')

/** 將 modelValue 標準化為陣列形式，方便統一處理 */
const selectedValues = computed<SelectValue[]>(() => {
  const v = props.modelValue
  if (props.multiple) return Array.isArray(v) ? [...v] : []
  if (v == null || Array.isArray(v)) return []
  return [v]
})

/** 把所有 options（含 group 內）攤平成單層，便於 value → option 反查 */
const flatOptions = computed<SelectOption[]>(() => {
  const result: SelectOption[] = []
  for (const item of props.options) {
    if (isGroup(item)) result.push(...item.options)
    else result.push(item)
  }
  return result
})

/** 已選 value 的 Set，供 isOptionSelected O(1) 查找避免渲染時 O(N²) */
const selectedValueSet = computed(() => new Set<SelectValue>(selectedValues.value))

/** 已選中的 option 物件清單（多選用；找不到對應 option 時回退為純值的 placeholder option） */
const selectedOptions = computed<SelectOption[]>(() => {
  if (!props.multiple) return []
  const map = new Map(flatOptions.value.map((o) => [o.value, o]))
  return selectedValues.value.map((v) => map.get(v) ?? { value: v, label: String(v) })
})

const selectedLabel = computed(() => {
  if (props.multiple) return null
  const v = props.modelValue
  if (v == null || Array.isArray(v)) return null
  for (const item of props.options) {
    if (isGroup(item)) {
      const found = item.options.find((o) => o.value === v)
      if (found) return found.label
    } else if (item.value === v) {
      return item.label
    }
  }
  return null
})

const isMaxedOut = computed(() => {
  if (!props.multiple || props.maxSelected == null) return false
  return selectedValues.value.length >= props.maxSelected
})

function isOptionSelected(opt: SelectOption): boolean {
  return selectedValueSet.value.has(opt.value)
}

function isOptionBlocked(opt: SelectOption): boolean {
  if (opt.disabled) return true
  if (props.multiple && isMaxedOut.value && !isOptionSelected(opt)) return true
  return false
}

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
      result.push(...item.options.filter((o) => !isOptionBlocked(o)))
    } else if (!isOptionBlocked(item)) {
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

const hiddenChipCount = computed(() => {
  if (props.multipleDisplay !== 'chips') return 0
  if (visibleChipCount.value === null) return 0
  return Math.max(0, selectedOptions.value.length - visibleChipCount.value)
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
  if (isOptionBlocked(opt)) return 'cursor-not-allowed opacity-40'
  const isFocused = navigableOptions.value.indexOf(opt) === focusedIndex.value
  const selected = isOptionSelected(opt)
  if (selected && !props.multiple) return 'bg-(--select-option-selected) font-medium'
  if (selected && props.multiple) {
    return isFocused
      ? 'bg-(--select-option-hover) font-medium'
      : 'bg-(--select-option-selected) font-medium'
  }
  if (isFocused) return 'bg-(--select-option-hover)'
  return 'hover:bg-(--select-option-hover)'
}

// ── Chips 截斷量測 ─────────────────────────────────────────────────────────────
// 多選 + chips 模式下 trigger 高度固定，超出寬度的 chip 用 +N 取代。
// 演算法：先讓所有 chip 顯示、隱藏 +N，量測各 chip 的 offsetLeft+offsetWidth；
// 若全部都放得下則直接顯示；放不下時保留 +N 的寬度再重新計算可顯示數量。
function measureChips() {
  if (!props.multiple || props.searchable || props.multipleDisplay !== 'chips') {
    visibleChipCount.value = null
    return
  }
  const container = chipsContainerEl.value
  if (!container) return

  const chipEls = Array.from(container.querySelectorAll<HTMLElement>('[data-chip]'))
  if (chipEls.length === 0) {
    visibleChipCount.value = 0
    return
  }

  // 先讓所有 chip 可見以利量測；下一個 tick offsetLeft/offsetWidth 才會反映實際版面
  visibleChipCount.value = chipEls.length

  nextTick(() => {
    const overflowEl = container.querySelector<HTMLElement>('[data-chip-overflow]')
    const containerWidth = container.clientWidth

    let baseCount = 0
    for (const c of chipEls) {
      if (c.offsetLeft + c.offsetWidth <= containerWidth) baseCount++
      else break
    }

    if (baseCount === chipEls.length) {
      visibleChipCount.value = chipEls.length
      return
    }

    // 預留 +N chip 寬度（offsetWidth 含 padding；4px = container gap）
    const overflowWidth = overflowEl?.offsetWidth ?? 36
    const reserve = containerWidth - overflowWidth - 4
    let count = 0
    for (const c of chipEls) {
      if (c.offsetLeft + c.offsetWidth <= reserve) count++
      else break
    }
    visibleChipCount.value = Math.max(1, count)
  })
}

let chipsResizeObserver: ResizeObserver | null = null

function detachChipsObserver() {
  chipsResizeObserver?.disconnect()
  chipsResizeObserver = null
}

// 響應式 attach/detach：multiple/searchable/multipleDisplay 切換時 chipsContainerEl 會被
// v-if 重新掛載/卸載，必須跟著 prop 變化重新觀察，否則切回 chips 模式時無 ResizeObserver。
watchEffect(() => {
  detachChipsObserver()
  const enabled = props.multiple && !props.searchable && props.multipleDisplay === 'chips'
  if (!enabled) return
  const el = chipsContainerEl.value
  if (!el || typeof ResizeObserver === 'undefined') return
  chipsResizeObserver = new ResizeObserver(() => measureChips())
  chipsResizeObserver.observe(el)
})

watch(
  () => [selectedValues.value.length, props.multipleDisplay, props.multiple] as const,
  () => nextTick(measureChips),
  { flush: 'post' },
)

// ── Actions ───────────────────────────────────────────────────────────────────

function toggle() {
  if (isOpen.value) closeDropdown()
  else openDropdown()
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

function emitChange(next: SelectModelValue) {
  emit('update:modelValue', next)
  if (props.multiple) {
    const arr = (next as SelectValue[]) ?? []
    const opts = arr
      .map((v) => flatOptions.value.find((o) => o.value === v))
      .filter((o): o is SelectOption => o != null)
    emit('change', next, opts)
  } else {
    const v = next as SelectValue | null
    const opt = v == null ? null : (flatOptions.value.find((o) => o.value === v) ?? null)
    emit('change', next, opt)
  }
}

function selectOption(opt: SelectOption) {
  if (isOptionBlocked(opt)) return
  if (props.multiple) {
    const current = selectedValues.value
    const next = current.includes(opt.value)
      ? current.filter((v) => v !== opt.value)
      : [...current, opt.value]
    emitChange(next)
    if (props.searchable) {
      nextTick(() => searchInputRef.value?.focus())
    }
  } else {
    emitChange(opt.value)
    closeDropdown()
  }
}

function removeValue(value: SelectValue) {
  if (props.disabled || !props.multiple) return
  const next = selectedValues.value.filter((v) => v !== value)
  emitChange(next)
}

function clearAll() {
  if (props.disabled) return
  if (props.multiple) emitChange([])
  else emitChange(null)
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
  } else if (e.key === 'Enter' || (e.key === ' ' && props.multiple)) {
    // 多選下 Space 也視為 toggle，符合 ARIA listbox 慣例
    // 單選下 Space 若 input 內輸入空白應交給 input 處理；只有非 searchable 時才接管
    if (e.key === ' ' && props.searchable && isOpen.value) return
    e.preventDefault()
    if (!isOpen.value) {
      openDropdown()
      return
    }
    const target = navigableOptions.value[focusedIndex.value]
    if (target) selectOption(target)
  } else if (e.key === 'Escape') {
    closeDropdown()
  } else if (e.key === 'Tab') {
    closeDropdown()
  } else if (
    e.key === 'Backspace' &&
    props.multiple &&
    props.searchable &&
    isOpen.value &&
    searchQuery.value === '' &&
    selectedValues.value.length > 0
  ) {
    // 搜尋框為空時 Backspace 移除最後一個 chip（常見 UX）
    e.preventDefault()
    const last = selectedValues.value[selectedValues.value.length - 1]
    if (last !== undefined) removeValue(last)
  }
}

// ── Click outside ─────────────────────────────────────────────────────────────

function onOutsideClick(e: MouseEvent) {
  // teleport 後 listbox 不在 rootEl 內，需另外檢查 listboxEl 才不會誤關閉
  const t = e.target as Node
  if (rootEl.value?.contains(t) || listboxEl.value?.contains(t)) return
  closeDropdown()
}

onMounted(() => {
  document.addEventListener('mousedown', onOutsideClick)
  // ResizeObserver 由上方 watchEffect 在 chipsContainerEl ref 解析後負責掛上；
  // 此處只需觸發初次 measure，把 visibleChipCount 從 null 算到實際值
  nextTick(measureChips)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onOutsideClick)
  detachPositionListeners()
  detachChipsObserver()
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
