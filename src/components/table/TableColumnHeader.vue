<template>
  <th
    scope="col"
    :style="thStyle"
    :aria-sort="ariaSortValue"
    :class="[
      'table-th',
      alignClass,
      frozen ? 'sticky left-[--col-left] bg-(--rui-color-table-header-bg)' : '',
      sortable ? 'cursor-pointer select-none' : '',
      lastFrozen ? 'frozen-last' : '',
    ]"
    @click="sortable ? emit('click') : undefined"
    @keydown.enter="sortable ? emit('click') : undefined"
    @keydown.space.prevent="sortable ? emit('click') : undefined"
    :tabindex="sortable ? 0 : undefined"
  >
    <slot>
      <span class="inline-flex items-center gap-1">
        {{ label }}
        <span
          v-if="sortable"
          aria-hidden="true"
          class="inline-flex flex-col text-[0.6rem] leading-none opacity-50"
        >
          <span :class="sorted === 'asc' ? 'opacity-100' : ''">▲</span>
          <span :class="sorted === 'desc' ? 'opacity-100' : ''">▼</span>
        </span>
      </span>
    </slot>
  </th>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TableColumnAlign, TableSortOrder } from './types'

const props = withDefaults(
  defineProps<{
    label: string
    sortable?: boolean
    sorted?: TableSortOrder | null
    align?: TableColumnAlign
    frozen?: boolean
    lastFrozen?: boolean
    colLeft?: string
    width?: string
  }>(),
  {
    sortable: false,
    sorted: null,
    align: 'left',
    frozen: false,
    lastFrozen: false,
    colLeft: '0px',
    width: undefined,
  },
)

const emit = defineEmits<{
  click: []
}>()

const ariaSortValue = computed(() => {
  if (!props.sortable) return undefined
  if (props.sorted === 'asc') return 'ascending'
  if (props.sorted === 'desc') return 'descending'
  return 'none'
})

const alignClass = computed(
  () =>
    ({
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    })[props.align],
)

const thStyle = computed(() => ({
  width: props.width ?? undefined,
  minWidth: props.width ?? undefined,
  '--col-left': props.colLeft,
}))
</script>
