import { required } from '@vuelidate/validators'
import useForm from '@/composables/useForm'

const DEFAULT_FORM = Object.freeze({
  language: undefined,
  name: '',
  title: '',
  purpose: '',
  description: '<p></p>',
  blog_title: '',
  blog_content: '<p></p>',
  goal_title: '',
  goal_description: '<p></p>',
  project_tags: [],
  comment: '',
  categories: [],
})

const RULES = Object.freeze({
  name: {
    required,
  },
})

export const useFormTemplate = (...options) => {
  const onClean = (data) => {
    // convert categories element to ids
    data.categories_ids = data.categories.map((el) => el.id)

    // convert projects_tags element to ids
    data.project_tags = data.project_tags.map((el) => el.id)

    return data
  }
  return useForm({ default: DEFAULT_FORM, rules: RULES, onClean, ...options })
}
