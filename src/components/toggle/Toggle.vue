<template>
  <label
    :style="colorStyle"
    :class="[
      'inline-flex cursor-pointer items-center gap-2',
      props.disabled && 'cursor-not-allowed opacity-50',
    ]"
  >
    <span class="relative shrink-0">
      <input
        :id="computedId"
        ref="switchRef"
        type="checkbox"
        role="switch"
        class="peer sr-only"
        :checked="modelValue"
        :aria-label="ariaLabel"
        :disabled="props.disabled"
        :name="name ?? undefined"
        :required="required"
        :aria-checked="modelValue"
        @change="handleChange"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />
      <span aria-hidden="true" :class="trackClasses">
        <span :class="thumbClasses">
          <slot />
        </span>
      </span>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, useId, useTemplateRef } from 'vue'
import type { ToggleProps } from './types'

defineOptions({ name: 'Toggle' })

defineSlots<{
  default?: () => unknown
}>()

const props = withDefaults(defineProps<ToggleProps>(), {
  modelValue: false,
  disabled: false,
  size: 'md',
  id: undefined,
  name: undefined,
  required: false,
  color: undefined,
  ariaLabel: 'Toggle',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const switchRef = useTemplateRef<HTMLInputElement>('switchRef')
const autoId = useId()
const computedId = computed(() => props.id ?? autoId)

function handleChange(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', target.checked, event)
}

const colorStyle = computed(() => ({
  '--switch-track-on': props.color ?? 'var(--rui-color-switch-track-on)',
}))

const trackSizeClasses = computed(
  () =>
    ({
      sm: 'h-4 w-7',
      md: 'h-5 w-9',
      lg: 'h-6 w-11',
    })[props.size],
)

const thumbSizeClasses = computed(
  () =>
    ({
      sm: 'h-3 w-3',
      md: 'h-3.5 w-3.5',
      lg: 'h-4 w-4',
    })[props.size],
)

const thumbTranslateClass = computed(() => {
  if (!props.modelValue) return ''
  return {
    sm: 'translate-x-[10px]',
    md: 'translate-x-4',
    lg: 'translate-x-[22px]',
  }[props.size]
})

const trackClasses = computed(() => [
  'relative inline-flex items-center rounded-full transition-colors duration-200',
  'peer-focus-visible:ring-2 peer-focus-visible:ring-(--switch-track-on) peer-focus-visible:ring-offset-1',
  trackSizeClasses.value,
  props.modelValue ? 'bg-(--switch-track-on)' : 'bg-(--rui-color-switch-track-off)',
])

const thumbClasses = computed(() => [
  'absolute left-[3px] inline-flex items-center justify-center rounded-full bg-(--rui-color-switch-thumb) shadow-sm transition-transform duration-200',
  thumbSizeClasses.value,
  thumbTranslateClass.value,
])

defineExpose({
  focus: () => switchRef.value?.focus(),
})
</script>
