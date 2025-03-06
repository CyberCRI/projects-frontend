/* eslint-disable vue/no-unused-properties */
/* eslint-disable vue/require-name-property */

import debounce from 'lodash.debounce'
export default function useViewportWidth() {
    const viewportWidth = useState(() => 0)

    const getWindowWidth = () => {
        if (import.meta.client) {
            console.log('ggg')
            viewportWidth.value = window.innerWidth
        }
    }

    const debouncedGetWindowWidth = getWindowWidth

    onMounted(() => {
        if (import.meta.client) {
            console.log('ffff')
            getWindowWidth()
            window.addEventListener('resize', debouncedGetWindowWidth)
        }
    })

    onUnmounted(() => {
        if (import.meta.client) window.removeEventListener('resize', debouncedGetWindowWidth)
    })

    const isMobile = computed(() => {
        return viewportWidth.value <= 414
    })

    const isTablet = computed(() => {
        return viewportWidth.value > 414 && viewportWidth.value < 1024
    })

    const isDesktop = computed(() => {
        return viewportWidth.value > 1024
    })

    return { viewportWidth, isMobile, isTablet, isDesktop }
}
