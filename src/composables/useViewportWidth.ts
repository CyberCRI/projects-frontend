import { onMediaChange } from '@/composables/onResize'

export default function useViewportWidth() {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  onMediaChange('(max-width: 414px)', (matches) => (isMobile.value = matches), { immediate: true })
  onMediaChange(
    '(min-width: 414px) and (max-width: 1024px)',
    (matches) => (isTablet.value = matches),
    { immediate: true }
  )
  onMediaChange('(min-width: 1024px)', (matches) => (isDesktop.value = matches), {
    immediate: true,
  })

  return { isMobile, isTablet, isDesktop }
}
