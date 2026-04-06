<template>
  <div class="flex flex-col">
    <button
      :id="headerId"
      type="button"
      class="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--rui-color-default)"
      :class="headerClasses"
      :aria-expanded="open"
      :aria-controls="panelId"
      :disabled="isDisabled"
      @click="handleToggle"
    >
      <slot name="title">
        <span>{{ title }}</span>
      </slot>
      <Icon
        name="chevron-down"
        :size="16"
        class="shrink-0 transition-transform duration-300 ease-in-out"
        :class="{ 'rotate-180': open }"
      />
    </button>

    <div
      :id="panelId"
      role="region"
      :aria-labelledby="headerId"
      class="grid transition-[grid-template-rows] duration-300 ease-in-out"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <div class="px-4 py-3 text-sm text-(--rui-color-text-secondary)">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import Icon from '../icon/Icon.vue'
import { ACCORDION_CONTEXT_KEY, type AccordionItemProps } from './types'

defineOptions({ name: 'AccordionItem' })

const props = withDefaults(defineProps<AccordionItemProps>(), {
  title: '',
  disabled: false,
})

const context = inject(ACCORDION_CONTEXT_KEY)

if (import.meta.env.DEV && !context) {
  console.warn('[RogerUI/AccordionItem] 必須在 <Accordion> 內使用。')
}

const open = computed(() => context?.isOpen(props.value) ?? false)
const isDisabled = computed(() => props.disabled || (context?.disabled ?? false))

const headerId = computed(() => `accordion-header-${props.value}`)
const panelId = computed(() => `accordion-panel-${props.value}`)

const headerClasses = computed(() => {
  if (isDisabled.value) {
    return 'cursor-not-allowed opacity-50'
  }
  return 'hover:bg-(--rui-color-surface-hover) active:brightness-95'
})

function handleToggle(): void {
  context?.toggle(props.value)
}
</script>
