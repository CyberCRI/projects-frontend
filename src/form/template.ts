import { required } from '@vuelidate/validators'

import useForm from '~/composables/useForm'

import type { TemplateForm } from '~/models/template.model'
import { NULL_CONTENT } from '~/functs/constants'

export const defaultTemplateForm = (): TemplateForm => ({
  name: '',
  description: '',

  project_title: '',
  project_description: NULL_CONTENT,
  project_purpose: '',
  project_tags: [],

  blogentry_title: '',
  blogentry_content: NULL_CONTENT,

  goal_title: '',
  goal_description: NULL_CONTENT,

  comment_content: '',
  categories: [],
})

export const useTemplateForm = (options = {}) => {
  const rules = computed(() => ({
    name: {
      required,
    },
  }))

  const onClean = (data) => {
    // convert categories element to ids
    data.categories_ids = data.categories.map((el) => el.id)

    // convert projects_tags element to ids
    data.project_tags = data.project_tags.map((el) => el.id)

    return data
  }
  return useForm<TemplateForm>({
    default: defaultTemplateForm(),
    rules: rules,
    onClean,
    ...options,
  })
}
