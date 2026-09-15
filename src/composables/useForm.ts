import type { ErrorObject, useVuelidate, ValidationArgs } from '@vuelidate/core'
import { difference, groupBy, isEqual, isNil } from 'es-toolkit'
import type { RefOrRaw } from '~/interfaces/utils'
import useValidate from '@vuelidate/core'
import { v4 as uuidv4 } from 'uuid'
import type { ModelRef } from 'vue'

export type OptionsForm<T, CleanResult> = {
  default?: T
  rules?: RefOrRaw<ValidationArgs<T> | object>
  lazy?: boolean
  validateTimeout?: number
  onClean?: (data: T) => CleanResult
  model?: Ref<T> | ModelRef<T>

  $scope?: boolean
}

export type UseFormResult<T, CleanResult> = {
  form: Ref<T>
  formFieldTargetIds: Ref<Record<string, string>>
  isValid: Ref<boolean>
  errors: ComputedRef<Record<keyof T, ErrorObject[]>>
  cleanedData: null | Ref<CleanResult>
  reset: (data?: T) => void
  rules?: RefOrRaw<ValidationArgs<T> | object>
  v$: ReturnType<typeof useVuelidate<T>>
  jumpToFirstError: () => void
}

const differencesObjects = (obj: any, obj2: any): string[] => {
  obj ??= {}
  obj2 ??= {}
  const key = Object.keys(obj)
  const key2 = Object.keys(obj2)

  const diff = difference(key, key2)

  key.forEach((k) => {
    if (!isEqual(obj[k], obj2[k])) {
      diff.push(k)
    }
  })
  key2.forEach((k) => {
    if (!isEqual(obj[k], obj2[k])) {
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
  const form = ref<T>({
    ...options.default,
    ...(options.model?.value || {}),
  }) as Ref<T>

  const _onClean = options.onClean ?? onClean

  const rules = options.rules ?? {}

  const v$ = useValidate(rules, form, {
    $scope: options.$scope ?? false,
  })

  const isValid = computed(() => !v$.value.$invalid)

  const lazy = isNil(options.lazy) ? true : options.lazy
  watch(
    () => JSON.parse(JSON.stringify(form.value)),
    (newForm, oldForm) => {
      const diffKeys = differencesObjects(newForm, oldForm)

      Object.keys(unref(options.rules ?? {})).forEach((key) => {
        if (!lazy || diffKeys.includes(key)) {
          v$.value[key]?.$touch()
        }
      })
    },
    { deep: true, immediate: !lazy }
  )

  const formFieldTargetIds = ref(
    Object.keys(form.value).reduce((acc, key) => {
      acc[key] = 'form-field-target-' + uuidv4()
      return acc
    }, {})
  )

  const errors = computed(() => {
    const err = {}
    Object.keys(form.value).forEach((k) => {
      err[k] = []
    })
    return {
      ...err,
      ...groupBy(v$.value.$errors, (el) => el.$property),
    } as Record<keyof T, ErrorObject[]>
  })

  const cleanedData = ref<CleanResult>()

  watch(
    [form, isValid],
    () => {
      const formContent = { ...form.value }

      let cleanded = null
      if (isValid.value) {
        cleanded = _onClean(formContent)
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

  // re-set model/form
  if (options.model) {
    const model = options.model

    watch(
      model,
      (value) => {
        if (!isEqual(value, form.value)) {
          reset({ ...value })
        }
      },
      { deep: true }
    )

    watch(
      form,
      (value) => {
        if (!isEqual(value, model.value)) {
          model.value = { ...value }
        }
      },
      { deep: true }
    )
  }

  // reset validator
  reset(form.value)

  /**
   * Scroll to the first field with error
   *
   * @name jumpToFirstError
   * @kind variable
   * @memberof useForm
   * @returns {void}
   */
  const jumpToFirstError = () => {
    const fieldsWithError = Object.entries(errors.value)
      .filter(([_, value]) => (value as Array<any>).length)
      .map(([key]) => key)
    if (fieldsWithError.length) {
      const firstErrorKey = fieldsWithError[0]
      const firstErrorTarget = formFieldTargetIds.value[firstErrorKey]
      if (firstErrorTarget) {
        const target = document.querySelector(`[data-field-target="${firstErrorTarget}"]`)
        if (target)
          target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
        else
          console.error(
            '[useForm] No matching element for key ' +
              firstErrorKey +
              ' with target id ' +
              firstErrorTarget
          )
      } else {
        console.error('[useForm] No matching target for ' + firstErrorKey)
      }
    }
  }

  return {
    form,
    formFieldTargetIds,
    errors,
    isValid,
    cleanedData,
    reset,
    rules,
    v$,
    jumpToFirstError,
  }
}

export default useForm
