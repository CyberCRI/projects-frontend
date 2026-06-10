import { ProjectTabForm } from '~/models/projects-tabs.model'
import { helpers, required } from '@vuelidate/validators'
import { requiredContent } from '~/form/base'

export const defualtProjectTabForm = (): ProjectTabForm => {
  return {
    title: '',
    description: '',
    icon: null,
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
