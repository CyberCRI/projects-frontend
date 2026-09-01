import type { UserForm } from 'shared-projects-frontend/models'
import { NULL_CONTENT } from '~/functs/constants'
import { helpers } from '@vuelidate/validators'
import { requiredContent } from '~/form/base'

export const defaultProfileFormBio = () => {
  return {
    short_description: '',
    description: NULL_CONTENT,
  }
}

type ProfileFormBio = Pick<UserForm, 'description' | 'short_description'>

export const useProfileFormBio = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    description: {
      required: helpers.withMessage(t('profile.form.content.required'), requiredContent),
    },
  }))

  return useForm<ProfileFormBio>({
    rules,
    default: defaultProfileFormBio(),
    ...options,
  })
}
