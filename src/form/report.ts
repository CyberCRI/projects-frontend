import { email, helpers, required, url } from '@vuelidate/validators'
import type { ReportForm } from '~/models/report.model'

export const defaultReportForm = (): ReportForm => {
  return {
    title: '',
    message: '',
    url: '',
    reported_by: null,
    recaptcha: null,
  }
}

export const useReportForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    message: {
      required: helpers.withMessage(t('form.report.message'), required),
    },
    url: {
      required: helpers.withMessage(t('form.report.url.required'), required),
      url: helpers.withMessage(t('form.report.url.format'), url),
    },
    reported_by: {
      required: helpers.withMessage(t('form.report.email.required'), required),
      email: helpers.withMessage(t('form.report.email.format'), email),
    },
    title: {
      required: helpers.withMessage(t('form.report.title'), required),
    },
    recaptcha: {
      required: helpers.withMessage(t('form.recaptcha.required'), required),
    },
  }))

  return useForm<ReportForm>({ default: defaultReportForm(), rules, ...options })
}
