<template>
  <div class="inline-flex flex-col gap-0.5" :class="rootClass" :style="rootStyle">
    <div
      class="inline-flex items-center rounded-md border transition-colors"
      :class="[sizeWrapperClasses, wrapperStateClasses]"
      :style="wrapperVars"
    >
      <span
        v-if="$slots.prefix"
        class="flex shrink-0 items-center"
        :class="slotSpacingClasses.prefix"
      >
        <slot name="prefix" />
      </span>
      <input
        ref="inputRef"
        v-bind="forwardedAttrs"
        class="min-w-0 flex-1 border-none bg-transparent outline-none placeholder:opacity-50 disabled:cursor-not-allowed"
        :class="sizeInputClasses"
        :style="inputColorStyle"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :id="id"
        :disabled="disabled"
        :readonly="readonly"
        :aria-label="inputAriaLabel"
        :aria-invalid="errorActive || undefined"
        :aria-describedby="errorActive && errorMsg ? errorId : undefined"
        @input="onInput"
        @change="onChange"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />
      <span
        v-if="$slots.suffix"
        class="flex shrink-0 items-center"
        :class="slotSpacingClasses.suffix"
      >
        <slot name="suffix" />
      </span>
    </div>
    <span v-if="errorActive && errorMsg" :id="errorId" class="text-xs text-(--rui-color-error)">{{
      errorMsg
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs, useId, useTemplateRef } from 'vue'
import type { InputExpose, InputProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  size: 'md',
  placeholder: '',
  disabled: false,
  readonly: false,
  error: false,
  errorMsg: '',
  border: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const errorId = `${useId()}-error`

const attrs = useAttrs()

// class/style 留在根元素，其餘 fallthrough attrs 轉發到內部 <input>
const rootClass = computed(() => attrs.class)
const rootStyle = computed(() => attrs.style)
const forwardedAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')),
)

const wrapperVars = computed(
  (): Record<string, string> => ({
    '--input-active-border': props.borderColor ?? 'var(--rui-color-default)',
  }),
)

const inputColorStyle = computed(() => (props.color ? { color: props.color } : undefined))

const inputAriaLabel = computed(
  () => (attrs['aria-label'] as string | undefined) ?? (props.placeholder || '輸入欄位'),
)

const errorActive = computed(() => props.error || !!props.errorMsg)

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

const slotSpacingClasses = computed(() => ({
  prefix: props.size === 'sm' ? 'pr-1.5' : 'pr-2',
  suffix: props.size === 'sm' ? 'pl-1.5' : 'pl-2',
}))

const wrapperStateClasses = computed(() => {
  if (props.disabled) {
    return [
      'cursor-not-allowed opacity-60 bg-(--rui-color-disabled-bg)',
      props.border ? 'border-(--input-active-border)' : 'border-transparent',
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
      props.border ? 'border-(--input-active-border)' : 'border-transparent',
    ]
  }
  if (props.border) {
    return [
      'border-(--input-active-border)',
      'focus-within:ring-1 focus-within:ring-(--input-active-border)',
    ]
  }
  return ['border-transparent']
})

function onInput(event: Event) {
  // @input 只會綁在本元件 template 內的 <input>，event.target 必為 HTMLInputElement
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onChange(event: Event) {
  // @change 同上，target 必為本元件的 <input>
  const target = event.target as HTMLInputElement
  emit('change', target.value, event)
}

defineExpose<InputExpose>({
  focus: () => inputRef.value?.focus(),
})
</script>

<style scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  appearance: textfield;
}
</style>
