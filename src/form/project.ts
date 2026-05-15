import type { TranslatedProjectCategory } from '~/models/project-category.model'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import type { TranslatedTemplate } from '~/models/template.model'
import type { ProjectForm } from '~/models/project.model'
import { NULL_CONTENT } from '~/functs/constants'
import { pick } from 'es-toolkit'

const onCleanProjectForm = (data: ProjectForm) => {
  const cleanedData = { ...data }

  if (cleanedData.tags) {
    // @ts-expect-error tag to number
    cleanedData.tags = cleanedData.tags.map((tag) => tag.id)
  }

  if (cleanedData.categories) {
    cleanedData.project_categories_ids = [cleanedData.categories.id]
    delete cleanedData.categories
  }
  if (cleanedData.template) {
    cleanedData.template_id = cleanedData.template.id
    delete cleanedData.template
  }

  return cleanedData
}

export const defaultProjectForm = (): ProjectForm => {
  return {
    title: '',
    purpose: '',
    categories: null,
    description: NULL_CONTENT,
    language: 'en',
    tags: [],
    is_locked: false,
    is_shareable: false,
    publication_status: 'private',
    life_status: 'running',
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

  return useForm<ProjectForm>({
    default: defaultProjectForm(),
    rules,
    onClean: onCleanProjectForm,
    ...options,
  })
}

export const useProjectDescriptionForm = (options = {}) => {
  return useForm<Pick<ProjectForm, 'description'>>({
    default: pick(defaultProjectForm(), ['description']),
    ...options,
  })
}

export const useProjectSettingForm = (options = {}) => {
  return useForm<
    Pick<
      ProjectForm,
      'publication_status' | 'life_status' | 'is_locked' | 'organizations_codes' | 'categories'
    >
  >({
    onClean: onCleanProjectForm,
    ...options,
  })
}

export type ProjectTemplateForm = {
  categorie: TranslatedProjectCategory
  template: TranslatedTemplate
}

export const useProjectTemplatesForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    categorie: {
      required: helpers.withMessage(t('project.form.title-errors.required'), required),
    },
    template: {
      required: helpers.withMessage(t('project.form.purpose-errors.required'), required),
    },
  }))

  return useForm<ProjectTemplateForm>({
    rules,
    ...options,
  })
}
