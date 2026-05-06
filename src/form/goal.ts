import { helpers, required } from '@vuelidate/validators'
import type { GoalForm } from '@/models/goal.model'
import { NULL_CONTENT } from '~/functs/constants'
import { requiredContent } from '~/form/base'

export const defaultForm = (): GoalForm => ({
  title: '',
  description: NULL_CONTENT,
  status: 'na',
  deadline_at: null,
})

export const useGoalForm = (options = {}) => {
  const { t } = useNuxtI18n()
  const rules = computed(() => ({
    title: {
      required: helpers.withMessage(t('form.goal.title'), required),
    },
    description: {
      required: helpers.withMessage(t('form.goal.description'), requiredContent),
    },
  }))

  return useForm<GoalForm>({ default: defaultForm(), rules, ...options })
}
