/**
 * convert status from useFetch to boolean
 *
 * @function
 * @name useLoadingFromStatus
 * @kind variable
 * @param {any} status
 * @returns {globalThis.ComputedRef<boolean>}
 */

import { AsyncDataRequestStatus } from 'nuxt/app'

const useLoadingFromStatus = (status: Ref<AsyncDataRequestStatus>) => {
  const loading = computed(() => ['idle', 'pending'].includes(status.value))

  return loading
}

export default useLoadingFromStatus
