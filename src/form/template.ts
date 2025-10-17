import { required, minLength } from '@vuelidate/validators'
import useForm from '@/composables/useForm'
import { clone } from 'es-toolkit'

const DEFAULT_FORM = {
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
}

const RULES = {
  name: {
    required,
    minLengthValue: minLength(1),
  },
}

export const useTemplateForm = (...options) => {
  const onClean = (data) => {
    // convert categories element to ids
    data.categories_ids = data.categories.map((el) => el.id)

    // convert projects_tags element to ids
    data.project_tags = data.project_tags.map((el) => el.id)

    return data
  }
  return useForm({ default: clone(DEFAULT_FORM), rules: clone(RULES), onClean, ...options })
}
