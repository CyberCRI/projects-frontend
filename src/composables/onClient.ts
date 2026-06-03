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
  onMounted(() => {
    if (import.meta.client) {
      callback()
    }
  })
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
  onUnmounted(() => {
    if (import.meta.client) {
      callback()
    }
  })
}
