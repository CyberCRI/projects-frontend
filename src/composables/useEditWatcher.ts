import useGlobalsStore from '@/stores/useGlobals'
import isEqual from 'lodash.isequal'

import { toRaw, isRef, isReactive, isProxy } from 'vue'

export function deepToRaw<T extends Record<string, any>>(sourceObj: T): T {
  const objectIterator = (input: any): any => {
    if (Array.isArray(input)) {
      return input.map((item) => objectIterator(item))
    }
    if (isRef(input) || isReactive(input) || isProxy(input)) {
      return objectIterator(toRaw(input))
    }
    if (input && typeof input === 'object') {
      return Object.keys(input).reduce((acc, key) => {
        acc[key as keyof typeof acc] = objectIterator(input[key])
        return acc
      }, {} as T)
    }
    return input
  }

  return objectIterator(sourceObj)
}

export default function useEditWatcher(target: any) {
  const globalsStore = useGlobalsStore()
  const hasChange = ref(false)
  const isSetup = ref(false)

  // fix issues with nested reference in target
  // that fail comparing old and new value
  // (eg reference points to the same object in them, so old resolve to new)
  const _target = computed(() => JSON.parse(JSON.stringify(target.value)))

  watch(
    () => _target.value,
    (neo, old) => {
      //   console.log('watched', isSetup.value, !isEqual(neo, old), neo, old)
      if (isSetup.value && !isEqual(neo, old)) hasChange.value = true
    },
    { deep: true }
  )

  watch(
    () => hasChange.value,
    (neo) => {
      globalsStore.hasUnsavedEdit = neo
    }
  )

  return {
    hasChange,
    isSetup,
  }
}
