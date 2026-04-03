<template>
  <div
    ref="cardRef"
    class="flex flex-col overflow-hidden transition-all duration-200"
    :class="hoverableClasses"
    :style="cardStyle"
    :role="hoverable ? 'button' : undefined"
    :tabindex="hoverable ? 0 : undefined"
    @keydown="handleKeyActivate"
  >
    <div v-if="slots.cover" class="shrink-0">
      <slot name="cover" />
    </div>
    <div
      v-if="slots.header"
      class="shrink-0 border-b border-(--rui-color-card-border, oklch(90% 0.005 264))"
      :style="{ padding: `${padding}px` }"
    >
      <slot name="header" />
    </div>
    <div class="flex-1" :style="{ padding: `${padding}px` }">
      <slot />
    </div>
    <div
      v-if="slots.footer"
      class="shrink-0 border-t border-(--rui-color-card-border, oklch(90% 0.005 264))"
      :style="{ padding: `${padding}px` }"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import type { CardProps } from './types'

defineOptions({ name: 'Card' })

const props = withDefaults(defineProps<CardProps>(), {
  shadow: 'md',
  padding: 16,
  radius: 12,
  hoverable: false,
})

const slots = useSlots()
const cardRef = ref<HTMLDivElement | null>(null)

function handleKeyActivate(event: KeyboardEvent) {
  if (!props.hoverable) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    cardRef.value?.click()
  }
}

const shadowMap = {
  none: 'none',
  sm: 'var(--rui-shadow-card-sm)',
  md: 'var(--rui-shadow-card-md)',
  lg: 'var(--rui-shadow-card-lg)',
} as const

const borderRadius = computed(() => (props.radius === 'full' ? '9999px' : `${props.radius}px`))

const cardStyle = computed(() => ({
  backgroundColor: props.bgColor ?? 'var(--rui-color-card-bg)',
  borderRadius: borderRadius.value,
  boxShadow: shadowMap[props.shadow],
}))

const hoverableClasses = computed(() => {
  if (!props.hoverable) return ''
  return props.shadow === 'none'
    ? 'hover:-translate-y-0.5 cursor-pointer'
    : 'hover:-translate-y-0.5 hover:shadow-(--rui-shadow-card-hover) cursor-pointer'
})
</script>
