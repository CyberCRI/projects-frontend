import utils from '@/functs/functions'

export default function useProjectNav(slugOrId) {
  const router = useRouter()
  const route = useRoute()
  const goToProjectTab = async (tab, dontFocusTab = false) => {
    let tabPath = `/projects/${slugOrId}/${tab}`
    if (route.path !== tabPath) {
      if (!dontFocusTab) tabPath += '#tab'
      return router.push(tabPath)
    } else {
      // still add hash to url
      if (route && route.hash !== '#tab') {
        tabPath += '#tab'
        await router.push(tabPath)
      }
      // however previous route change dont trigger beforeRouteEnter
      if (!dontFocusTab) {
        utils.scrollTo(document.querySelector('.tabs-wrapper'))
      }
      return Promise.resolve()
    }
  }
  return { goToProjectTab }
}
