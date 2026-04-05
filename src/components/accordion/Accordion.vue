<template>
  <div class="flex flex-col divide-y divide-(--rui-color-border)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { ACCORDION_CONTEXT_KEY, type AccordionProps } from './types'

defineOptions({ name: 'Accordion' })

const props = withDefaults(defineProps<AccordionProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  multiple: false,
  disabled: false,
  collapsible: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
}>()

// 非受控模式的內部狀態
const internalValue = ref<string[]>(
  props.defaultValue !== undefined
    ? Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [props.defaultValue]
    : [],
)

// 目前展開的 values（受控優先）
const openValues = computed<string[]>(() => {
  if (props.modelValue !== undefined) {
    return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
  }
  return internalValue.value
})

function isOpen(value: string): boolean {
  return openValues.value.includes(value)
}

function toggle(value: string): void {
  const currentlyOpen = openValues.value

  let next: string[]

  if (props.multiple) {
    next = currentlyOpen.includes(value)
      ? currentlyOpen.filter((v) => v !== value)
      : [...currentlyOpen, value]
  } else {
    if (currentlyOpen.includes(value)) {
      next = props.collapsible ? [] : currentlyOpen
    } else {
      next = [value]
    }
  }

  if (props.modelValue !== undefined) {
    // 受控模式：只 emit
    emit('update:modelValue', props.multiple ? next : next[0])
  } else {
    // 非受控模式：更新內部狀態並 emit
    internalValue.value = next
    emit('update:modelValue', props.multiple ? next : next[0])
  }
}

provide(ACCORDION_CONTEXT_KEY, {
  isOpen,
  toggle,
  get disabled() {
    return props.disabled
  },
})
</script>
