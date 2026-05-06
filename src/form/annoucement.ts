import type { AnnouncementForm } from '~/models/announcement.model'
import { helpers, required } from '@vuelidate/validators'
import { NULL_CONTENT } from '~/functs/constants'

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
      required: helpers.withMessage(t('form.announcement.description'), required),
    },
  }))

  return useForm<AnnouncementForm>({ default: defaultForm(), rules, ...options })
}
