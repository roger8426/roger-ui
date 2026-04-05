import { onBeforeUnmount } from 'vue'

export function useRestoreFocus() {
  let savedEl: HTMLElement | null = null

  function save() {
    savedEl = document.activeElement instanceof HTMLElement ? document.activeElement : null
  }

  function restore() {
    savedEl?.focus()
    savedEl = null
  }

  onBeforeUnmount(restore)

  return { save, restore }
}
