import useValidate from '@vuelidate/core'
import { debounce } from 'es-toolkit'

type OptionsForm = {
  default?: object
  rules?: object
  validateTimeout?: number
}

type UseFormResult = {
  data: Ref<object>
  isValid: Ref<boolean>
  errors: Ref<object>
}

/**
 * easiar form check
 *
 * @function
 * @name useForm
 * @kind variable
 * @param {OptionsForm} options?
 * @returns {UseFormResult}
 */
const useForm = (options: OptionsForm = {}): UseFormResult => {
  const data = ref<object>({ ...(options.default ?? {}) })

  const isValid = ref<boolean>(false)
  const v$ = useValidate(options.rules ?? {}, data)

  // debounce validate to optimize check
  const validate = debounce(() => {
    v$.value.$validate().then((v) => (isValid.value = v))
  }, options.validateTimeout ?? 200)
  watch(data, () => validate(), { deep: true })

  const errors = computed(() => {
    const err = {}
    Object.keys(data.value).forEach((k) => {
      if (v$.value[k]?.$errors) {
        err[k] = v$.value[k].$errors
      }
    })
    return err
  })

  return {
    data,
    errors,
    isValid,
  }
}

export default useForm
