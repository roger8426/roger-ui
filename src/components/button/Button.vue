<template>
  <button
    type="button"
    class="inline-flex cursor-pointer items-center justify-center rounded-full font-bold transition-all hover:brightness-90"
    :class="[sizeClasses, { 'cursor-not-allowed opacity-50': disabled }]"
    :style="colorStyle"
    :disabled="disabled"
    @click="emit('press')"
  >
    {{ label }}
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

const emit = defineEmits<{
  press: []
}>()

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
      backgroundColor: props.color ?? 'transparent',
      color: props.textColor ?? 'var(--color-primary)',
      border: `1px solid ${props.borderColor ?? 'var(--color-primary)'}`,
    }
  }
  return {
    backgroundColor: props.color ?? 'var(--color-primary)',
    color: props.textColor ?? 'white',
    border: props.borderColor ? `1px solid ${props.borderColor}` : 'none',
  }
})
</script>
