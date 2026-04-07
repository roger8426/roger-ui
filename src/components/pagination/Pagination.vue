<template>
  <nav aria-label="分頁導航">
    <ul class="inline-flex items-center gap-1">
      <!-- 第一頁 -->
      <li>
        <button
          type="button"
          class="pagination-btn"
          :class="[
            borderClass,
            currentPage <= 1
              ? 'cursor-not-allowed opacity-40'
              : 'cursor-pointer hover:bg-(--rui-color-surface-hover)',
          ]"
          :disabled="currentPage <= 1"
          aria-label="第一頁"
          @click="goTo(1)"
        >
          <Icon name="chevrons-left" class="h-4 w-4" />
        </button>
      </li>

      <!-- 上一頁 -->
      <li>
        <button
          type="button"
          class="pagination-btn"
          :class="[
            borderClass,
            currentPage <= 1
              ? 'cursor-not-allowed opacity-40'
              : 'cursor-pointer hover:bg-(--rui-color-surface-hover)',
          ]"
          :disabled="currentPage <= 1"
          aria-label="上一頁"
          @click="goTo(currentPage - 1)"
        >
          <Icon name="chevron-left" class="h-4 w-4" />
        </button>
      </li>

      <!-- 頁碼視窗 -->
      <li v-for="page in displayedPages" :key="page">
        <button
          type="button"
          class="pagination-btn cursor-pointer"
          :class="[
            page === currentPage ? '' : borderClass,
            page === currentPage ? 'font-bold' : 'hover:bg-(--rui-color-surface-hover)',
          ]"
          :style="page === currentPage ? activeButtonStyle : undefined"
          :aria-label="`第 ${page} 頁`"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
      </li>

      <!-- 下一頁 -->
      <li>
        <button
          type="button"
          class="pagination-btn"
          :class="[
            borderClass,
            currentPage >= totalPages
              ? 'cursor-not-allowed opacity-40'
              : 'cursor-pointer hover:bg-(--rui-color-surface-hover)',
          ]"
          :disabled="currentPage >= totalPages"
          aria-label="下一頁"
          @click="goTo(currentPage + 1)"
        >
          <Icon name="chevron-right" class="h-4 w-4" />
        </button>
      </li>

      <!-- 最末頁 -->
      <li>
        <button
          type="button"
          class="pagination-btn"
          :class="[
            borderClass,
            currentPage >= totalPages
              ? 'cursor-not-allowed opacity-40'
              : 'cursor-pointer hover:bg-(--rui-color-surface-hover)',
          ]"
          :disabled="currentPage >= totalPages"
          aria-label="最末頁"
          @click="goTo(totalPages)"
        >
          <Icon name="chevrons-right" class="h-4 w-4" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../icon/Icon.vue'
import type { PaginationProps, PaginationEmits } from './types'

const props = withDefaults(defineProps<PaginationProps>(), {
  pageSize: 10,
  currentPage: 1,
  visiblePages: 5,
  border: false,
  color: 'var(--rui-color-default)',
})

const emit = defineEmits<PaginationEmits>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const displayedPages = computed((): number[] => {
  const total = totalPages.value
  const visible = Math.min(props.visiblePages, total)
  const half = Math.floor(visible / 2)

  let start = Math.max(1, props.currentPage - half)
  const end = Math.min(total, start + visible - 1)
  // 若右側撞牆，左移 start 補足視窗寬度
  start = Math.max(1, end - visible + 1)

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const activeButtonStyle = computed(() => ({
  border: props.border ? `1px solid ${props.color}` : 'none',
  color: props.color,
}))

const borderClass = computed(() => (props.border ? 'border border-(--rui-color-border)' : ''))

function goTo(page: number): void {
  const clamped = Math.max(1, Math.min(page, totalPages.value))
  if (clamped === props.currentPage) return
  emit('update:currentPage', clamped)
  emit('change', clamped)
}
</script>

<style scoped>
.pagination-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.375rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1;
  transition: background-color 0.15s;
}
</style>
