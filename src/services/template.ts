import { required, minLength } from '@vuelidate/validators'
import useForm from '@/composables/useForm'

const defaultForm = {
  language: undefined,
  name: '',
  title: '',
  purpose: '',
  description: '<p></p>',
  blog_title: '',
  blog_content: '<p></p>',
  goal_title: '',
  goal_description: '<p></p>',
  tags: [],
  comment: '',
  categories: [],
}

const rules = {
  name: {
    required,
  },
  categories: {
    required,
    minLengthValue: minLength(1),
  },
}

export const useFormTemplate = (...options) => {
  return useForm({ default: defaultForm, rules, ...options })
}
