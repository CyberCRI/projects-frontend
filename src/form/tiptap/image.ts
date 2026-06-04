import { helpers, required } from '@vuelidate/validators'
import { isImageFile, maxFileSize } from '~/form/base'
import { MAX_FILE_SIZE } from '~/functs/constants'

export const useTipTapImageForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    file: {
      required: helpers.withMessage(t('resource.file.form.required-image'), required),
      maxFileSize: maxFileSize(MAX_FILE_SIZE),
      isImageFile,
    },
  }))

  return useForm({
    rules,
    default: {
      file: null,
    },
    lazy: true,
    ...options,
  })
}
