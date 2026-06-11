import type { ProjectTabForm, ProjectTabItemForm } from '~/models/projects-tabs.model'
import { helpers, required } from '@vuelidate/validators'
import { requiredContent } from '~/form/base'

export const defualtProjectTabForm = (): ProjectTabForm => {
  return {
    title: '',
    description: '',
    icon: null,
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
    description: {
      required: helpers.withMessage(t('form.report.message'), requiredContent),
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
    content: {
      required: helpers.withMessage(t('form.report.message'), requiredContent),
    },
  }))

  return useForm<ProjectTabItemForm>({
    rules,
    ...options,
  })
}
