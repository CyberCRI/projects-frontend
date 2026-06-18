/**
 * run function only if we are in clientSide
 *
 * @function
 * @name onClient
 * @kind variable
 * @param {(...any: any[]) => void) => (...args} callback
 * @param {any} any[]
 * @returns {void}
 * @exports
 */
export const onClient = (callback: (...any) => any) => {
  return (...args) => {
    if (import.meta.client) {
      return callback(...args)
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
