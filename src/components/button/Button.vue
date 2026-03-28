<template>
  <button
    type="button"
    class="inline-flex cursor-pointer items-center justify-center rounded-full font-bold transition-colors"
    :class="[sizeClasses, variantClasses, { 'cursor-not-allowed opacity-50': disabled }]"
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
  variant: 'primary',
  size: 'md',
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

const variantClasses = computed(
  () =>
    ({
      primary: 'bg-primary text-white hover:bg-primary-hover',
      secondary: 'bg-transparent text-text ring-1 ring-inset ring-border hover:bg-surface',
    })[props.variant],
)
</script>
