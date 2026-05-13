<template>
  <div
    :id="ids.panelId"
    v-show="isActive"
    role="tabpanel"
    :aria-labelledby="ids.tabId"
    :tabindex="0"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { TABS_CONTEXT_KEY, type TabProps } from './types'

defineOptions({ name: 'Tab' })

const props = withDefaults(defineProps<TabProps>(), {
  label: '',
  disabled: false,
})

const context = inject(TABS_CONTEXT_KEY)
if (!context) {
  throw new Error('[RogerUI/Tab] 必須在 <Tabs> 內使用。')
}

const ids = computed(() => context.getIds(props.value))
const isActive = computed(() => context.activeValue === props.value)
</script>
