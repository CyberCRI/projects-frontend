import type { ProjectMessageForm } from '~/models/project-message.model'
import { NULL_CONTENT } from '~/functs/constants'
import { helpers } from '@vuelidate/validators'
import { requiredContent } from '~/form/base'

export const defaultProjectMessageForm = (): ProjectMessageForm => {
  return {
    content: NULL_CONTENT,
    project_id: null,
    images_ids: [],
  }
}

export const useProjectMessageForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    content: {
      required: helpers.withMessage(t('form.review.content'), requiredContent),
    },
  }))

  return useForm<ProjectMessageForm>({ default: defaultProjectMessageForm(), rules, ...options })
}
