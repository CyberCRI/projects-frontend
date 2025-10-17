import useValidate from '@vuelidate/core'
import { debounce } from 'es-toolkit'

type OptionsForm = {
  default?: object
  rules?: object
  validateTimeout?: number
  onClean: (data: object) => object
}

type UseFormResult = {
  form: Ref<object>
  isValid: Ref<boolean>
  errors: Ref<object>
  cleanedData: null | Ref<object>
}

/**
 * composable to facilitate the management of a form with errors/validation
 *
 * @function
 * @name useForm
 * @kind variable
 * @param {OptionsForm} options?
 * @returns {UseFormResult}
 */
const useForm = (options: OptionsForm = { onClean: (d) => d }): UseFormResult => {
  const form = ref<object>({ ...(options.default ?? {}) })

  const isValid = ref<boolean>(false)
  const v$ = useValidate(options.rules ?? {}, form)

  // debounce validate to optimize check
  const validate = debounce(() => {
    v$.value.$validate().then((v) => (isValid.value = v))
  }, options.validateTimeout ?? 200)
  watch(form, () => validate(), { deep: true })

  const errors = computed(() => {
    const err = {}
    Object.keys(form.value).forEach((k) => {
      if (v$.value[k]?.$errors) {
        err[k] = v$.value[k].$errors
      }
    })
    return err
  })

  // clean data (before send to backend)
  const cleanedData = computed(() => {
    if (!isValid) {
      return null
    }
    return options.onClean(form.value)
  })

  return {
    form,
    errors,
    isValid,
    cleanedData,
  }
}

export default useForm
