<template>
  <button
    type="button"
    class="inline-flex cursor-pointer items-center justify-center rounded-full font-bold transition-all hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--btn-color)"
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
      '--btn-color': props.borderColor ?? props.color ?? 'var(--color-default)',
      backgroundColor: props.color ?? 'transparent',
      color: props.textColor ?? 'var(--color-default)',
      border: `1px solid ${props.borderColor ?? 'var(--color-default)'}`,
    }
  }
  return {
    '--btn-color': props.color ?? 'var(--color-default)',
    backgroundColor: props.color ?? 'var(--color-default)',
    color: props.textColor ?? 'var(--color-default-foreground)',
    border: props.borderColor ? `1px solid ${props.borderColor}` : 'none',
  }
})
</script>
