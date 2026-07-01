import type { ProjectTabForm, ProjectTabItemForm } from '~/models/projects-tabs.model'
import { DEFAULT_ICONS_TABS, NULL_CONTENT } from '~/functs/constants'
import { helpers, required } from '@vuelidate/validators'
import { requiredContent } from '~/form/base'

export const defaultProjectTabForm = (): ProjectTabForm => {
  return {
    title: '',
    description: '',
    type: 'text',
    icon: DEFAULT_ICONS_TABS.text,
    images_ids: [],
    show_preview: true,
  }
}

export const defaultProjectTabItemForm = (): ProjectTabItemForm => {
  return {
    title: '',
    content: NULL_CONTENT,
    images_ids: [],
  }
}

export const useProjectTabForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage(t('project.form.title-errors.required'), required),
    },
    type: {
      required: helpers.withMessage(t('tab.form.type.required'), required),
    },
  }))

  return useForm<ProjectTabForm>({
    rules,
    ...options,
  })
}

export const useProjectTabItemForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage(t('tab.form.title.required'), required),
    },
    content: {
      required: helpers.withMessage(t('tab.form.content.required'), requiredContent),
    },
  }))

  return useForm<ProjectTabItemForm>({
    rules,
    ...options,
  })
}
