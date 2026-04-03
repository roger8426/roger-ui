<template>
  <span
    class="inline-flex items-center justify-center font-medium"
    :class="sizeClasses"
    :style="colorStyle"
    :role="value !== undefined && !dot ? 'status' : undefined"
    :aria-label="value !== undefined && !dot ? `${displayValue} 則通知` : undefined"
  >
    <template v-if="!dot">
      <template v-if="value !== undefined">{{ displayValue }}</template>
      <slot v-else />
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BadgeProps } from './types'

defineOptions({ name: 'Badge' })

const props = withDefaults(defineProps<BadgeProps>(), {
  dot: false,
  max: 99,
  size: 'md',
  outline: false,
  radius: 'full',
})

const displayValue = computed(() => {
  if (props.value === undefined) return ''
  return props.value > props.max ? `${props.max}+` : String(props.value)
})

const sizeClasses = computed(() => {
  if (props.dot) {
    return ({ sm: 'h-1.5 w-1.5', md: 'h-2 w-2', lg: 'h-2.5 w-2.5' })[props.size]
  }
  return ({ sm: 'px-1.5 h-4 text-xs', md: 'px-2 h-5 text-xs', lg: 'px-2.5 h-6 text-sm' })[
    props.size
  ]
})

const borderRadius = computed(() =>
  props.radius === 'full' ? '9999px' : `${props.radius}px`,
)

const colorStyle = computed(() => {
  if (props.outline) {
    return {
      borderRadius: borderRadius.value,
      backgroundColor: 'transparent',
      color: props.textColor ?? 'var(--rui-color-default)',
      border: `1px solid ${props.borderColor ?? 'var(--rui-color-default)'}`,
    }
  }
  return {
    borderRadius: borderRadius.value,
    backgroundColor: props.bgColor ?? 'var(--rui-color-default)',
    color: props.textColor ?? 'var(--rui-color-default-foreground)',
    border: props.borderColor ? `1px solid ${props.borderColor}` : 'none',
  }
})
</script>
