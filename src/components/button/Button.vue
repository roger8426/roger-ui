<template>
  <button
    type="button"
    class="inline-flex cursor-pointer items-center justify-center rounded-full font-bold transition-all hover:brightness-90"
    :class="[sizeClasses, { 'cursor-not-allowed opacity-50': disabled }]"
    :style="colorStyle"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from './types'

const props = withDefaults(defineProps<ButtonProps>(), {
  size: 'md',
  outline: false,
  disabled: false,
})

const sizeClasses = computed(
  () =>
    ({
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    })[props.size],
)

const colorStyle = computed(() => {
  if (props.outline) {
    return {
      backgroundColor: props.color ?? '#ffffff00',
      color: props.textColor ?? '#3b5bdb',
      border: `1px solid ${props.borderColor ?? '#3b5bdb'}`,
    }
  }
  return {
    backgroundColor: props.color ?? '#3b5bdb',
    color: props.textColor ?? '#ffffff',
    border: props.borderColor ? `1px solid ${props.borderColor}` : 'none',
  }
})
</script>
