import type { InstructionForm, InstructionInput } from '@/models/instruction.model'
import { helpers, required } from '@vuelidate/validators'
import { NULL_CONTENT } from '~/functs/constants'

export const defaultInstructionForm = (): InstructionForm => ({
  title: '',
  content: NULL_CONTENT,
  publication_date: new Date().toISOString(),
  has_to_be_notified: false,
  people_groups: {},
  visible_by_all: true,
})

export const useInstructionForm = (options) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    title: {
      required: helpers.withMessage(t('instructions.form.title.required'), required),
    },
    content: {
      required: helpers.withMessage(t('instructions.form.content.required'), required),
    },
    publication_date: {
      required: helpers.withMessage(t('instructions.form.publication_date.required'), required),
    },
  }))

  const onClean = (data: InstructionForm) => {
    const newData: InstructionInput = {
      ...structuredClone(data),
      people_groups_ids: [],
    }
    if (newData.people_groups) {
      newData.people_groups_ids = Object.entries(newData.people_groups)
        .filter(([, value]) => value)
        .map(([id]) => id)
      delete newData.people_groups
    }
    return newData
  }

  return useForm<InstructionForm, InstructionInput>({
    default: defaultInstructionForm(),
    rules,
    onClean,
    ...options,
  })
}
