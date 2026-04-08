<template>
  <Teleport :to="teleportTo">
    <Transition name="rui-drawer-backdrop">
      <div v-if="isOpen" class="rui-drawer-backdrop" aria-hidden="true" />
    </Transition>

    <Transition :name="transitionName" @after-enter="onAfterEnter" @before-leave="onBeforeLeave">
      <div
        v-if="isOpen"
        ref="wrapperRef"
        class="rui-drawer-wrapper"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        :aria-labelledby="$slots.header ? undefined : headerId"
        :aria-describedby="description ? descId : undefined"
        @click.self="onBackdropClick"
        @keydown.escape="onEscapeKey"
      >
        <div
          ref="panelRef"
          class="rui-drawer-panel"
          :class="[placementClass, sizeClass]"
          :style="panelColorVars"
        >
          <!-- header -->
          <div class="rui-drawer-header">
            <slot name="header">
              <span :id="headerId" class="rui-drawer-title">{{ title }}</span>
            </slot>
            <button
              v-if="showCloseButton"
              type="button"
              class="rui-drawer-close"
              aria-label="關閉"
              @click="closeDrawer"
            >
              <Icon name="close" :size="16" aria-hidden="true" />
            </button>
          </div>

          <!-- body -->
          <div class="rui-drawer-body">
            <slot />
            <span v-if="description" :id="descId" class="sr-only">{{ description }}</span>
          </div>

          <!-- footer: 僅 slot 傳入時渲染 -->
          <div v-if="$slots.footer" class="rui-drawer-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useAttrs, useId, useSlots, useTemplateRef, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { DrawerProps } from './types'
import Icon from '../icon/Icon.vue'
import { useFocusTrap } from '../../composables/useFocusTrap'
import { useRestoreFocus } from '../../composables/useRestoreFocus'
import { useScrollLock } from '../../composables/useScrollLock'

defineOptions({ name: 'Drawer' })

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: undefined,
  defaultOpen: false,
  placement: 'right',
  size: 'md',
  title: '',
  description: '',
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
  open: []
  close: []
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
const panelRef = useTemplateRef<HTMLElement>('panelRef')
const wrapperRef = useTemplateRef<HTMLElement>('wrapperRef')

// ── Composables ───────────────────────────────────────────────────
const { enable: enableFocusTrap, disable: disableFocusTrap, focusFirst } = useFocusTrap()
const { lock: lockBodyScroll, unlock: unlockBodyScroll } = useScrollLock()
const { save: saveActiveElement, restore: restoreActiveElement } = useRestoreFocus()

// ── Dev warning：header slot 使用者須自行處理 accessible name ────
if (import.meta.env.DEV) {
  const slots = useSlots()
  const attrs = useAttrs()
  onMounted(() => {
    if (slots.header && !attrs['aria-labelledby'] && !attrs['aria-label']) {
      console.warn(
        '[Drawer] 使用 header slot 時，dialog 將失去預設的 accessible name。\n' +
          '請在 header slot 內為標題元素加上 id，並透過 aria-labelledby 傳入對應 id；\n' +
          '或直接在 <Drawer> 上補充 aria-label 屬性。',
      )
    }
  })
}

// ── Transition name 依方向決定 ────────────────────────────────────
const transitionName = computed(
  () =>
    ({
      left: 'rui-drawer-panel-left',
      right: 'rui-drawer-panel-right',
      top: 'rui-drawer-panel-top',
      bottom: 'rui-drawer-panel-bottom',
    })[props.placement],
)

// ── Placement class ───────────────────────────────────────────────
const placementClass = computed(
  () =>
    ({
      left: 'rui-drawer-panel--left',
      right: 'rui-drawer-panel--right',
      top: 'rui-drawer-panel--top',
      bottom: 'rui-drawer-panel--bottom',
    })[props.placement],
)

// ── Size class（side: width, top/bottom: height）──────────────────
const sizeClass = computed(() => {
  const isVertical = props.placement === 'top' || props.placement === 'bottom'
  const prefix = isVertical ? 'rui-drawer-panel--v' : 'rui-drawer-panel--h'
  return `${prefix}-${props.size}`
})

// ── 顏色覆蓋：局部 override CSS token，不影響全域 ────────────────
const panelColorVars = computed(() => {
  const style: CSSProperties = {}
  if (props.bgColor) style['--rui-color-drawer-bg'] = props.bgColor
  if (props.textColor) style['--rui-color-drawer-text'] = props.textColor
  if (props.borderColor) style['--rui-color-drawer-border'] = props.borderColor
  return style
})

// ── 統一關閉路徑 ──────────────────────────────────────────────────
function closeDrawer() {
  if (props.modelValue === undefined) internalOpen.value = false
  emit('update:modelValue', false)
  emit('close')
}

// ── Transition 事件 ───────────────────────────────────────────────
function onAfterEnter() {
  if (!panelRef.value) return
  if (props.trapFocus) enableFocusTrap(panelRef.value)
  nextTick(() => {
    focusFirst()
    if (document.activeElement === document.body && wrapperRef.value) {
      wrapperRef.value.focus()
    }
  })
}

function onBeforeLeave() {
  if (props.trapFocus) disableFocusTrap()
}

// ── 事件處理 ──────────────────────────────────────────────────────
function onBackdropClick() {
  if (props.closeOnClickOutside) closeDrawer()
}

function onEscapeKey() {
  if (props.closeOnEscape) closeDrawer()
}

// ── Side effects ──────────────────────────────────────────────────
watch(
  isOpen,
  (val) => {
    if (val) {
      if (props.restoreFocus) saveActiveElement()
      if (props.lockScroll) lockBodyScroll()
      emit('open')
    } else {
      if (props.lockScroll) unlockBodyScroll()
      if (props.restoreFocus) restoreActiveElement()
    }
  },
  { immediate: true, flush: 'pre' },
)
</script>

<style scoped>
/* Backdrop */
.rui-drawer-backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--rui-color-drawer-backdrop);
  z-index: var(--rui-z-modal);
}

/* Wrapper：定位容器，點擊空白區域關閉 */
.rui-drawer-wrapper {
  position: fixed;
  inset: 0;
  z-index: var(--rui-z-modal);
}

/* Panel 基礎 */
.rui-drawer-panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: var(--rui-color-drawer-bg);
  color: var(--rui-color-drawer-text);
  overflow: hidden;
}

/* ── Placement ── */
.rui-drawer-panel--left {
  top: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  box-shadow: var(--rui-shadow-drawer-left);
}

.rui-drawer-panel--right {
  top: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  box-shadow: var(--rui-shadow-drawer-right);
}

.rui-drawer-panel--top {
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: var(--rui-shadow-drawer-top);
}

.rui-drawer-panel--bottom {
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: var(--rui-shadow-drawer-bottom);
}

/* ── Sizes：side（left/right）控制 width ── */
.rui-drawer-panel--h-sm {
  width: 20rem;
} /* 320px */
.rui-drawer-panel--h-md {
  width: 25rem;
} /* 400px */
.rui-drawer-panel--h-lg {
  width: 35rem;
} /* 560px */

/* ── Sizes：top/bottom 控制 height ── */
.rui-drawer-panel--v-sm {
  height: 15rem;
} /* 240px */
.rui-drawer-panel--v-md {
  height: 21.875rem;
} /* 350px */
.rui-drawer-panel--v-lg {
  height: 30rem;
} /* 480px */

/* Header */
.rui-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--rui-color-drawer-border);
  flex-shrink: 0;
}

.rui-drawer-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  color: inherit;
}

/* Close button */
.rui-drawer-close {
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

.rui-drawer-close:focus-visible {
  outline: 2px solid var(--rui-color-drawer-border);
  outline-offset: 2px;
}

/* Body */
.rui-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.6;
}

/* Footer */
.rui-drawer-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-top: 1px solid var(--rui-color-drawer-border);
  flex-shrink: 0;
}

/* ── Backdrop transition ── */
.rui-drawer-backdrop-enter-active,
.rui-drawer-backdrop-leave-active {
  transition: opacity 150ms ease;
}
.rui-drawer-backdrop-enter-from,
.rui-drawer-backdrop-leave-to {
  opacity: 0;
}

/* ── Panel transition：left ── */
.rui-drawer-panel-left-enter-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.rui-drawer-panel-left-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.rui-drawer-panel-left-enter-from,
.rui-drawer-panel-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* ── Panel transition：right ── */
.rui-drawer-panel-right-enter-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.rui-drawer-panel-right-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.rui-drawer-panel-right-enter-from,
.rui-drawer-panel-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* ── Panel transition：top ── */
.rui-drawer-panel-top-enter-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.rui-drawer-panel-top-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.rui-drawer-panel-top-enter-from,
.rui-drawer-panel-top-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* ── Panel transition：bottom ── */
.rui-drawer-panel-bottom-enter-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.rui-drawer-panel-bottom-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.rui-drawer-panel-bottom-enter-from,
.rui-drawer-panel-bottom-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* prefers-reduced-motion：保留 transition 物件本身，僅將 duration 歸零 */
@media (prefers-reduced-motion: reduce) {
  .rui-drawer-backdrop-enter-active,
  .rui-drawer-backdrop-leave-active,
  .rui-drawer-panel-left-enter-active,
  .rui-drawer-panel-left-leave-active,
  .rui-drawer-panel-right-enter-active,
  .rui-drawer-panel-right-leave-active,
  .rui-drawer-panel-top-enter-active,
  .rui-drawer-panel-top-leave-active,
  .rui-drawer-panel-bottom-enter-active,
  .rui-drawer-panel-bottom-leave-active {
    transition-duration: 0ms;
  }
}
</style>
