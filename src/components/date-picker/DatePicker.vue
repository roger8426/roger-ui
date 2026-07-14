<template>
  <!-- inline 模式：直接渲染 Calendar，不需 trigger / popover -->
  <div v-if="inline" ref="rootEl" class="inline-flex flex-col gap-0.5" :style="wrapperVars">
    <DatePickerCalendar
      ref="calendarRef"
      v-bind="calendarBindings"
      @update:view-date="viewDate = $event"
      @select="onSelectDate"
      @hover="rangeHover = $event"
      @update:time="onUpdateTime"
      @today-click="onTodayClick"
      @clear-click="onClear"
      @confirm-click="onConfirm"
    />
    <span v-if="errorActive && errorMsg" :id="errorId" class="text-xs text-(--rui-color-error)">
      {{ errorMsg }}
    </span>
  </div>

  <!-- popover 模式 -->
  <div v-else ref="rootEl" class="flex w-full flex-col gap-0.5" :style="wrapperVars">
    <div
      :id="id"
      ref="triggerEl"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-haspopup="'dialog'"
      :aria-controls="panelId"
      :aria-disabled="disabled || undefined"
      :aria-label="controlAriaLabel"
      :aria-describedby="errorActive && errorMsg ? errorId : undefined"
      class="flex w-full cursor-pointer items-center rounded-md border transition-colors"
      :class="[sizeWrapperClasses, wrapperStateClasses]"
      :tabindex="disabled ? -1 : 0"
      @click="!disabled && toggle()"
      @keydown="handleKey"
    >
      <span class="mr-1.5 flex shrink-0 items-center text-(--rui-color-text-muted)">
        <Icon name="calendar" :size="iconSize" />
      </span>

      <input
        ref="inputRef"
        class="min-w-0 flex-1 cursor-pointer border-none bg-transparent outline-none placeholder:opacity-50 disabled:cursor-not-allowed"
        :class="sizeInputClasses"
        :style="color ? { color } : undefined"
        :value="displayText"
        :placeholder="placeholder ?? defaultPlaceholder"
        :disabled="disabled"
        :readonly="!textEditable"
        :aria-label="controlAriaLabel"
        @change="onTextChange"
        @click.stop="onInputClick"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />

      <button
        v-if="clearable && hasValue && !disabled"
        type="button"
        class="ml-1 flex shrink-0 items-center text-(--rui-color-text-muted) hover:text-(--rui-color-text-primary)"
        :aria-label="effectiveLocale.clearLabel"
        @click.stop="onClear"
      >
        <Icon name="close" :size="14" />
      </button>

      <span
        class="ml-1 flex shrink-0 items-center transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : 'rotate-0'"
        aria-hidden="true"
      >
        <Icon name="chevron-down" :size="16" />
      </span>
    </div>

    <Teleport :to="teleportTarget" :disabled="!teleport" defer>
      <div
        v-show="isOpen"
        :id="panelId"
        ref="panelEl"
        role="dialog"
        :aria-label="controlAriaLabel"
        :style="panelStyle"
        class="rounded-md shadow-md"
        :class="teleport ? '' : 'absolute left-0 top-full mt-1'"
      >
        <DatePickerCalendar
          ref="calendarRef"
          v-bind="calendarBindings"
          @update:view-date="viewDate = $event"
          @select="onSelectDate"
          @hover="rangeHover = $event"
          @update:time="onUpdateTime"
          @today-click="onTodayClick"
          @clear-click="onClear"
          @confirm-click="onConfirm"
        />
      </div>
    </Teleport>

    <span v-if="errorActive && errorMsg" :id="errorId" class="text-xs text-(--rui-color-error)">
      {{ errorMsg }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, useTemplateRef, watch } from 'vue'
import type { CSSProperties } from 'vue'
import Icon from '../icon/Icon.vue'
import DatePickerCalendar from './DatePickerCalendar.vue'
import {
  DEFAULT_LOCALE_ZH_TW,
  type DatePickerExpose,
  type DatePickerModelValue,
  type DatePickerProps,
  type DateRange,
} from './types'
import {
  clamp,
  compareDate,
  defaultFormat,
  formatDate,
  isDisabled,
  isSameDay,
  parseDate,
  startOfDay,
} from './utils'

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: undefined,
  mode: 'single',
  size: 'md',
  placeholder: undefined,
  disabled: false,
  readonly: false,
  error: false,
  errorMsg: '',
  border: true,
  borderColor: undefined,
  color: undefined,
  format: undefined,
  minDate: undefined,
  maxDate: undefined,
  disabledDate: undefined,
  firstDayOfWeek: 1,
  locale: undefined,
  clearable: true,
  minuteStep: 1,
  inline: false,
  teleport: 'body',
  placement: 'auto',
})

const emit = defineEmits<{
  'update:modelValue': [value: DatePickerModelValue]
  change: [value: DatePickerModelValue]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  'panel-open': []
  'panel-close': []
}>()

interface CalendarInstance {
  focusInitial: () => void
}

const rootEl = useTemplateRef<HTMLElement>('rootEl')
const triggerEl = useTemplateRef<HTMLElement>('triggerEl')
const panelEl = useTemplateRef<HTMLElement>('panelEl')
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const calendarRef = useTemplateRef<CalendarInstance>('calendarRef')
const panelId = `${useId()}-panel`
const errorId = `${useId()}-error`

const effectiveLocale = computed(() => props.locale ?? DEFAULT_LOCALE_ZH_TW)
const effectiveFormat = computed(() => props.format ?? defaultFormat(props.mode))
const errorActive = computed(() => props.error || !!props.errorMsg)
const needsConfirm = computed(() => props.mode === 'range' || props.mode === 'datetime')
// popover 模式永遠顯示 footer：至少給「今天」按鈕入口；clear / confirm 視情況顯示
const showFooter = computed(() => !props.inline)

const defaultPlaceholder = computed(() => {
  switch (props.mode) {
    case 'range':
      return '請選擇日期區間'
    case 'multiple':
      return '請選擇日期（可多選）'
    case 'datetime':
      return '請選擇日期與時間'
    default:
      return '請選擇日期'
  }
})

const controlAriaLabel = computed(() => props.placeholder ?? defaultPlaceholder.value)

// ── 模型值正規化 ──────────────────────────────────────────────────────────────

function normalizedSingle(): Date | null {
  const v = props.modelValue
  return v instanceof Date ? v : null
}
function normalizedRange(): DateRange {
  const v = props.modelValue
  if (
    Array.isArray(v) &&
    v.length === 2 &&
    (v[0] === null || v[0] instanceof Date) &&
    (v[1] === null || v[1] instanceof Date)
  ) {
    return v as DateRange
  }
  return [null, null]
}
function normalizedMultiple(): Date[] {
  const v = props.modelValue
  return Array.isArray(v) ? (v.filter((x) => x instanceof Date) as Date[]) : []
}

const hasValue = computed(() => {
  if (props.mode === 'single' || props.mode === 'datetime') return normalizedSingle() !== null
  if (props.mode === 'range') {
    const r = normalizedRange()
    return r[0] !== null || r[1] !== null
  }
  return normalizedMultiple().length > 0
})

// ── view 與 pending 狀態 ──────────────────────────────────────────────────────

function initialViewDate(): Date {
  if (props.mode === 'single' || props.mode === 'datetime') {
    return normalizedSingle() ?? new Date()
  }
  if (props.mode === 'range') {
    return normalizedRange()[0] ?? new Date()
  }
  const arr = normalizedMultiple()
  return arr[0] ?? new Date()
}

const viewDate = ref<Date>(initialViewDate())
const rangeHover = ref<Date | null>(null)

/** range / datetime 的暫定值，按下「確定」才 emit */
const pendingRange = ref<DateRange>(normalizedRange())
const pendingDateTime = ref<Date | null>(normalizedSingle())

/** 傳給 Calendar 顯示用的當前選擇 */
const calendarSelected = computed<DatePickerModelValue>(() => {
  if (props.mode === 'single') return normalizedSingle()
  if (props.mode === 'datetime') return pendingDateTime.value
  if (props.mode === 'range') return pendingRange.value
  return normalizedMultiple()
})

const canConfirm = computed(() => {
  if (props.mode === 'datetime') return pendingDateTime.value !== null
  if (props.mode === 'range') {
    const [s, e] = pendingRange.value
    return s !== null && e !== null
  }
  return true
})

const calendarBindings = computed(() => ({
  mode: props.mode,
  viewDate: viewDate.value,
  selected: calendarSelected.value,
  rangeHover: rangeHover.value,
  minDate: props.minDate,
  maxDate: props.maxDate,
  disabledDate: props.disabledDate,
  firstDayOfWeek: props.firstDayOfWeek,
  locale: effectiveLocale.value,
  minuteStep: props.minuteStep,
  showFooter: showFooter.value,
  showClear: props.clearable && hasValue.value,
  showConfirm: needsConfirm.value,
  confirmDisabled: !canConfirm.value,
}))

// ── 顯示文字 ────────────────────────────────────────────────────────────────

const displayText = computed(() => {
  const fmt = effectiveFormat.value
  if (props.mode === 'single' || props.mode === 'datetime') {
    const v = normalizedSingle()
    return v ? formatDate(v, fmt) : ''
  }
  if (props.mode === 'range') {
    const [s, e] = normalizedRange()
    if (s && e) return `${formatDate(s, fmt)} ~ ${formatDate(e, fmt)}`
    if (s && !e) return `${formatDate(s, fmt)} ~`
    return ''
  }
  // multiple
  const arr = normalizedMultiple()
  if (arr.length === 0) return ''
  if (arr.length <= 3) return arr.map((d) => formatDate(d, fmt)).join(', ')
  return `已選 ${arr.length} 個`
})

const textEditable = computed(() => !props.disabled && !props.readonly && props.mode === 'single')

// ── 開關面板 ───────────────────────────────────────────────────────────────

const isOpen = ref(false)

function syncPendingFromModel() {
  pendingRange.value = normalizedRange()
  pendingDateTime.value = normalizedSingle()
}

function open() {
  if (props.disabled || isOpen.value) return
  syncPendingFromModel()
  viewDate.value = initialViewDate()
  rangeHover.value = null
  isOpen.value = true
  if (props.teleport) {
    updatePosition()
    attachPositionListeners()
    nextTick(() => requestAnimationFrame(updatePosition))
  }
  document.addEventListener('keydown', onDocKeydown)
  // 等 Teleport defer 完成 + panel 顯示後再聚焦到 day grid
  nextTick(() => requestAnimationFrame(() => calendarRef.value?.focusInitial()))
  emit('panel-open')
}

/**
 * @param restoreFocus 是否將焦點還原到 trigger。
 * - 透過 Esc / 選日期 / 確認 / 清除 觸發 close 時為 true
 * - 透過點擊外部觸發時為 false（user 已主動把焦點移走）
 */
function close(restoreFocus = true) {
  if (!isOpen.value) return
  isOpen.value = false
  rangeHover.value = null
  detachPositionListeners()
  document.removeEventListener('keydown', onDocKeydown)
  if (restoreFocus) nextTick(() => triggerEl.value?.focus())
  emit('panel-close')
}

function toggle() {
  if (isOpen.value) close()
  else open()
}

function onDocKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    e.preventDefault()
    close()
  }
}

function onInputClick() {
  if (!isOpen.value) open()
}

// ── Teleport 浮動定位（沿用 Select 的策略） ──────────────────────────────────

const floatingStyle = ref<CSSProperties>({})

function updatePosition() {
  if (!rootEl.value || !props.teleport) return
  const r = rootEl.value.getBoundingClientRect()
  const gap = 4
  const panelMaxH = props.mode === 'datetime' ? 380 : 320
  const spaceBelow = window.innerHeight - r.bottom
  const flip =
    props.placement === 'top' ||
    (props.placement === 'auto' && spaceBelow < panelMaxH && r.top > spaceBelow)
  floatingStyle.value = {
    position: 'fixed',
    left: `${r.left}px`,
    top: flip ? 'auto' : `${r.bottom + gap}px`,
    bottom: flip ? `${window.innerHeight - r.top + gap}px` : 'auto',
    zIndex: 'var(--rui-z-dropdown)',
  }
}

const panelStyle = computed<CSSProperties | undefined>(() => {
  if (!props.teleport) return undefined
  return floatingStyle.value
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

// ── 樣式 (對齊 Input / Select) ───────────────────────────────────────────────

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

const iconSize = computed(() => (props.size === 'sm' ? 14 : props.size === 'lg' ? 18 : 16))

const wrapperStateClasses = computed(() => {
  if (props.disabled) {
    return [
      'cursor-not-allowed opacity-60 bg-(--rui-color-disabled-bg)',
      props.border ? 'border-(--datepicker-active-border)' : 'border-transparent',
    ]
  }
  if (errorActive.value) {
    return [
      'focus-within:ring-1 focus-within:ring-(--rui-color-error)',
      props.border ? 'border-(--rui-color-error)' : 'border-transparent',
    ]
  }
  if (props.readonly) {
    return [
      'bg-(--rui-color-disabled-bg)',
      props.border ? 'border-(--datepicker-active-border)' : 'border-transparent',
    ]
  }
  if (props.border) {
    return [
      'border-(--datepicker-active-border)',
      'focus-within:ring-1 focus-within:ring-(--datepicker-active-border)',
    ]
  }
  return ['border-transparent']
})

const wrapperVars = computed<Record<string, string>>(() => ({
  '--datepicker-active-border': props.borderColor ?? 'var(--rui-color-default)',
}))

const teleportTarget = computed<string | HTMLElement>(() => {
  const t = props.teleport
  return typeof t === 'string' || t instanceof HTMLElement ? t : 'body'
})

// ── 動作 ─────────────────────────────────────────────────────────────────────

function emitValue(v: DatePickerModelValue) {
  emit('update:modelValue', v)
  emit('change', v)
}

function onSelectDate(date: Date) {
  if (isDisabled(date, props.minDate, props.maxDate, props.disabledDate)) return

  if (props.mode === 'single') {
    emitValue(clamp(startOfDay(date), props.minDate, props.maxDate))
    close()
    return
  }

  if (props.mode === 'multiple') {
    const arr = normalizedMultiple()
    const idx = arr.findIndex((d) => isSameDay(d, date))
    const next =
      idx >= 0
        ? arr.filter((_, i) => i !== idx)
        : [...arr, clamp(startOfDay(date), props.minDate, props.maxDate)]
    emitValue(next)
    return
  }

  if (props.mode === 'range') {
    const [start, end] = pendingRange.value
    // 三種情境：
    // 1. 尚未選 start，或已完成 [start, end] → 視為新一輪起點
    // 2. 已選 start、未選 end → 若新日期 < start，視為重選 start（取代）；
    //    否則作為 end，組成 [start, date]
    if (!start || (start && end)) {
      pendingRange.value = [startOfDay(date), null]
    } else if (compareDate(date, start) < 0) {
      pendingRange.value = [startOfDay(date), null]
    } else {
      pendingRange.value = [start, startOfDay(date)]
    }
    return
  }

  // datetime: 套用日期、保留時間
  const base = pendingDateTime.value ?? new Date()
  const next = new Date(base)
  next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
  pendingDateTime.value = next
}

function onUpdateTime(d: Date) {
  if (props.mode !== 'datetime') return
  pendingDateTime.value = d
}

function onTodayClick() {
  const today = new Date()
  if (isDisabled(today, props.minDate, props.maxDate, props.disabledDate)) return
  onSelectDate(today)
}

function onClear() {
  if (props.mode === 'single' || props.mode === 'datetime') {
    pendingDateTime.value = null
    emitValue(null)
  } else if (props.mode === 'range') {
    pendingRange.value = [null, null]
    emitValue([null, null])
  } else {
    emitValue([])
  }
  if (props.mode !== 'multiple') close()
}

function onConfirm() {
  if (!canConfirm.value) return
  if (props.mode === 'datetime' && pendingDateTime.value) {
    emitValue(pendingDateTime.value)
  } else if (props.mode === 'range') {
    emitValue(pendingRange.value)
  }
  close()
}

// ── 文字輸入（僅 single 模式） ───────────────────────────────────────────────

// 等 @change（blur）才嘗試解析，避免使用者打字途中被改寫
function onTextChange(e: Event) {
  if (!textEditable.value) return
  const target = e.target as HTMLInputElement
  const raw = target.value.trim()
  if (raw === '') {
    emitValue(null)
    return
  }
  const parsed = parseDate(raw, effectiveFormat.value)
  if (!parsed) {
    target.value = displayText.value
    return
  }
  if (isDisabled(parsed, props.minDate, props.maxDate, props.disabledDate)) {
    target.value = displayText.value
    return
  }
  emitValue(clamp(startOfDay(parsed), props.minDate, props.maxDate))
}

// ── 鍵盤 ────────────────────────────────────────────────────────────────────

function handleKey(e: KeyboardEvent) {
  // Esc 由 document 級 onDocKeydown 處理（不論焦點在 trigger 或面板內）
  if (isOpen.value) return
  // Enter 一律開啟；Space 在可輸入文字模式下保留為輸入字元，不攔截
  if (e.key === 'Enter' || (e.key === ' ' && !textEditable.value)) {
    e.preventDefault()
    open()
  }
}

// ── 點擊外部關閉 ─────────────────────────────────────────────────────────────

function onOutsideClick(e: MouseEvent) {
  if (props.inline) return
  const t = e.target as Node
  if (rootEl.value?.contains(t) || panelEl.value?.contains(t)) return
  // 點擊外部：user 已自行轉移焦點，不要再搶回 trigger
  close(false)
}

onMounted(() => {
  if (!props.inline) document.addEventListener('mousedown', onOutsideClick)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', onOutsideClick)
  document.removeEventListener('keydown', onDocKeydown)
  detachPositionListeners()
})

watch(
  () => props.modelValue,
  () => {
    if (!isOpen.value) syncPendingFromModel()
  },
  { deep: true },
)

// ── Public API ──────────────────────────────────────────────────────────────

defineExpose<DatePickerExpose>({
  focus: () => {
    if (props.inline) {
      rootEl.value?.focus()
    } else {
      triggerEl.value?.focus()
    }
  },
  open,
  close,
})
</script>
