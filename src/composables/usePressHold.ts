import { onScopeDispose } from 'vue'

const HOLD_MS = 500
const REPEAT_MS = 400

/**
 * Pointer handlers for a tap zone: tap → onTap, hold → onHold now and every REPEAT_MS.
 * Spread on an element with v-on="handlers". Keyboard (click with detail 0) counts as a tap.
 */
export function usePressHold(onTap: () => void, onHold: () => void) {
  let delayTimer: ReturnType<typeof setTimeout> | undefined
  let repeatTimer: ReturnType<typeof setInterval> | undefined
  let pressing = false
  let held = false

  function stop() {
    pressing = false
    clearTimeout(delayTimer)
    clearInterval(repeatTimer)
  }

  onScopeDispose(stop)

  return {
    pointerdown(e: PointerEvent) {
      if (e.button !== 0) return
      stop()
      pressing = true
      held = false
      delayTimer = setTimeout(() => {
        held = true
        onHold()
        repeatTimer = setInterval(onHold, REPEAT_MS)
      }, HOLD_MS)
    },
    pointerup() {
      const isTap = pressing && !held
      stop()
      if (isTap) onTap()
    },
    pointerleave: stop,
    pointercancel: stop,
    click(e: MouseEvent) {
      if (e.detail === 0) onTap()
    },
    // Suppress the native long-press menu; hold is handled above.
    contextmenu(e: Event) {
      e.preventDefault()
    },
  }
}
