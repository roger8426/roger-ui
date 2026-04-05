<template>
  <Teleport :to="teleportTo">
    <Transition name="rui-modal-backdrop">
      <div v-if="isOpen" class="rui-modal-backdrop" aria-hidden="true" />
    </Transition>

    <Transition name="rui-modal-panel" @after-enter="onAfterEnter">
      <div
        v-if="isOpen"
        ref="wrapperRef"
        class="rui-modal-wrapper"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        :aria-labelledby="$slots.header ? undefined : headerId"
        :aria-describedby="description ? descId : undefined"
        @click.self="onBackdropClick"
        @keydown.escape="onEscapeKey"
      >
        <div ref="panelRef" class="rui-modal-panel" :class="sizeClass" :style="panelColorVars">
          <!-- header -->
          <div class="rui-modal-header">
            <slot name="header">
              <span :id="headerId" class="rui-modal-title">{{ title }}</span>
            </slot>
            <button
              v-if="showCloseButton"
              type="button"
              class="rui-modal-close"
              aria-label="關閉"
              @click="closeModal"
            >
              <Icon name="close" :size="16" aria-hidden="true" />
            </button>
          </div>

          <!-- body -->
          <div class="rui-modal-body">
            <slot />
            <span v-if="description" :id="descId" class="sr-only">{{ description }}</span>
          </div>

          <!-- footer: 僅 slot 傳入時渲染 -->
          <div v-if="$slots.footer" class="rui-modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useAttrs, useId, useSlots, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { ModalProps } from './types'
import Icon from '../icon/Icon.vue'
import { useFocusTrap } from '../../composables/useFocusTrap'
import { useRestoreFocus } from '../../composables/useRestoreFocus'
import { useScrollLock } from '../../composables/useScrollLock'

defineOptions({ name: 'Modal' })

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: undefined,
  defaultOpen: false,
  title: '',
  description: '',
  size: 'md',
  showCloseButton: true,
  closeOnClickOutside: true,
  closeOnEscape: true,
  trapFocus: true,
  restoreFocus: true,
  lockScroll: true,
  teleportTo: 'body',
  bgColor: undefined,
  textColor: undefined,
  borderColor: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// ── 狀態管理（受控/非受控雙模式）──────────────────────────────────
const internalOpen = ref(props.defaultOpen)

const isOpen = computed(() =>
  props.modelValue !== undefined ? props.modelValue : internalOpen.value,
)

// ── IDs ───────────────────────────────────────────────────────────
const baseId = useId()
const headerId = `${baseId}-header`
const descId = `${baseId}-desc`

// ── Panel / wrapper refs ─────────────────────────────────────────
const panelRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)

// ── Composables ───────────────────────────────────────────────────
const { enable: enableFocusTrap, disable: disableFocusTrap, focusFirst } = useFocusTrap()
const { lock: lockBodyScroll, unlock: unlockBodyScroll } = useScrollLock()

// ── Dev warning：header slot 使用者須自行處理 accessible name ────
if (import.meta.env.DEV) {
  const slots = useSlots()
  const attrs = useAttrs()
  onMounted(() => {
    if (slots.header && !attrs['aria-labelledby'] && !attrs['aria-label']) {
      console.warn(
        '[Modal] 使用 header slot 時，dialog 將失去預設的 accessible name。\n' +
          '請在 header slot 內為標題元素加上 id，並透過 aria-labelledby 傳入對應 id；\n' +
          '或直接在 <Modal> 上補充 aria-label 屬性。',
      )
    }
  })
}
const { save: saveActiveElement, restore: restoreActiveElement } = useRestoreFocus()

// ── Size class map ────────────────────────────────────────────────
const sizeClass = computed(
  () =>
    ({
      sm: 'rui-modal-panel--sm',
      md: 'rui-modal-panel--md',
      lg: 'rui-modal-panel--lg',
    })[props.size],
)

// ── 顏色覆蓋：局部 override CSS token，不影響全域 ────────────────
const panelColorVars = computed(() => {
  const style: CSSProperties = {}
  if (props.bgColor) style['--rui-color-modal-bg'] = props.bgColor
  if (props.textColor) style['--rui-color-modal-text'] = props.textColor
  if (props.borderColor) style['--rui-color-modal-border'] = props.borderColor
  return style
})

// ── 統一關閉路徑 ──────────────────────────────────────────────────
function closeModal() {
  if (props.modelValue === undefined) internalOpen.value = false
  emit('update:modelValue', false)
}

// ── Transition：開啟動畫結束後才啟動 trap 並聚焦 ──────────────────
function onAfterEnter() {
  if (!panelRef.value) return
  if (props.trapFocus) enableFocusTrap(panelRef.value)
  nextTick(() => {
    focusFirst()
    // fallback：panel 內若無可聚焦元素，聚焦 wrapper 確保 Escape 鍵可用
    if (document.activeElement === document.body && wrapperRef.value) {
      wrapperRef.value.focus()
    }
  })
}

// ── 事件處理 ──────────────────────────────────────────────────────
function onBackdropClick() {
  if (props.closeOnClickOutside) closeModal()
}

function onEscapeKey() {
  if (props.closeOnEscape) closeModal()
}

// ── Side effects：監聽 isOpen 統一處理兩種模式的 scroll lock / focus ─
// immediate: true 兼容 defaultOpen: true（mount 時立即生效）
// flush: 'pre' 確保 saveActiveElement 在 DOM 更新前捕捉正確的 activeElement
watch(
  isOpen,
  (val) => {
    if (val) {
      if (props.restoreFocus) saveActiveElement()
      if (props.lockScroll) lockBodyScroll()
    } else {
      if (props.trapFocus) disableFocusTrap()
      if (props.lockScroll) unlockBodyScroll()
      if (props.restoreFocus) restoreActiveElement()
    }
  },
  { immediate: true, flush: 'pre' },
)
</script>

<style scoped>
/* Backdrop */
.rui-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--rui-color-modal-backdrop);
  z-index: var(--rui-z-modal);
}

/* Wrapper：定位容器，backdrop 後方 */
.rui-modal-wrapper {
  position: fixed;
  inset: 0;
  z-index: var(--rui-z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

/* Panel */
.rui-modal-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100dvh - 4rem);
  background-color: var(--rui-color-modal-bg);
  color: var(--rui-color-modal-text);
  border-radius: var(--rui-radius-modal);
  box-shadow: var(--rui-shadow-modal);
  overflow: hidden;
}

.rui-modal-panel--sm {
  max-width: 24rem;
} /* 384px */
.rui-modal-panel--md {
  max-width: 32rem;
} /* 512px */
.rui-modal-panel--lg {
  max-width: 42rem;
} /* 672px */

/* Header */
.rui-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--rui-color-modal-border);
  flex-shrink: 0;
}

.rui-modal-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  color: inherit;
}

/* Close button */
.rui-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--rui-color-text-muted);
  transition:
    transform 150ms ease,
    color 150ms;

  &:hover {
    transform: scale(1.2);
    color: inherit;
  }
}

.rui-modal-close:focus-visible {
  outline: 2px solid var(--rui-color-modal-border);
  outline-offset: 2px;
}

/* Body */
.rui-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.6;
}

/* Footer */
.rui-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-top: 1px solid var(--rui-color-modal-border);
  flex-shrink: 0;
}

/* Backdrop transition */
.rui-modal-backdrop-enter-active,
.rui-modal-backdrop-leave-active {
  transition: opacity 150ms ease;
}
.rui-modal-backdrop-enter-from,
.rui-modal-backdrop-leave-to {
  opacity: 0;
}

/* Panel transition */
.rui-modal-panel-enter-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.rui-modal-panel-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.rui-modal-panel-enter-from,
.rui-modal-panel-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* prefers-reduced-motion：保留 transition 物件本身，僅將 duration 歸零 */
@media (prefers-reduced-motion: reduce) {
  .rui-modal-backdrop-enter-active,
  .rui-modal-backdrop-leave-active,
  .rui-modal-panel-enter-active,
  .rui-modal-panel-leave-active {
    transition-duration: 0ms;
  }
}
</style>
