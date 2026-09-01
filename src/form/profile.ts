import { email, helpers, required, url } from '@vuelidate/validators'
import { NULL_CONTENT, VALID_NAME_REGEX } from '~/functs/constants'
import type { UserForm } from 'shared-projects-frontend/models'
import { checkPhoneNumber, requiredContent } from '~/form/base'
import type { Rules } from '~/interfaces/utils'

export const defaultProfileFormBio = () => {
  return {
    short_description: '',
    description: NULL_CONTENT,
  }
}

export const defaultProfileForm = (): UserForm => {
  return {
    sdgs: [],
    email: '',
    family_name: '',
    given_name: '',
    job: '',
    profile_picture: null,
    imageSizes: null,
    pronouns: '',
    website: '',
    landline_phone: '',
    mobile_phone: '',
    linkedin: '',
    location: '',
    skype: '',
    facebook: '',
  }
}

export const useProfileForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(
    () =>
      ({
        given_name: {
          required: helpers.withMessage(t('profile.edit.general.first-name.is-required'), required),
          alphanum: helpers.withMessage(
            t('profile.edit.general.no-special-characters'),
            helpers.regex(VALID_NAME_REGEX)
          ),
        },
        family_name: {
          required: helpers.withMessage(t('profile.edit.general.last-name.is-required'), required),
          alphanum: helpers.withMessage(
            t('profile.edit.general.no-special-characters'),
            helpers.regex(VALID_NAME_REGEX)
          ),
        },
        email: {
          required: helpers.withMessage(
            t('profile.edit.general.professional-email.is-required'),
            required
          ),
          email: helpers.withMessage(t('profile.edit.general.professional-email.is-email'), email),
        },
        landline_phone: {
          phone: checkPhoneNumber,
        },
        mobile_phone: {
          phone: checkPhoneNumber,
        },
        job: {
          required: helpers.withMessage(t('profile.edit.general.title.is-required'), required),
        },
        website: {
          url: helpers.withMessage(t('profile.edit.general.personal-webpage.is-url'), url),
        },
        linkedin: {
          url: helpers.withMessage(t('profile.edit.general.linkedin.is-url'), url),
        },
      }) satisfies Rules<UserForm>
  )

  return useForm<UserForm>({
    rules,
    default: defaultProfileForm(),
    ...options,
  })
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
