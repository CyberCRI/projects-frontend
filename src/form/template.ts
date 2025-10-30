import { required, minLength } from '@vuelidate/validators'
import useForm from '@/composables/useForm'
import { clone } from 'es-toolkit'

const DEFAULT_FORM = {
  name: '',
  description: '',

  project_title: '',
  project_description: '<p></p>',
  project_purpose: '',
  project_tags: [],

  blogentry_title: '',
  blogentry_content: '<p></p>',

  goal_title: '',
  goal_description: '<p></p>',

  comment_content: '',
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
