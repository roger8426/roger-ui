<template>
  <div :style="colorStyle">
    <label
      :class="[
        'inline-flex cursor-pointer items-center gap-2',
        isDisabled && 'cursor-not-allowed opacity-50',
      ]"
    >
      <span class="relative shrink-0">
        <input
          :id="computedId"
          ref="checkboxRef"
          type="checkbox"
          class="peer sr-only"
          :checked="checked"
          :disabled="isDisabled"
          :name="computedName ?? undefined"
          :required="required"
          :aria-invalid="errorActive || undefined"
          :aria-describedby="errorActive && errorMsg ? errorId : undefined"
          @change="handleChange"
          @focus="emit('focus', $event)"
          @blur="emit('blur', $event)"
        />
        <span aria-hidden="true" :class="visualClasses">
          <Icon
            :name="isIndeterminate ? 'minus' : 'check'"
            :size="iconSize"
            class="transition-opacity"
            :class="checked || isIndeterminate ? 'opacity-100' : 'opacity-0'"
          />
        </span>
      </span>
      <span v-if="$slots.default || label" class="select-none text-sm">
        <slot>{{ label }}</slot>
      </span>
    </label>
    <p v-if="errorActive && errorMsg" :id="errorId" class="mt-1 text-sm text-(--rui-color-error)">
      {{ errorMsg }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, useId, watchEffect } from 'vue'
import { CHECKBOX_GROUP_KEY, type CheckboxProps } from './types'
import Icon from '../icon/Icon.vue'

defineOptions({ name: 'Checkbox' })

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  indeterminate: false,
  disabled: false,
  size: 'md',
  label: '',
  value: undefined,
  id: undefined,
  name: undefined,
  required: false,
  error: false,
  errorMsg: '',
  color: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const checkboxRef = ref<HTMLInputElement | null>(null)
const autoId = useId()
const computedId = computed(() => props.id ?? autoId)
const errorId = computed(() => `${computedId.value}-error`)

const groupCtx = inject(CHECKBOX_GROUP_KEY, null)

// A Checkbox without a `value` prop behaves standalone even when inside a CheckboxGroup.
// This allows "master / select-all" checkboxes to live inside the group's slot
// without being registered as selectable options.
const isInGroup = computed(() => groupCtx !== null && props.value !== undefined)

const isDisabled = computed(() => props.disabled || (groupCtx?.disabled.value ?? false))

const checked = computed(() => {
  if (isInGroup.value && groupCtx) return groupCtx.isChecked(props.value)
  return props.modelValue
})

const isIndeterminate = computed(() => {
  if (isInGroup.value) return false
  return props.indeterminate
})

const errorActive = computed(() => props.error || !!props.errorMsg)

const computedName = computed(() => {
  if (props.name) return props.name
  return groupCtx?.name.value ?? null
})

watchEffect(() => {
  if (checkboxRef.value) {
    checkboxRef.value.indeterminate = isIndeterminate.value
  }
})

function handleChange(event: Event): void {
  const target = event.target as HTMLInputElement
  if (isInGroup.value && groupCtx) {
    groupCtx.toggle(props.value)
  } else {
    emit('update:modelValue', target.checked)
    emit('change', target.checked, event)
  }
}

onMounted(() => {
  if (isInGroup.value && groupCtx) {
    groupCtx.registerOption(props.value)
  }
})

onUnmounted(() => {
  if (isInGroup.value && groupCtx) {
    groupCtx.unregisterOption(props.value)
  }
})

const colorStyle = computed(() => ({
  '--checkbox-color': props.color ?? 'var(--rui-color-default)',
  '--checkbox-icon-color': 'oklch(100% 0 0)',
}))

const sizeClasses = computed(
  () =>
    ({
      sm: 'h-3.5 w-3.5 rounded-[3px]',
      md: 'h-4 w-4 rounded-sm',
      lg: 'h-5 w-5 rounded',
    })[props.size],
)

const iconSize = computed(
  () =>
    ({
      sm: 10,
      md: 12,
      lg: 14,
    })[props.size],
)

const visualClasses = computed(() => [
  'inline-flex items-center justify-center border transition-colors',
  'peer-focus-visible:ring-2 peer-focus-visible:ring-(--checkbox-color) peer-focus-visible:ring-offset-1',
  sizeClasses.value,
  checked.value || isIndeterminate.value
    ? 'border-(--checkbox-color) bg-(--checkbox-color) text-(--checkbox-icon-color)'
    : errorActive.value
      ? 'border-(--rui-color-error) bg-(--rui-color-surface)'
      : 'border-(--rui-color-border) bg-(--rui-color-surface)',
])

defineExpose({
  focus: () => checkboxRef.value?.focus(),
})
</script>
