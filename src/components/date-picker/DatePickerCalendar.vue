<template>
  <div
    class="select-none rounded-md bg-(--rui-color-surface-raised) p-2 text-(--rui-color-text-primary)"
    :style="cssVars"
    @mouseleave="emit('hover', null)"
  >
    <!-- Header -->
    <div class="mb-2 flex items-center justify-between gap-1">
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="rui-cal-nav"
          :aria-label="`上一年 ${viewYear - 1}`"
          @click="shiftYear(-1)"
        >
          <Icon name="chevrons-left" :size="16" />
        </button>
        <button type="button" class="rui-cal-nav" :aria-label="`上個月`" @click="shiftMonth(-1)">
          <Icon name="chevron-left" :size="16" />
        </button>
      </div>
      <div class="text-sm font-medium" aria-live="polite">
        {{ viewYear }} {{ locale.months[viewMonth] }}
      </div>
      <div class="flex items-center gap-1">
        <button type="button" class="rui-cal-nav" :aria-label="`下個月`" @click="shiftMonth(1)">
          <Icon name="chevron-right" :size="16" />
        </button>
        <button
          type="button"
          class="rui-cal-nav"
          :aria-label="`下一年 ${viewYear + 1}`"
          @click="shiftYear(1)"
        >
          <Icon name="chevrons-right" :size="16" />
        </button>
      </div>
    </div>

    <!-- Weekdays -->
    <div class="mb-1 grid grid-cols-7 text-center text-xs text-(--rui-color-text-muted)">
      <div v-for="w in weekdayLabels" :key="w" class="py-1">{{ w }}</div>
    </div>

    <!-- Day grid -->
    <div ref="gridEl" role="grid" class="grid grid-cols-7 gap-0.5" @keydown="handleGridKey">
      <div v-for="(week, wi) in cellRows" :key="wi" role="row" class="contents">
        <button
          v-for="cell in week"
          :key="cell.key"
          type="button"
          role="gridcell"
          :data-rui-date="cell.key"
          :aria-selected="cell.selected || undefined"
          :aria-disabled="cell.disabled || undefined"
          :tabindex="cell.isFocused ? 0 : -1"
          :class="cell.classes"
          @click="onCellClick(cell)"
          @mouseenter="onCellHover(cell)"
        >
          {{ cell.date.getDate() }}
        </button>
      </div>
    </div>

    <!-- Time strip (datetime mode) -->
    <div
      v-if="mode === 'datetime'"
      class="mt-2 flex items-center justify-center gap-1 border-t border-(--rui-color-border) pt-2 text-sm"
    >
      <select
        :value="hourValue"
        class="rui-cal-time-select"
        :aria-label="'時'"
        @change="onTimeChange('hour', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="h in hourOptions" :key="h" :value="h">{{ pad2(h) }}</option>
      </select>
      <span>:</span>
      <select
        :value="minuteValue"
        class="rui-cal-time-select"
        :aria-label="'分'"
        @change="onTimeChange('minute', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="m in minuteOptions" :key="m" :value="m">{{ pad2(m) }}</option>
      </select>
    </div>

    <!-- Footer -->
    <div
      v-if="showFooter"
      class="mt-2 flex items-center justify-between gap-2 border-t border-(--rui-color-border) pt-2 text-sm"
    >
      <button
        type="button"
        class="rui-cal-action"
        :disabled="todayDisabled"
        @click="emit('today-click')"
      >
        {{ locale.todayLabel }}
      </button>
      <div class="flex items-center gap-2">
        <button v-if="showClear" type="button" class="rui-cal-action" @click="emit('clear-click')">
          {{ locale.clearLabel }}
        </button>
        <button
          v-if="showConfirm"
          type="button"
          class="rui-cal-action rui-cal-action-primary"
          :disabled="confirmDisabled"
          @click="emit('confirm-click')"
        >
          {{ locale.confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import type { CSSProperties } from 'vue'
import Icon from '../icon/Icon.vue'
import type { DatePickerLocale, DatePickerMode, DateRange } from './types'
import {
  addDays,
  addMonths,
  addYears,
  compareDate,
  getCalendarMatrix,
  isDisabled,
  isInRange,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from './utils'

interface CalendarProps {
  mode: DatePickerMode
  viewDate: Date
  selected: Date | null | DateRange | Date[]
  /** range 模式下，hover 中的暫定終點 */
  rangeHover?: Date | null
  minDate?: Date
  maxDate?: Date
  disabledDate?: (d: Date) => boolean
  firstDayOfWeek: 0 | 1
  locale: DatePickerLocale
  minuteStep: number
  /** 是否顯示底部 footer（today / clear / confirm） */
  showFooter?: boolean
  /** 是否顯示「清除」按鈕 */
  showClear?: boolean
  /** 是否顯示「確定」按鈕（range / datetime 模式時為 true） */
  showConfirm?: boolean
  /** 確認按鈕是否停用（例：range 尚未選齊兩端） */
  confirmDisabled?: boolean
}

const props = withDefaults(defineProps<CalendarProps>(), {
  rangeHover: null,
  minDate: undefined,
  maxDate: undefined,
  disabledDate: undefined,
  showFooter: false,
  showClear: false,
  showConfirm: false,
  confirmDisabled: false,
})

const emit = defineEmits<{
  'update:viewDate': [date: Date]
  select: [date: Date]
  hover: [date: Date | null]
  'update:time': [date: Date]
  'today-click': []
  'clear-click': []
  'confirm-click': []
}>()

const viewYear = computed(() => props.viewDate.getFullYear())
const viewMonth = computed(() => props.viewDate.getMonth())

const weekdayLabels = computed(() => {
  const days = [...props.locale.weekdaysShort]
  if (props.firstDayOfWeek === 1) {
    const sunday = days.shift()!
    days.push(sunday)
  }
  return days
})

interface DayCell {
  key: string
  date: Date
  disabled: boolean
  selected: boolean
  isFocused: boolean
  classes: string[]
}

/** range 模式下的暫定區間（含 hover 預覽） */
const effectiveRange = computed<DateRange | null>(() => {
  if (props.mode !== 'range') return null
  const sel = props.selected as DateRange
  const [start, end] = sel
  if (start && end) return [start, end]
  if (start && !end && props.rangeHover) {
    return compareDate(props.rangeHover, start) < 0
      ? [props.rangeHover, start]
      : [start, props.rangeHover]
  }
  return [start, end]
})

function isSelectedDay(d: Date): boolean {
  if (props.mode === 'single' || props.mode === 'datetime') {
    const v = props.selected as Date | null
    return v ? isSameDay(v, d) : false
  }
  if (props.mode === 'multiple') {
    const arr = props.selected as Date[]
    return arr.some((x) => isSameDay(x, d))
  }
  // range
  const range = props.selected as DateRange
  return (
    (range[0] != null && isSameDay(range[0], d)) || (range[1] != null && isSameDay(range[1], d))
  )
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

const cellRows = computed<DayCell[][]>(() => {
  const today = new Date()
  const focused = focusedDate.value
  const matrix = getCalendarMatrix(viewYear.value, viewMonth.value, props.firstDayOfWeek)
  const rows: DayCell[][] = []
  for (const week of matrix) {
    const row: DayCell[] = []
    for (const date of week) {
      const outside = !isSameMonth(date, props.viewDate)
      const disabled = isDisabled(date, props.minDate, props.maxDate, props.disabledDate)
      const selected = isSelectedDay(date)
      const range = effectiveRange.value
      const isStart = !!(range && range[0] && isSameDay(range[0], date))
      const isEnd = !!(range && range[1] && isSameDay(range[1], date))
      const inRange =
        props.mode === 'range' &&
        !!(range && range[0] && range[1]) &&
        isInRange(date, range[0], range[1]) &&
        !isStart &&
        !isEnd
      const isToday = isSameDay(date, today)
      const isFocused = focused ? isSameDay(focused, date) : false

      const classes: string[] = ['rui-cal-day']
      if (outside) classes.push('rui-cal-day-outside')
      if (disabled) classes.push('rui-cal-day-disabled')
      if (selected) classes.push('rui-cal-day-selected')
      if (inRange) classes.push('rui-cal-day-in-range')
      if ((isStart || isEnd) && range && range[0] && range[1] && !isSameDay(range[0], range[1])) {
        classes.push(isStart ? 'rui-cal-day-range-start' : 'rui-cal-day-range-end')
      }
      if (isToday && !selected) classes.push('rui-cal-day-today')

      row.push({
        key: dateKey(date),
        date,
        disabled,
        selected,
        isFocused,
        classes,
      })
    }
    rows.push(row)
  }
  return rows
})

function shiftMonth(n: number) {
  emit('update:viewDate', addMonths(props.viewDate, n))
}
function shiftYear(n: number) {
  emit('update:viewDate', addYears(props.viewDate, n))
}

function onCellClick(cell: DayCell) {
  if (cell.disabled) return
  focusedDate.value = cell.date
  emit('select', cell.date)
}

function onCellHover(cell: DayCell) {
  if (props.mode !== 'range' || cell.disabled) return
  emit('hover', cell.date)
}

const todayDisabled = computed(() =>
  isDisabled(new Date(), props.minDate, props.maxDate, props.disabledDate),
)

// ── 鍵盤導航 + roving tabindex ─────────────────────────────────────────────────

const gridEl = useTemplateRef<HTMLElement>('gridEl')
const focusedDate = ref<Date | null>(null)

function computeInitialFocus(): Date {
  if (props.mode === 'single' || props.mode === 'datetime') {
    const sel = props.selected as Date | null
    if (sel && isSameMonth(sel, props.viewDate)) return sel
  } else if (props.mode === 'range') {
    const [s] = props.selected as DateRange
    if (s && isSameMonth(s, props.viewDate)) return s
  } else if (props.mode === 'multiple') {
    const arr = props.selected as Date[]
    const found = arr.find((d) => isSameMonth(d, props.viewDate))
    if (found) return found
  }
  const t = new Date()
  if (isSameMonth(t, props.viewDate)) return t
  return startOfMonth(props.viewDate)
}

onMounted(() => {
  if (!focusedDate.value) focusedDate.value = computeInitialFocus()
})

watch(
  () => props.viewDate,
  () => {
    const f = focusedDate.value
    if (!f) {
      focusedDate.value = startOfMonth(props.viewDate)
      return
    }
    // 若 focused 不在新 view 的 6×7 矩陣內，snap 到月初
    const matrix = getCalendarMatrix(viewYear.value, viewMonth.value, props.firstDayOfWeek)
    const inView = matrix.some((wk) => wk.some((d) => isSameDay(d, f)))
    if (!inView) focusedDate.value = startOfMonth(props.viewDate)
  },
)

function focusCellEl(d: Date) {
  if (!gridEl.value) return
  const sel = `[data-rui-date="${dateKey(d)}"]`
  const el = gridEl.value.querySelector<HTMLButtonElement>(sel)
  el?.focus()
}

function moveFocus(next: Date) {
  focusedDate.value = next
  if (!isSameMonth(next, props.viewDate)) {
    emit('update:viewDate', next)
  }
  nextTick(() => focusCellEl(next))
}

function handleGridKey(e: KeyboardEvent) {
  const f = focusedDate.value ?? computeInitialFocus()
  let next: Date | null = null
  switch (e.key) {
    case 'ArrowLeft':
      next = addDays(f, -1)
      break
    case 'ArrowRight':
      next = addDays(f, 1)
      break
    case 'ArrowUp':
      next = addDays(f, -7)
      break
    case 'ArrowDown':
      next = addDays(f, 7)
      break
    case 'PageUp':
      next = e.shiftKey ? addYears(f, -1) : addMonths(f, -1)
      break
    case 'PageDown':
      next = e.shiftKey ? addYears(f, 1) : addMonths(f, 1)
      break
    case 'Home': {
      const off = (f.getDay() - props.firstDayOfWeek + 7) % 7
      next = addDays(f, -off)
      break
    }
    case 'End': {
      const off = (f.getDay() - props.firstDayOfWeek + 7) % 7
      next = addDays(f, 6 - off)
      break
    }
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (!isDisabled(f, props.minDate, props.maxDate, props.disabledDate)) {
        emit('select', f)
      }
      return
    default:
      return
  }
  e.preventDefault()
  moveFocus(next)
}

defineExpose({
  /** 計算初始焦點並聚焦到該 day cell；popover 開啟時由 DatePicker 呼叫 */
  focusInitial: () => {
    focusedDate.value = computeInitialFocus()
    nextTick(() => requestAnimationFrame(() => focusCellEl(focusedDate.value!)))
  },
})

// ── Time strip ────────────────────────────────────────────────────────────────

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

const currentDateForTime = computed<Date>(() => {
  const v = props.selected as Date | null
  return v ?? props.viewDate
})

const hourValue = computed(() => currentDateForTime.value.getHours())
const minuteValue = computed(() => currentDateForTime.value.getMinutes())

const hourOptions = computed(() => Array.from({ length: 24 }, (_, i) => i))

const minuteOptions = computed(() => {
  const step = Math.max(1, Math.min(60, props.minuteStep))
  const out: number[] = []
  for (let m = 0; m < 60; m += step) out.push(m)
  // 確保當前分鐘值仍在選項裡（避免 step 改變後選不到）
  if (!out.includes(minuteValue.value)) {
    out.push(minuteValue.value)
    out.sort((a, b) => a - b)
  }
  return out
})

function onTimeChange(field: 'hour' | 'minute', raw: string) {
  const n = Number(raw)
  if (Number.isNaN(n)) return
  const base = (props.selected as Date | null) ?? new Date(props.viewDate)
  const next = new Date(base)
  if (field === 'hour') next.setHours(n)
  else next.setMinutes(n)
  next.setSeconds(0, 0)
  emit('update:time', next)
}

// ── CSS variables ─────────────────────────────────────────────────────────────

const cssVars = computed<CSSProperties>(
  () =>
    ({
      '--datepicker-selected-bg': 'var(--rui-color-default)',
      '--datepicker-selected-fg': 'var(--rui-color-default-foreground)',
      '--datepicker-in-range-bg': 'color-mix(in oklch, var(--rui-color-default) 18%, transparent)',
    }) as CSSProperties,
)
</script>

<style scoped>
.rui-cal-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  color: var(--rui-color-text-secondary);
  cursor: pointer;
  transition: background-color 150ms;
}
.rui-cal-nav:hover {
  background: var(--rui-color-surface-hover);
}

.rui-cal-day {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
  color: inherit;
  transition:
    background-color 120ms,
    color 120ms;
}
.rui-cal-day:hover:not(.rui-cal-day-disabled):not(.rui-cal-day-selected) {
  background: var(--rui-color-surface-hover);
}
.rui-cal-day-outside {
  color: var(--rui-color-text-muted);
}
.rui-cal-day-disabled {
  cursor: not-allowed;
  opacity: 0.35;
}
.rui-cal-day-today {
  box-shadow: inset 0 0 0 1px var(--rui-color-default);
}
.rui-cal-day-selected {
  background: var(--datepicker-selected-bg);
  color: var(--datepicker-selected-fg);
  font-weight: 500;
}
.rui-cal-day-in-range {
  background: var(--datepicker-in-range-bg);
  border-radius: 0;
}
.rui-cal-day-range-start {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.rui-cal-day-range-end {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.rui-cal-time-select {
  background: var(--rui-color-surface);
  border: 1px solid var(--rui-color-border);
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.875rem;
  color: var(--rui-color-text-primary);
  cursor: pointer;
}

.rui-cal-action {
  background: transparent;
  border: 0;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--rui-color-text-secondary);
  cursor: pointer;
  transition: background-color 120ms;
}
.rui-cal-action:hover:not(:disabled) {
  background: var(--rui-color-surface-hover);
}
.rui-cal-action:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.rui-cal-action-primary {
  color: var(--rui-color-default-foreground);
  background: var(--rui-color-default);
}
.rui-cal-action-primary:hover:not(:disabled) {
  background: var(--rui-color-default);
  filter: brightness(1.05);
}
</style>
