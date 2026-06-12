import type { ProjectTabForm, ProjectTabItemForm } from '~/models/projects-tabs.model'
import { helpers, required } from '@vuelidate/validators'
import { DEFAULT_ICONS_TABS } from '~/functs/constants'

export const defualtProjectTabForm = (): ProjectTabForm => {
  return {
    title: '',
    description: '',
    type: 'text',
    icon: DEFAULT_ICONS_TABS.text,
    images_ids: [],
  }
}

export const defualtProjectTabItemForm = (): ProjectTabItemForm => {
  return {
    title: '',
    content: '',
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
      required: helpers.withMessage(t('project.form.title-errors.required'), required),
    },
  }))

  return useForm<ProjectTabItemForm>({
    rules,
    ...options,
  })
}
