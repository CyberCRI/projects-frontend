import type { BlogEntryForm } from '~/models/blog-entry.model'
import { helpers, required } from '@vuelidate/validators'
import { NULL_CONTENT } from '~/functs/constants'
import { requiredContent } from '~/form/base'
import { nowDate } from '~/functs/date'

export const defaultBlogForm = (): BlogEntryForm => {
  return {
    title: '',
    content: NULL_CONTENT,
    created_at: nowDate(),
    images_ids: [],
  }
}

export const useBlogEntryForm = (options = {}) => {
  const { t } = useNuxtI18n()
  const rules = computed(() => ({
    title: {
      required: helpers.withMessage(t('form.blog.title'), required),
    },
    content: {
      required: helpers.withMessage(t('form.blog.description'), requiredContent),
    },
  }))

  return useForm<BlogEntryForm>({ default: defaultBlogForm(), rules, ...options })
}
