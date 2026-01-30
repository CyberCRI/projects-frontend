import useValidate from '@vuelidate/core'

type OptionsForm<T, CleanResult> = {
  default?: T
  rules?: object
  validateTimeout?: number
  onClean?: (data: T) => CleanResult
  model?: Ref<T>
}

export type UseFormResult<T, CleanResult> = {
  form: Ref<T>
  isValid: Ref<boolean>
  errors: ComputedRef<{
    [key: string]: any
  }>
  cleanedData: null | Ref<CleanResult>
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
const useForm = <T, CleanResult = T>(
  options: OptionsForm<T, CleanResult> = { onClean }
): UseFormResult<T, CleanResult> => {
  const def = {
    ...(options.default ?? {}),
    ...unref(options.model?.value ?? {}),
  } as T

  const form = ref<T>(def) as Ref<T>
  const _onClean = options.onClean ?? onClean

  const isValid = ref<boolean>(false)
  const v$ = useValidate(options.rules ?? {}, form)

  const validate = () => v$.value.$validate().then((v) => (isValid.value = v))
  // const debounceValidate = debounce(validate, options.validateTimeout ?? 50)
  watch(form, () => validate(), { deep: true, immediate: true })

  const errors = computed<{
    [key: string]: string[]
  }>(() => {
    const err = {}
    Object.keys(form.value).forEach((k) => {
      if (v$.value[k]?.$errors) {
        err[k] = v$.value[k].$errors
      }
    })
    return err
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
      if (options.model) {
        options.model.value = cleanded
      }
      cleanedData.value = cleanded
    },
    { deep: true, immediate: true }
  )

  return {
    form,
    errors,
    isValid,
    cleanedData,
  }
}

export default useForm
