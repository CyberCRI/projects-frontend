import { required } from '@vuelidate/validators'
import { v4 as uuidv4 } from 'uuid'

import useForm from '~/composables/useForm'

import {
  defaultProjectTabForm,
  defaultProjectTabItemForm,
  useProjectTabForm,
} from '~/form/project-tabs'
import type { TemplateForm } from 'shared-projects-frontend/models'
import { NULL_CONTENT } from '~/functs/constants'
import { subArrayForm } from '~/form/base'

export const defaultTemplateForm = (): TemplateForm => ({
  name: '',
  description: '',

  project_title: '',
  project_description: NULL_CONTENT,
  project_purpose: '',
  project_tags: [],
  project_categories_ids: [],

  blogentry_title: '',
  blogentry_content: NULL_CONTENT,

  goal_title: '',
  goal_description: NULL_CONTENT,

  comment_content: '',
  categories: [],

  tabs: [],
})

type TemplateTabForm = {}
export const defaultTemplateTabForm = (): TemplateTabForm => {
  const item = defaultProjectTabItemForm()
  return {
    ...defaultProjectTabForm(),
    uuid: uuidv4(),
    title_item: item.title,
    content_item: item.content,
  }
}

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
