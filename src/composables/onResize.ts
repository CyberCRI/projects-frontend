type Options = {
  immediate?: boolean
}

/**
 * run callback on resize windows
 *
 * @function
 * @name onResize
 * @kind variable
 * @param {() => void} callback
 * @param {Options} options?
 * @returns {void}
 * @exports
 */
export const onResize = (callback: () => void, options: Options = {}) => {
  onMounted(() => {
    if (import.meta.client) {
      window.addEventListener('resize', callback)
      if (options.immediate) {
        callback()
      }
    }
  })

  onUnmounted(() => {
    if (import.meta.client) {
      window.removeEventListener('resize', callback)
    }
  })
}

/**
 * run callback when mediaQuery change states
 *
 * @function
 * @name onMediaChange
 * @kind variable
 * @param {string} media
 * @param {(matche: boolean) => void} callback
 * @param {Options} options?
 * @returns {void}
 * @exports
 */
export const onMediaChange = (
  media: string,
  callback: (matche: boolean) => void,
  options: Options = {}
) => {
  const eventer = window?.matchMedia(media)

  const proxyCallback = () => {
    callback(!!eventer.matches)
  }

  onMounted(() => {
    if (import.meta.client) {
      eventer.addEventListener('change', proxyCallback)
      if (options.immediate) {
        proxyCallback()
      }
    }
  })

  onUnmounted(() => {
    if (import.meta.client) {
      eventer.removeEventListener('change', proxyCallback)
    }
  })
}
