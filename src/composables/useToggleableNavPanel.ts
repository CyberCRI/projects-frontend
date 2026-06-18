import { onClient, onClientUnmounted } from '~/composables/onClient'

// TODO: use onMediaChange
export default function useToggleableNavPanel(uniqueId, breakpoint = 768) {
  const isNavCollapsed = ref(window?.innerWidth < breakpoint)
  const toggleNavPanel = () => {
    isNavCollapsed.value = !isNavCollapsed.value
  }

  const collapseIfUnderBreakpoint = () => {
    if (window?.innerWidth < breakpoint) {
      isNavCollapsed.value = true
    }
  }

  const { freezeBodyScroll, unfreezeBodyScroll } = useFreezeBodyScroll(uniqueId)

  watchEffect(
    onClient(() => {
      if (!isNavCollapsed.value) {
        if (window?.innerWidth < breakpoint) {
          freezeBodyScroll()
        }
      } else {
        unfreezeBodyScroll()
      }
    })
  )

  onResize(() => {
    if (window?.innerWidth >= breakpoint) {
      unfreezeBodyScroll()
    } else if (!isNavCollapsed.value) {
      freezeBodyScroll()
    }
  })

  // if destroyed before closing, need to cleanup un-scrollable body
  onClientUnmounted(unfreezeBodyScroll)

  return {
    isNavCollapsed,
    breakpoint,
    toggleNavPanel,
    collapseIfUnderBreakpoint,
  }
}
