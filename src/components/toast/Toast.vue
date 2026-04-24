<template>
  <Teleport :to="teleportTo">
    <div class="rui-toast-positioner" :class="positionerClass" :style="positionerStyle">
      <Transition :name="transitionName" @after-leave="onAfterLeave">
        <div
          v-if="isOpen"
          ref="toastRef"
          class="rui-toast"
          :style="toastStyle"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          @mouseenter="pauseTimer"
          @mouseleave="resumeTimer"
        >
          <div class="rui-toast-body">
            <slot />
          </div>
          <button
            v-if="closable"
            type="button"
            class="rui-toast-close"
            aria-label="關閉"
            @click="closeToast"
          >
            <Icon name="close" :size="14" />
          </button>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import type { CSSProperties } from 'vue'
import Icon from '../icon/Icon.vue'
import { useToastStack } from './useToastStack'
import type { ToastProps } from './types'

defineOptions({ name: 'Toast' })

const props = withDefaults(defineProps<ToastProps>(), {
  modelValue: undefined,
  defaultOpen: false,
  x: 'center',
  y: 'center',
  duration: 3000,
  closable: true,
  bgColor: undefined,
  textColor: undefined,
  offset: 16,
  gap: 8,
  teleportTo: 'body',
  zIndex: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
}>()

// ── 受控 / 非受控雙模式 ───────────────────────────────────────────
const internalOpen = ref(props.defaultOpen)
const isOpen = computed(() =>
  props.modelValue !== undefined ? props.modelValue : internalOpen.value,
)

// ── 堆疊註冊 ──────────────────────────────────────────────────────
const id = useId()
const stackKey = computed(() => `${props.x}-${props.y}`)
const gapRef = computed(() => props.gap)
const {
  register,
  unregister,
  updateHeight,
  offset: stackOffset,
} = useToastStack(stackKey, id, gapRef)

// ── Toast 元素 ref + 高度量測 ─────────────────────────────────────
const toastRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

function observeHeight() {
  if (!toastRef.value) return
  // 初始量測
  updateHeight(toastRef.value.getBoundingClientRect().height)
  // 若內容改變持續更新
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) updateHeight(entry.contentRect.height)
    })
    resizeObserver.observe(toastRef.value)
  }
}

function stopObserve() {
  resizeObserver?.disconnect()
  resizeObserver = null
}

// ── 自動關閉計時 ──────────────────────────────────────────────────
let timerId: ReturnType<typeof setTimeout> | null = null
let remaining = 0
let startTime = 0

function clearTimer() {
  if (timerId !== null) {
    clearTimeout(timerId)
    timerId = null
  }
}

function startTimer(ms: number) {
  clearTimer()
  if (ms <= 0) return
  remaining = ms
  startTime = Date.now()
  timerId = setTimeout(() => {
    timerId = null
    closeToast()
  }, ms)
}

function pauseTimer() {
  if (timerId === null) return
  clearTimer()
  remaining = Math.max(0, remaining - (Date.now() - startTime))
}

function resumeTimer() {
  if (remaining > 0 && props.duration > 0) {
    startTime = Date.now()
    timerId = setTimeout(() => {
      timerId = null
      closeToast()
    }, remaining)
  }
}

// ── 開/關動作 ─────────────────────────────────────────────────────
function closeToast() {
  if (props.modelValue === undefined) internalOpen.value = false
  emit('update:modelValue', false)
}

// ── 位置 / 樣式計算 ───────────────────────────────────────────────
const positionerClass = computed(() => [
  `rui-toast-positioner--x-${props.x}`,
  `rui-toast-positioner--y-${props.y}`,
])

const positionerStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (props.zIndex !== undefined) style.zIndex = String(props.zIndex)

  const offsetPx = `${props.offset}px`
  const stackPx = `${stackOffset.value}px`

  if (props.y === 'top') {
    style.top = `calc(${offsetPx} + ${stackPx})`
  } else if (props.y === 'bottom') {
    style.bottom = `calc(${offsetPx} + ${stackPx})`
  } else {
    style.top = '50%'
    style.transform = `translateY(calc(-50% + ${stackPx}))`
  }

  if (props.x === 'left') {
    style.paddingLeft = offsetPx
  } else if (props.x === 'right') {
    style.paddingRight = offsetPx
  }

  return style
})

const toastStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (props.bgColor) style['--rui-color-toast-bg'] = props.bgColor
  if (props.textColor) style['--rui-color-toast-text'] = props.textColor
  return style
})

const transitionName = computed(() => {
  if (props.y === 'top') return 'rui-toast-slide-down'
  if (props.y === 'bottom') return 'rui-toast-slide-up'
  return 'rui-toast-fade'
})

// ── 副作用：監聽 isOpen 管理註冊、計時器、量測 ────────────────────
watch(
  isOpen,
  (val) => {
    if (val) {
      register()
      nextTick(() => {
        observeHeight()
      })
      startTimer(props.duration)
      emit('open')
    } else {
      clearTimer()
      // unregister 延到 transition leave 完成，避免堆疊抖動
    }
  },
  { immediate: true, flush: 'post' },
)

// 當 x/y 變更且目前為開啟狀態：重新註冊到新 stack
watch(stackKey, () => {
  if (!isOpen.value) return
  unregister()
  register()
  nextTick(() => {
    if (toastRef.value) {
      updateHeight(toastRef.value.getBoundingClientRect().height)
    }
  })
})

// duration 變更時若已在計時中則重啟
watch(
  () => props.duration,
  (val) => {
    if (isOpen.value && timerId !== null) startTimer(val)
  },
)

function onAfterLeave() {
  stopObserve()
  unregister()
  emit('close')
}

onMounted(() => {
  if (isOpen.value) {
    register()
    nextTick(() => observeHeight())
    startTimer(props.duration)
  }
})

onBeforeUnmount(() => {
  clearTimer()
  stopObserve()
  unregister()
})
</script>

<style scoped>
.rui-toast-positioner {
  position: fixed;
  left: 0;
  right: 0;
  z-index: var(--rui-z-toast);
  display: flex;
  pointer-events: none;
}

.rui-toast-positioner--x-left {
  justify-content: flex-start;
}
.rui-toast-positioner--x-center {
  justify-content: center;
}
.rui-toast-positioner--x-right {
  justify-content: flex-end;
}

.rui-toast {
  pointer-events: auto;
  display: inline-flex;
  align-items: flex-start;
  gap: 0.5rem;
  max-width: min(90vw, 32rem);
  padding: 0.75rem 1rem;
  background-color: var(--rui-color-toast-bg);
  color: var(--rui-color-toast-text);
  border-radius: var(--rui-radius-toast);
  box-shadow: var(--rui-shadow-toast);
  font-size: 0.9375rem;
  line-height: 1.5;
}

.rui-toast-body {
  flex: 1;
  min-width: 0;
}

.rui-toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
  border: none;
  border-radius: 0.25rem;
  background: transparent;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}

.rui-toast-close:hover {
  opacity: 1;
  transform: scale(1.15);
}

.rui-toast-close:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  opacity: 1;
}

/* ── Transitions ─────────────────────────────────────────────────── */
.rui-toast-slide-down-enter-active,
.rui-toast-slide-down-leave-active,
.rui-toast-slide-up-enter-active,
.rui-toast-slide-up-leave-active,
.rui-toast-fade-enter-active,
.rui-toast-fade-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

.rui-toast-slide-down-enter-from,
.rui-toast-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.rui-toast-slide-up-enter-from,
.rui-toast-slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.rui-toast-fade-enter-from,
.rui-toast-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (prefers-reduced-motion: reduce) {
  .rui-toast-slide-down-enter-active,
  .rui-toast-slide-down-leave-active,
  .rui-toast-slide-up-enter-active,
  .rui-toast-slide-up-leave-active,
  .rui-toast-fade-enter-active,
  .rui-toast-fade-leave-active {
    transition-duration: 0ms;
  }
  .rui-toast-slide-down-enter-from,
  .rui-toast-slide-down-leave-to,
  .rui-toast-slide-up-enter-from,
  .rui-toast-slide-up-leave-to,
  .rui-toast-fade-enter-from,
  .rui-toast-fade-leave-to {
    transform: none;
  }
}
</style>
