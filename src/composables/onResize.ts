import { isNil } from 'es-toolkit'

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

type ResizeElement = Ref<any> | Ref<any>[]
/**
 * mutation observer when a html(s) change size
 *
 * @function
 * @name onResizeElement
 * @kind variable
 * @param {() => void} callback
 * @param {ResizeElement} element
 * @param {Options} options?
 * @returns {void}
 * @exports
 */
export const onResizeElement = (
  callback: () => void,
  element: ResizeElement,
  options: Options = {}
) => {
  const observer = new ResizeObserver(callback)

  // iter functions to return all elements (html/template ref)
  const iterElements = function* () {
    const els = Array.isArray(element) ? element : [element]
    for (const el of els) {
      const val = unref(el)
      // val can be null / undefined
      if (!isNil(val)) {
        const htmlElement = val.$el || val
        yield htmlElement
      }
    }
  }

  watch(
    () => Array.from(iterElements()),
    () => callback()
  )

  onMounted(() => {
    iterElements().forEach((el) => {
      observer.observe(el)
    })
    if (options.immediate) {
      callback()
    }
  })

  onUnmounted(() => {
    iterElements().forEach((el) => {
      observer.unobserve(el)
    })
    observer.disconnect()
  })
}
