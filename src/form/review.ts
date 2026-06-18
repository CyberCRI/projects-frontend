import { helpers, required } from '@vuelidate/validators'
import type { ReviewForm } from '~/models/review.model'
import { NULL_CONTENT } from '~/functs/constants'
import { requiredContent } from '~/form/base'

export const defaultProjectReviewForm = (): ReviewForm => {
  return {
    title: '',
    description: NULL_CONTENT,
    publish: false,
    lock: false,
  }
}

export const useProjectReviewForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage(t('form.review.title'), required),
      $autoDirty: true,
    },
    description: {
      required: helpers.withMessage(t('form.review.message'), requiredContent),
      $autoDirty: true,
    },
  }))

  return useForm<ReviewForm>({ default: defaultProjectReviewForm(), rules, ...options })
}
