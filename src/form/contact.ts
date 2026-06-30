import { email, helpers, required } from '@vuelidate/validators'
import type { ContactForm } from '@/models/report.model'

export const defaultContactForm = (): ContactForm => ({
  subject: '',
  email: '',
  content: '',
  recaptcha: null,
})

export const useContactForm = (options = {}) => {
  const { t } = useNuxtI18n()
  const rules = computed(() => ({
    subject: {
      required: helpers.withMessage(t('form.report.message'), required),
    },
    email: {
      required: helpers.withMessage(t('form.report.email.required'), required),
      email: helpers.withMessage(t('form.report.email.format'), email),
    },
    content: {
      required: helpers.withMessage(t('form.report.content'), required),
    },
    recaptcha: {
      required: helpers.withMessage(t('form.recaptcha.required'), required),
    },
  }))

  return useForm<ContactForm>({ default: defaultContactForm(), rules, ...options })
}
