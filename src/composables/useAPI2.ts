import { merge } from 'es-toolkit'
import { defaultOptions } from '@/composables/useAPI'

const useAPI2 = (url: string, options = {}) => {
  const _options = merge(defaultOptions(), options)
  return useFetch(url, _options as any)
}

export default useAPI2
