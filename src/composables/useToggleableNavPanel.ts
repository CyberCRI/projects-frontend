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

  watchEffect(() => {
    if (!import.meta.client) return
    if (!isNavCollapsed.value) {
      if (window?.innerWidth < breakpoint) {
        freezeBodyScroll()
      }
    } else {
      unfreezeBodyScroll()
    }
  })

  const onWindowResize = () => {
    if (window?.innerWidth >= breakpoint) {
      unfreezeBodyScroll()
    } else if (!isNavCollapsed.value) {
      freezeBodyScroll()
    }
  }

  onMounted(() => {
    window?.addEventListener('resize', onWindowResize)
  })

  onBeforeUnmount(() => {
    if (!import.meta.client) return
    // if destroyed before closing, need to cleanup un-scrollable body
    unfreezeBodyScroll()
    window?.removeEventListener('resize', onWindowResize)
  })

  return {
    isNavCollapsed,
    breakpoint,
    toggleNavPanel,
    collapseIfUnderBreakpoint,
  }
}
