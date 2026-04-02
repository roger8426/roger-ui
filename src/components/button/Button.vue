<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center py-2 font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--btn-color)"
    :class="[
      sizeClasses,
      disabled || loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:brightness-80',
    ]"
    :style="colorStyle"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
  >
    <span
      v-if="loading"
      class="mr-2 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import type { ButtonProps } from './types'

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  size: 'md',
  radius: 'full',
  outline: false,
  loading: false,
  disabled: false,
})

if (import.meta.env.DEV) {
  watchEffect(() => {
    if (props.bgColor !== undefined && props.outline) {
      console.warn('[RogerUI/Button] `bgColor` 在 `outline` 模式下會被忽略。')
    }
  })
}

const sizeClasses = computed(
  () =>
    ({
      sm: 'px-3 text-sm',
      md: 'px-4 text-base',
      lg: 'px-5 text-lg',
    })[props.size],
)

const borderRadius = computed(() =>
  props.radius === 'full' ? '9999px' : `${props.radius}px`,
)

const colorStyle = computed(() => {
  if (props.outline) {
    return {
      '--btn-color': props.borderColor ?? 'var(--color-default)',
      borderRadius: borderRadius.value,
      backgroundColor: 'transparent',
      color: props.textColor ?? 'var(--color-default)',
      border: `1px solid ${props.borderColor ?? 'var(--color-default)'}`,
    }
  }
  return {
    '--btn-color': props.bgColor ?? 'var(--color-default)',
    borderRadius: borderRadius.value,
    backgroundColor: props.bgColor ?? 'var(--color-default)',
    color: props.textColor ?? 'var(--color-default-foreground)',
    border: props.borderColor ? `1px solid ${props.borderColor}` : 'none',
  }
})
</script>
