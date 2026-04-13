<template>
  <Teleport defer :to="`#${context?.tablistId}`">
    <button
      :id="tabId"
      role="tab"
      type="button"
      :aria-selected="isActive"
      :aria-controls="panelId"
      :tabindex="isActive ? 0 : -1"
      :disabled="isDisabled || undefined"
      :data-value="value"
      class="relative cursor-pointer px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--rui-color-default)"
      :class="buttonClasses"
      :style="buttonStyle"
      @click="handleClick"
    >
      <slot name="label" :active="isActive" :disabled="isDisabled">
        {{ label }}
      </slot>
    </button>
  </Teleport>

  <div :id="panelId" v-show="isActive" role="tabpanel" :aria-labelledby="tabId" :tabindex="0">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import { TABS_CONTEXT_KEY, type TabProps } from './types'

defineOptions({ name: 'Tab' })

const props = withDefaults(defineProps<TabProps>(), {
  label: '',
  disabled: false,
})

const context = inject(TABS_CONTEXT_KEY)

if (import.meta.env.DEV && !context) {
  console.warn('[RogerUI/Tab] 必須在 <Tabs> 內使用。')
}

const tabId = `rui-tab-${useId()}`
const panelId = `rui-tabpanel-${useId()}`

const isActive = computed(() => context?.activeValue === props.value)
const isDisabled = computed(() => props.disabled || (context?.disabled ?? false))

const tabType = computed(() => context?.type ?? 'underline')

const buttonStyle = computed<Record<string, string> | undefined>(() => {
  if (tabType.value !== 'border') return undefined
  const result: Record<string, string> = {}
  if (isActive.value) {
    const color = context?.activeColor
    if (!color) return undefined
    result['backgroundColor'] = color
  } else {
    const color = context?.inactiveColor
    if (!color) return undefined
    result['backgroundColor'] = color
  }
  return result
})

const buttonClasses = computed(() => {
  const classes: string[] = []
  const type = tabType.value

  if (isDisabled.value) {
    classes.push('cursor-not-allowed opacity-50')
  }

  if (type === 'border') {
    classes.push('rounded-t-sm border border-(--rui-color-tab-border) border-b-0')
    if (isActive.value) {
      classes.push(
        'relative z-[1] -mb-px border-b-(--rui-color-surface) bg-(--rui-color-surface) text-(--rui-color-tab-text-active)',
      )
    } else {
      classes.push(
        'bg-(--rui-color-tab-hover) text-(--rui-color-tab-text)',
        !isDisabled.value ? 'hover:bg-(--rui-color-surface-hover)' : '',
      )
    }
    return classes.filter(Boolean)
  }

  if (!isDisabled.value) {
    classes.push('hover:bg-(--rui-color-tab-hover)')
  }

  if (type === 'none') {
    classes.push('text-(--rui-color-tab-text)')
  } else {
    // underline (default)
    if (isActive.value) {
      classes.push('text-(--rui-color-tab-text-active)')
    } else {
      classes.push('text-(--rui-color-tab-text)')
    }
  }

  return classes
})

function handleClick(): void {
  if (isDisabled.value) return
  context?.select(props.value)
}
</script>
