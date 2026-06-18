import type { ErrorObject, useVuelidate } from '@vuelidate/core'
import { difference, isNil } from 'es-toolkit'
import useValidate from '@vuelidate/core'

export type OptionsForm<T, CleanResult> = {
  default?: T
  rules?: object
  lazy?: boolean
  validateTimeout?: number
  onClean?: (data: T) => CleanResult
  model?: Ref<T>
}

export type UseFormResult<T, CleanResult> = {
  form: Ref<T>
  isValid: Ref<boolean>
  errors: ComputedRef<Record<keyof T, ErrorObject[]>>
  cleanedData: null | Ref<CleanResult>
  reset: (data?: T) => void
  v$: ReturnType<typeof useVuelidate<T>>
}

const differencesObjects = (obj: any, obj2: any): string[] => {
  obj ??= {}
  obj2 ??= {}
  const key = Object.keys(obj)
  const key2 = Object.keys(obj2)

  const diff = difference(key, key2)

  key.forEach((k) => {
    if (obj[k] !== obj2[k]) {
      diff.push(k)
    }
  })
  key2.forEach((k) => {
    if (obj[k] !== obj2[k]) {
      diff.push(k)
    }
  })

  return Array.from(new Set(diff))
}

const onClean = (d) => d

/**
 * composable to facilitate the management of a form with errors/validation
 *
 * @function
 * @name useForm
 * @kind variable
 * @param {OptionsForm} options?
 * @returns {UseFormResult}
 */
const useForm = <T extends object, CleanResult = T>(
  options: OptionsForm<T, CleanResult> = { onClean }
): UseFormResult<T, CleanResult> => {
  const def = {
    ...options.default,
    ...unref(options.model?.value ?? {}),
  } as T

  const form = ref<T>(def) as Ref<T>
  const _onClean = options.onClean ?? onClean

  const v$ = useValidate(options.rules ?? {}, form, {
    $scope: false,
  })
  const isValid = computed(() => !v$.value.$invalid)

  const lazy = isNil(options.lazy) ? true : !options.lazy
  watch(
    () => ({ ...unref(form) }),
    (newForm, oldForm) => {
      const diffKeys = differencesObjects(newForm, oldForm)

      Object.keys(unref(options.rules ?? {})).forEach((key) => {
        if (lazy || diffKeys.includes(key)) {
          v$.value[key]?.$touch()
        }
      })
    },
    { deep: true, immediate: lazy }
  )

  const errors = computed(() => {
    const err = {}
    Object.keys(form.value).forEach((k) => {
      err[k] = v$.value[k]?.$errors || []
    })
    return err as Record<keyof T, ErrorObject[]>
  })

  const cleanedData = ref<CleanResult>()

  watch(
    [form, isValid],
    () => {
      const formContent = { ...toRaw(form.value) }

      let cleanded = null
      if (isValid.value) {
        cleanded = _onClean(formContent)
      }
      if (options.model) {
        options.model.value = cleanded
      }
      cleanedData.value = cleanded
    },
    { deep: true, immediate: true }
  )

  //
  /**
   * reset form value with new value and call $reset in vulidate
   *
   * @function
   * @name reset
   * @kind variable
   * @memberof useForm
   * @param {T} newData?
   * @returns {void}
   */
  const reset = (newData?: T) => {
    form.value = newData ?? ({} as T)
    v$.value.$reset()
  }

  return {
    form,
    errors,
    isValid,
    cleanedData,
    reset,
    v$,
  }
}

export default useForm
