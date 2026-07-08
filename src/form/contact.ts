import type { ContactForm } from 'shared-projects-frontend/models'
import { email, helpers, required } from '@vuelidate/validators'

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
