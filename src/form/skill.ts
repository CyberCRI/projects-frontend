import type { SkillForm, SkillCleanedForm } from 'shared-projects-frontend/models'
import { required } from '@vuelidate/validators'

export const defaultSkillForm = (): SkillForm => ({
  can_mentor: false,
  needs_mentor: false,
  comment: '',
  category: '',
  level: 2,
  level_to_reach: 4,
  tag: null,
  type: 'skill',
})

export const useSkillForm = (options = {}) => {
  const rules = computed(() => ({
    tag: {
      required,
    },
  }))

  const onClean = (form: SkillForm): SkillCleanedForm => {
    return {
      ...form,
      tag: form.tag.id,
    }
  }

  return useForm<SkillForm, SkillCleanedForm>({
    default: defaultSkillForm(),
    onClean,
    rules,
    ...options,
  })
}
