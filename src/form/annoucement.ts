import type { AnnouncementApplyForm, AnnouncementForm } from '~/models/announcement.model'
import { helpers, required, email } from '@vuelidate/validators'
import { NULL_CONTENT } from '~/functs/constants'
import { requiredContent } from '~/form/base'

export const defaultForm = (): AnnouncementForm => {
  return {
    title: '',
    description: NULL_CONTENT,
    deadline: new Date(),
    type: 'na',
    is_remunerated: false,
    status: 'open',
    project: null,
  }
}

export const useAnnouncementForm = (options = {}) => {
  const { t } = useNuxtI18n()
  const rules = computed(() => ({
    title: {
      required: helpers.withMessage(t('form.announcement.title'), required),
    },
    description: {
      required: helpers.withMessage(t('form.announcement.description'), requiredContent),
    },
  }))

  return useForm<AnnouncementForm>({ default: defaultForm(), rules, ...options })
}

export const defaultAnnouncementReplyForm = (): AnnouncementApplyForm => {
  return {
    applicant_firstname: '',
    applicant_name: '',
    applicant_email: '',
    applicant_message: '',
    announcement_id: null,
    project_id: null,
    recaptcha: null,
  }
}

export const useAnnouncementReplyForm = (options = {}) => {
  const { t } = useNuxtI18n()
  const rules = computed(() => ({
    applicant_firstname: {
      required: helpers.withMessage(t('form.reply-announcement.first-name'), required),
    },
    applicant_name: {
      required: helpers.withMessage(t('form.reply-announcement.last-name'), required),
    },
    applicant_email: {
      required: helpers.withMessage(t('form.reply-announcement.email.required'), required),
      email: helpers.withMessage(t('form.reply-announcement.email.format'), email),
    },
    applicant_message: {
      required: helpers.withMessage(t('form.reply-announcement.description'), requiredContent),
    },
    recaptcha: { required },
  }))

  return useForm<AnnouncementApplyForm>({
    default: defaultAnnouncementReplyForm(),
    rules,
    ...options,
  })
}
