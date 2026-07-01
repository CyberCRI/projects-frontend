/**
 * run function only if we are in clientSide
 *
 * @constant
 * @name onClient
 * @kind variable
 * @type {<T, Args>(callback: (...any: Args[]) => T, fallback?: (...any: Args[]) => T) => (...args: any[]) => T}
 * @exports
 */
export const onClient = <T, Args extends any[]>(
  callback: (...args: Args) => T,
  fallback: ((...args: Args) => T) | T = undefined
) => {
  return (...args: Args): T => {
    if (import.meta.client) {
      return callback(...args)
    } else if (typeof fallback === 'function') {
      // @ts-expect-error ignore error
      return fallback(...args)
    } else {
      return fallback
    }
  }
}

/**
 * run onMounted only if we are in client mode
 *
 * @function
 * @name onClientMounted
 * @kind variable
 * @param {() => void} callback
 * @returns {void}
 * @exports
 */
export const onClientMounted = (callback: () => void) => {
  onMounted(onClient(callback))
}

/**
 * run onUnmounted only if we are in client mode
 *
 * @function
 * @name onClientUnmounted
 * @kind variable
 * @param {() => void} callback
 * @returns {void}
 * @exports
 */
export const onClientUnmounted = (callback: () => void) => {
  onUnmounted(onClient(callback))
}
