import { onClient, onClientMounted } from '~/composables/onClient'

/**
 * scrool to element in params
 *
 * @function
 * @name scrollTo
 * @kind variable
 * @param {any[]} ...args
 * @returns {any}
 * @exports
 */
export const scrollTo = onClient((node) => {
  if (!node || !node.getBoundingClientRect) return
  const nodePosition = node.getBoundingClientRect().top
  const header = document.querySelector('#APP > .header')
  const headerSize = header ? header.getBoundingClientRect().height : 0
  window.scroll({
    left: 0,
    top: window.scrollY + nodePosition - headerSize,
    behavior: 'smooth',
  })
})

export default function useScrollToTab() {
  onClientMounted(() => {
    const route = useRoute()
    const hash = route.hash
    if (hash && hash === '#tab') {
      // remove hash from url so it doen't affect shared url
      history.replaceState('', '', `${location.pathname}${location.search}`)
      nextTick(() => scrollTo(document.querySelector('.tabs-wrapper')))
    }
  })
}

/**
 * function to scroll to hash element (id="#myhash")
 *
 * @function
 * @name scrollToHash
 * @kind variable
 * @param {string} hash
 * @returns {void}
 * @exports
 */
export const scrollToHash = onClient((hash: string) => {
  const target = document.getElementById(hash)
  if (target) {
    scrollTo(target)
  }
})

/**
 * reset scrool to top
 *
 * @function
 * @name resetScroll
 * @kind variable
 * @param {any[]} ...args
 * @returns {any}
 * @exports
 */
export const resetScroll = onClient(() => window.scroll({ left: 0, top: 0, behavior: 'smooth' }))
