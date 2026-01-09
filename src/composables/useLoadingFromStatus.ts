/**
 * convert status from useFetch to boolean
 *
 * @function
 * @name useLoadingFromStatus
 * @kind variable
 * @param {any} status
 * @returns {globalThis.ComputedRef<boolean>}
 */
const useLoadingFromStatus = (status: Ref<'pending' | 'error' | 'success' | 'idle'>) => {
  const loading = computed(() => ['idle', 'pending'].includes(status.value))

  return loading
}

export default useLoadingFromStatus
