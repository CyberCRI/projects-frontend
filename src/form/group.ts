import useForm from '@/composables/useForm'
import { clone } from 'es-toolkit'

const DEFAULT_FORM = {
  featured_projects: [],
}

const RULES = {}

export const useGroupProjectForm = (...options) => {
  const onClean = (data) => {
    return {
      featured_projects: data.featured_projects.map((el) => el.id),
    }
  }
  return useForm({ default: clone(DEFAULT_FORM), rules: clone(RULES), onClean, ...options })
}
