/**
 * convert status from useFetch to boolean
 *
 * @function
 * @name useLoadingFromStatus
 * @kind variable
 * @param {any} status
 * @returns {globalThis.ComputedRef<boolean>}
 */
const useLoadingFromStatus = (status) => {
  const loading = computed(() => ['idle', 'pending'].includes(status))

  return loading
}

export default useLoadingFromStatus
