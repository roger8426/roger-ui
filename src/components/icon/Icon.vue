<template>
  <span
    class="icon inline-flex shrink-0 items-center justify-center"
    :style="iconStyle"
    v-html="svgContent"
    v-bind="ariaAttrs"
  />
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import type { IconProps } from './types'

const props = withDefaults(defineProps<IconProps>(), {
  size: 20,
  color: undefined,
  ariaLabel: undefined,
})

const svgModules = import.meta.glob<string>('../../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const svgContent = computed(
  () => svgModules[`../../assets/icons/${props.name}.svg`] ?? '',
)

if (import.meta.env.DEV) {
  watchEffect(() => {
    if (!svgModules[`../../assets/icons/${props.name}.svg`]) {
      console.warn(`[Icon] 找不到圖示 "${props.name}"，請確認 src/assets/icons/${props.name}.svg 是否存在。`)
    }
  })
}

const iconStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  color: props.color,
}))

const ariaAttrs = computed(() =>
  props.ariaLabel
    ? { role: 'img' as const, 'aria-label': props.ariaLabel }
    : { 'aria-hidden': true as const },
)
</script>

<style scoped>
.icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
