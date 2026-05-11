import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import type { ProjectForm } from '~/models/project.model'
import { NULL_CONTENT } from '~/functs/constants'
import { pick } from 'es-toolkit'

export const defaultProjectForm = (): ProjectForm => {
  return {
    title: '',
    purpose: '',
    categories: [],
    description: NULL_CONTENT,
    language: 'en',
    tags: [],
  }
}

export const useProjectForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage(t('project.form.title-errors.required'), required),
      maxLengthValue: helpers.withMessage(t('project.form.title-errors.max'), maxLength(120)),
    },
    purpose: {
      required: helpers.withMessage(t('project.form.purpose-errors.required'), required),
      minLengthValue: helpers.withMessage(t('project.form.purpose-errors.min'), minLength(3)),
      maxLengthValue: helpers.withMessage(t('project.form.purpose-errors.max'), maxLength(180)),
    },
  }))

  const onClean = (data) => {
    const cleanedData = { ...data }

    cleanedData.tags = cleanedData.tags.map((tag) => tag.id)

    return cleanedData
  }

  return useForm<ProjectForm>({ default: defaultProjectForm(), rules, onClean, ...options })
}

export const useProjectDescriptionForm = (options = {}) => {
  return useForm<Pick<ProjectForm, 'description'>>({
    default: pick(defaultProjectForm(), ['description']),
    ...options,
  })
}
