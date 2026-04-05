import { onBeforeUnmount, ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ')

function getVisible(el: HTMLElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((node) => {
    if (getComputedStyle(node).visibility === 'hidden') return false
    if (getComputedStyle(node).display === 'none') return false
    // offsetParent === null 代表 display:none 於整個祖先鏈中
    return node.offsetParent !== null
  })
}

export function useFocusTrap() {
  const containerRef = ref<HTMLElement | null>(null)
  let enabled = false

  function handleKeyDown(e: KeyboardEvent) {
    if (!enabled || !containerRef.value || e.key !== 'Tab') return

    const focusable = getVisible(containerRef.value)
    if (focusable.length === 0) {
      e.preventDefault()
      return
    }

    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  function enable(el: HTMLElement) {
    disable()
    containerRef.value = el
    enabled = true
    document.addEventListener('keydown', handleKeyDown)
  }

  function disable() {
    enabled = false
    document.removeEventListener('keydown', handleKeyDown)
    containerRef.value = null
  }

  function focusFirst() {
    if (!containerRef.value) return
    const focusable = getVisible(containerRef.value)
    focusable[0]?.focus()
  }

  onBeforeUnmount(disable)

  return { enable, disable, focusFirst }
}
