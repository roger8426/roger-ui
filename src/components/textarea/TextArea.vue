<template>
  <div class="inline-flex flex-col gap-0.5">
    <div
      class="flex flex-col rounded-md border transition-colors"
      :class="[sizeWrapperClasses, wrapperStateClasses]"
      :style="wrapperVars"
    >
      <textarea
        ref="textareaRef"
        class="rui-textarea-no-scrollbar min-w-0 min-h-0 flex-1 border-none bg-transparent outline-none placeholder:opacity-50 disabled:cursor-not-allowed"
        :class="[sizeTextAreaClasses, resizeClass]"
        :style="textareaStyle"
        :rows="rows"
        :placeholder="placeholder"
        :id="id"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :value="modelValue"
        :aria-label="textareaAriaLabel"
        :aria-invalid="errorActive || undefined"
        :aria-describedby="errorActive && errorMsg ? errorId : undefined"
        @input="onInput"
        @change="onChange"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />
      <span
        v-if="showCount"
        class="self-end px-1 pb-1 text-xs text-(--rui-color-text-muted)"
        aria-hidden="true"
      >
        {{ charCountDisplay }}
      </span>
    </div>
    <span v-if="errorActive && errorMsg" :id="errorId" class="text-xs text-(--rui-color-error)">{{
      errorMsg
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, useId, useTemplateRef, watch } from 'vue'
import type { TextAreaExpose, TextAreaProps } from './types'

const props = withDefaults(defineProps<TextAreaProps>(), {
  modelValue: '',
  size: 'md',
  placeholder: '',
  rows: 3,
  resize: 'none',
  disabled: false,
  readonly: false,
  error: false,
  errorMsg: '',
  border: true,
  showCount: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const textareaRef = useTemplateRef<HTMLTextAreaElement>('textareaRef')
const errorId = `textarea-error-${useId()}`

// ─── 狀態 ─────────────────────────────────────────────────────────────────────

const errorActive = computed(() => props.error || !!props.errorMsg)

const textareaAriaLabel = computed(() => props.placeholder || '文字輸入區')

const charCount = computed(() => props.modelValue.length)

const charCountDisplay = computed(() =>
  props.maxlength !== undefined ? `${charCount.value} / ${props.maxlength}` : `${charCount.value}`,
)

// ─── CSS 變數 ──────────────────────────────────────────────────────────────────

const wrapperVars = computed(
  (): Record<string, string> => ({
    '--textarea-active-border': props.borderColor ?? 'var(--rui-color-default)',
  }),
)

// ─── 樣式 computed ─────────────────────────────────────────────────────────────

const sizeWrapperClasses = computed(
  () =>
    ({
      sm: 'px-2 pt-1.5',
      md: 'px-3 pt-2',
      lg: 'px-4 pt-2.5',
    })[props.size],
)

const sizeTextAreaClasses = computed(
  () =>
    ({
      sm: 'text-sm pb-1.5',
      md: 'text-base pb-2',
      lg: 'text-lg pb-2.5',
    })[props.size],
)

const resizeClass = computed(
  () =>
    ({
      none: 'resize-none',
      vertical: 'resize-y',
      both: 'resize',
    })[props.resize],
)

const wrapperStateClasses = computed(() => {
  if (props.disabled) {
    return [
      'cursor-not-allowed opacity-60 bg-(--rui-color-disabled-bg)',
      props.border ? 'border-(--textarea-active-border)' : 'border-transparent',
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
      props.border ? 'border-(--textarea-active-border)' : 'border-transparent',
    ]
  }
  if (props.border) {
    return [
      'border-(--textarea-active-border)',
      'focus-within:ring-1 focus-within:ring-(--textarea-active-border)',
    ]
  }
  return ['border-transparent']
})

const textareaStyle = computed(
  (): Record<string, string> => ({
    overflow: props.maxHeight ? 'auto' : 'hidden',
    ...(props.maxHeight ? { maxHeight: props.maxHeight } : {}),
    ...(props.color ? { color: props.color } : {}),
  }),
)

// ─── Auto-resize ───────────────────────────────────────────────────────────────

function adjustHeight() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

onMounted(() => {
  adjustHeight()
})

watch(
  () => props.modelValue,
  () => {
    nextTick(adjustHeight)
  },
)

// ─── 事件 ──────────────────────────────────────────────────────────────────────

function onInput(event: Event) {
  // @input 只會綁在本元件 template 內的 <textarea>，event.target 必為 HTMLTextAreaElement
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

function onChange(event: Event) {
  // @change 同上，target 必為本元件的 <textarea>
  const target = event.target as HTMLTextAreaElement
  emit('change', target.value, event)
}

// ─── Expose ────────────────────────────────────────────────────────────────────

defineExpose<TextAreaExpose>({
  focus: () => textareaRef.value?.focus(),
})
</script>

<style scoped>
.rui-textarea-no-scrollbar {
  scrollbar-width: none;
}
.rui-textarea-no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
