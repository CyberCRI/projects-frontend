import type {
  ProjectModuleExtra,
  ProjectTabForm,
  ProjectTabItemForm,
  ProjectTabSettingsForm,
} from 'shared-projects-frontend/models'
import {
  DEFAULT_ICONS_TABS,
  NULL_CONTENT,
  PROJECT_MODULE_TITLE,
  PROJECT_TABS,
} from '~/functs/constants'
import { helpers, required } from '@vuelidate/validators'
import { requiredContent } from '~/form/base'
import { omit, mapValues } from 'es-toolkit'
import { v4 as uuidv4 } from 'uuid'

export const defaultProjectTabForm = (): ProjectTabForm => {
  return {
    title: '',
    description: '',
    type: 'text',
    icon: DEFAULT_ICONS_TABS.text,
    images_ids: [],
    show_preview: true,
    uuid: uuidv4(),
  }
}

export const defaultProjectTabItemForm = (): ProjectTabItemForm => {
  return {
    title: '',
    content: NULL_CONTENT,
    images_ids: [],
  }
}

export const useProjectTabForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage(t('project.form.title-errors.required'), required),
    },
    type: {
      required: helpers.withMessage(t('tab.form.type.required'), required),
    },
  }))

  return useForm<ProjectTabForm>({
    rules,
    ...options,
  })
}

export const useProjectTabItemForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage(t('tab.form.title.required'), required),
    },
    content: {
      required: helpers.withMessage(t('tab.form.content.required'), requiredContent),
    },
  }))

  return useForm<ProjectTabItemForm>({
    default: defaultProjectTabItemForm(),
    rules,
    ...options,
  })
}

type ProjectTabSettingsForm = Record<keyof typeof PROJECT_TABS, boolean>

export const defaultProjectTabSettings = (): ProjectTabSettingsForm => {
  return mapValues(PROJECT_TABS, () => true)
}

export const userProjectTabSettings = (options = {}) => {
  return useForm<ProjectTabSettingsForm>({
    default: defaultProjectTabSettings(),
    ...options,
  })
}
