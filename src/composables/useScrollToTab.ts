import funct from '@/functs/functions'

function scrollToTab() {
    funct.scrollTo(document.querySelector('.tabs-wrapper'))
}

export default function useScrollToTab() {
    onMounted(() => {
        const route = useRoute()
        const hash = route.hash
        if (hash && hash === '#tab') {
            // remove hash from url so it doen't affect shared url
            history.replaceState('', '', `${location.pathname}${location.search}`)
            nextTick(scrollToTab)
        }
    })
}
