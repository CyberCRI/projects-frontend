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
  const isSetup = ref(false)

  const toPOJO = (v) => JSON.parse(JSON.stringify(v))

  // fix issues with nested reference in target
  // that fail comparing old and new value
  // (eg reference points to the same object in them, so old resolve to new)

  const targetMemo = ref(toPOJO(target.value))

  const _target = computed(() => toPOJO(target.value))
  const _targetMemo = computed(() => toPOJO(targetMemo.value))

  const hasChange = computed(() => !isEqual(_target.value, _targetMemo.value))

  watch(
    () => hasChange.value,
    (neo) => {
      console.log('watched', isSetup.value, neo, _target.value, _targetMemo.value)
      if (isSetup.value) globalsStore.hasUnsavedEdit = neo
    }
  )

  const stopEditWatcher = () => {
    isSetup.value = false
    globalsStore.hasUnsavedEdit = false
  }

  const startEditWatcher = () => {
    targetMemo.value = toPOJO(target.value)
    // important this must come after !
    isSetup.value = true
  }

  // onBeforeUnmount(() => {
  //   globalsStore.hasUnsavedEdit = false
  // })

  return {
    hasChange,
    isSetup,
    startEditWatcher,
    stopEditWatcher,
  }
}
