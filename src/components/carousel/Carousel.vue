<template>
  <section
    role="region"
    aria-roledescription="carousel"
    :aria-label="ariaLabel"
    class="carousel relative"
  >
    <!-- 視窗 -->
    <div
      ref="viewportRef"
      class="carousel-viewport relative overflow-hidden"
      tabindex="0"
      :aria-live="ariaLive"
      aria-atomic="false"
      @keydown="handleKeydown"
      @mouseenter="isHoverPaused = pauseOnHover && autoplay"
      @mouseleave="isHoverPaused = false"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
    >
      <!-- 前後箭頭 -->
      <template v-if="showArrows">
        <button
          type="button"
          class="carousel-arrow carousel-arrow--prev"
          :disabled="!loop && internalIndex === 0"
          :aria-label="'Previous slide'"
          @click="prev"
        >
          <Icon name="chevron-left" :size="20" />
        </button>
        <button
          type="button"
          class="carousel-arrow carousel-arrow--next"
          :disabled="!loop && internalIndex === lastIndex"
          :aria-label="'Next slide'"
          @click="next"
        >
          <Icon name="chevron-right" :size="20" />
        </button>
      </template>

      <!-- slide effect: 水平軌道 -->
      <div v-if="!fade" class="carousel-track flex" :style="trackStyle">
        <div
          v-for="(item, i) in items"
          :key="i"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${i + 1} of ${items.length}`"
          :aria-hidden="!isActiveSlide(i) || undefined"
          class="carousel-slide"
        >
          <slot :item="item" :index="i" :is-active="isActiveSlide(i)" />
        </div>
      </div>

      <!-- fade effect: 疊加層 -->
      <template v-else>
        <div
          v-for="(item, i) in items"
          :key="i"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${i + 1} of ${items.length}`"
          :aria-hidden="!isActiveSlide(i) || undefined"
          class="carousel-slide-fade"
          :class="{ 'carousel-slide-fade--active': isActiveSlide(i) }"
        >
          <slot :item="item" :index="i" :is-active="isActiveSlide(i)" />
        </div>
      </template>
    </div>

    <!-- 分頁點 -->
    <div v-if="showDots" role="group" :aria-label="'Slides'" class="carousel-dots">
      <button
        v-for="(_, i) in dotPages"
        :key="i"
        type="button"
        :aria-current="currentPage === i ? 'true' : undefined"
        :aria-label="`Go to slide ${i + 1}`"
        class="carousel-dot"
        :style="dotButtonStyle(i)"
        @click="goToPage(i)"
      >
        <slot name="dot" :index="i" :is-active="currentPage === i" :on-click="() => goToPage(i)" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts" generic="T">
import { computed, onUnmounted, ref, watch } from 'vue'
import Icon from '../icon/Icon.vue'
import type { CarouselProps, CarouselEmits } from './types'

const props = withDefaults(defineProps<CarouselProps<T>>(), {
  modelValue: 0,
  fade: false,
  loop: false,
  autoplay: false,
  delay: 3000,
  pauseOnHover: true,
  showArrows: true,
  showDots: true,
  dotColor: undefined,
  ariaLabel: 'carousel',
})

const emit = defineEmits<CarouselEmits>()

// ─── 計算屬性 ───────────────────────────────────────────────────

const itemCount = computed(() => props.items.length)
const hasItems = computed(() => itemCount.value > 0)
const lastIndex = computed(() => Math.max(0, itemCount.value - 1))

// ─── 狀態 ──────────────────────────────────────────────────────

const internalIndex = ref(0)
const isAnimating = ref(false)
const isHoverPaused = ref(false)
const viewportRef = ref<HTMLElement | null>(null)

// touch swipe
let touchStartX = 0
let touchEndX = 0

// slide effect: 軌道位移樣式
const trackStyle = computed(() => ({
  transform: `translateX(-${internalIndex.value * 100}%)`,
  transition: isAnimating.value ? `transform var(--rui-carousel-transition-duration) ease` : 'none',
}))

const dotPages = computed(() => Array.from({ length: props.items.length }))

const currentPage = computed(() => internalIndex.value)

const ariaLive = computed(() => (props.autoplay && !isHoverPaused.value ? 'off' : 'polite'))

// ─── 方法 ───────────────────────────────────────────────────────

function isActiveSlide(index: number): boolean {
  return index === internalIndex.value
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function normalizeIndex(index: number): number {
  if (!hasItems.value) {
    return 0
  }

  if (props.loop) {
    return ((index % itemCount.value) + itemCount.value) % itemCount.value
  }

  return clamp(index, 0, lastIndex.value)
}

function goTo(index: number): void {
  if (isAnimating.value || !hasItems.value) return
  const prevIndex = internalIndex.value
  const next = normalizeIndex(index)

  if (next === prevIndex) return

  isAnimating.value = true
  internalIndex.value = next
  emit('update:modelValue', next)
  emit('change', next, prevIndex)

  setTimeout(() => {
    isAnimating.value = false
  }, 350)
}

function goToPage(page: number): void {
  goTo(page)
}

function next(): void {
  goTo(internalIndex.value + 1)
}

function prev(): void {
  goTo(internalIndex.value - 1)
}

function dotButtonStyle(pageIndex: number): Record<string, string> {
  const isActive = currentPage.value === pageIndex
  if (props.dotColor) {
    return {
      backgroundColor: isActive
        ? props.dotColor
        : `color-mix(in oklab, ${props.dotColor} 40%, transparent)`,
    }
  }
  return {
    backgroundColor: isActive
      ? 'var(--rui-carousel-dot-active-color)'
      : 'var(--rui-carousel-dot-color)',
  }
}

// ─── 鍵盤導航 ──────────────────────────────────────────────────

function handleKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      prev()
      break
    case 'ArrowRight':
      event.preventDefault()
      next()
      break
    case 'Home':
      event.preventDefault()
      goTo(0)
      break
    case 'End':
      event.preventDefault()
      goTo(lastIndex.value)
      break
  }
}

// ─── Touch / Swipe ─────────────────────────────────────────────

function handleTouchStart(event: TouchEvent): void {
  touchStartX = event.touches[0]?.clientX ?? 0
}

function handleTouchEnd(event: TouchEvent): void {
  touchEndX = event.changedTouches[0]?.clientX ?? 0
  const delta = touchStartX - touchEndX
  if (Math.abs(delta) > 50) {
    if (delta > 0) {
      next()
    } else {
      prev()
    }
  }
}

// ─── Autoplay ──────────────────────────────────────────────────

let timer: ReturnType<typeof setInterval> | null = null

function startAutoplay(): void {
  stopAutoplay()
  timer = setInterval(() => {
    next()
  }, props.delay)
}

function stopAutoplay(): void {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

watch(
  [() => props.autoplay, () => props.delay, isHoverPaused],
  ([autoplay, , hoverPaused]) => {
    if (autoplay && !hoverPaused) {
      startAutoplay()
    } else {
      stopAutoplay()
    }
  },
  { immediate: true },
)

onUnmounted(stopAutoplay)

// ─── v-model 同步 ───────────────────────────────────────────────

watch(
  () => props.modelValue,
  (value) => {
    const nextIndex = normalizeIndex(value)
    if (nextIndex !== internalIndex.value) {
      internalIndex.value = nextIndex
    }
  },
  { immediate: true },
)

watch(
  [itemCount, () => props.loop],
  () => {
    const nextIndex = normalizeIndex(internalIndex.value)
    if (nextIndex !== internalIndex.value) {
      internalIndex.value = nextIndex
    }
  },
  { immediate: true },
)

// ─── expose ────────────────────────────────────────────────────

defineExpose({ next, prev, goTo })
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
}

.carousel-viewport {
  width: 100%;
  outline: none;
}

.carousel-viewport:focus-visible {
  box-shadow: 0 0 0 2px var(--rui-carousel-dot-active-color);
  border-radius: 4px;
}

/* ─── slide effect ─────────────────────────────────────────────── */
.carousel-track {
  display: flex;
  will-change: transform;
}

.carousel-slide {
  flex-shrink: 0;
  width: 100%;
}

/* ─── fade effect ──────────────────────────────────────────────── */
.carousel-slide-fade {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--rui-carousel-transition-duration) ease;
  pointer-events: none;
}

.carousel-slide-fade--active {
  position: relative;
  opacity: 1;
  pointer-events: auto;
}

/* ─── 箭頭按鈕 ─────────────────────────────────────────────────── */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  color: var(--rui-carousel-nav-color);
  transition:
    opacity 150ms ease,
    background-color 150ms ease;
  z-index: 1;
}

.carousel-arrow:hover:not(:disabled) {
  filter: brightness(0.92);
}

.carousel-arrow:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.carousel-arrow--prev {
  left: 8px;
}

.carousel-arrow--next {
  right: 8px;
}

/* ─── 分頁點 ───────────────────────────────────────────────────── */
.carousel-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding-top: 12px;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  border: none;
  padding: 0;
  cursor: pointer;
  transition:
    background-color var(--rui-carousel-transition-duration) ease,
    transform 150ms ease;
}

.carousel-dot:hover {
  transform: scale(1.25);
}

.carousel-dot[aria-current='true'] {
  transform: scale(1.25);
}
</style>
