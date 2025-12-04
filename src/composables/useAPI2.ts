import { merge } from 'es-toolkit'
import { defaultOptions } from '@/composables/useAPI'

type Params = Parameters<typeof useFetch>

const useAPI2 = <DataT>(url: Params[0], options: Params[1] = {}) => {
  const _options = merge(defaultOptions(), options)
  return useFetch<DataT>(url, _options as any)
}

export default useAPI2
