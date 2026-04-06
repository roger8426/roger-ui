<template>
  <slot
    :all-checked="allChecked"
    :indeterminate="indeterminate"
    :toggle-all="toggleAll"
  />
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { CHECKBOX_GROUP_KEY, type CheckboxGroupProps } from './types'

defineOptions({ name: 'CheckboxGroup' })

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  disabled: false,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown[]]
}>()

const allOptionValues = ref<Set<unknown>>(new Set())

function registerOption(value: unknown): void {
  allOptionValues.value = new Set([...allOptionValues.value, value])
}

function unregisterOption(value: unknown): void {
  const next = new Set(allOptionValues.value)
  next.delete(value)
  allOptionValues.value = next
}

function isChecked(value: unknown): boolean {
  return props.modelValue.includes(value)
}

function toggle(value: unknown): void {
  const current = props.modelValue
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value]
  emit('update:modelValue', next)
}

const allChecked = computed(() => {
  if (allOptionValues.value.size === 0) return false
  return [...allOptionValues.value].every((v) => props.modelValue.includes(v))
})

const indeterminate = computed(() => {
  if (allOptionValues.value.size === 0) return false
  const checkedCount = [...allOptionValues.value].filter((v) =>
    props.modelValue.includes(v),
  ).length
  return checkedCount > 0 && checkedCount < allOptionValues.value.size
})

function toggleAll(): void {
  if (allChecked.value) {
    emit('update:modelValue', [])
  } else {
    emit('update:modelValue', [...allOptionValues.value])
  }
}

provide(CHECKBOX_GROUP_KEY, {
  selectedValues: computed(() => props.modelValue),
  toggle,
  isChecked,
  registerOption,
  unregisterOption,
  disabled: computed(() => props.disabled),
  name: computed(() => props.name),
})
</script>
