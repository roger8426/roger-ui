import { onBeforeUnmount } from 'vue'

export function useScrollLock() {
  let savedY = 0
  let locked = false

  function lock() {
    if (locked) return
    savedY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedY}px`
    document.body.style.width = '100%'
    document.body.style.overflowY = 'scroll'
    locked = true
  }

  function unlock() {
    if (!locked) return
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflowY = ''
    window.scrollTo(0, savedY)
    locked = false
  }

  onBeforeUnmount(unlock)

  return { lock, unlock }
}
