import { helpers, required, requiredIf } from '@vuelidate/validators'
import { urlCheck } from '~/form/base'

export const useTipTapLinkForm = (mode: Ref<'add' | 'edit'>, options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    text: {
      required: helpers.withMessage(t('form.report.message'), requiredIf(mode.value === 'add')),
    },
    href: {
      required: helpers.withMessage(t('form.report.url.required'), required),
      url: helpers.withMessage(t('form.report.url.format'), urlCheck),
    },
  }))

  return useForm({
    rules,
    default: {
      text: '',
      href: '',
    },
    lazy: true,
    ...options,
  })
}
