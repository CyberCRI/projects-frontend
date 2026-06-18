import type { ValidationRuleWithoutParams } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { urlCheck } from '~/form/base'

const srcVideo: ValidationRuleWithoutParams = {
  $validator: (value: string | null, siblingState, vm) => {
    if (!urlCheck.$validator(value, siblingState, vm)) {
      return false
    }

    return !!value.match(/youtu\.be|youtube|vimeo/)
  },
  $message: urlCheck.$message,
}

export const useTipTapVideoForm = (options = {}) => {
  const { t } = useNuxtI18n()

  const rules = computed(() => ({
    src: {
      url: helpers.withMessage(t('multieditor.video.error'), srcVideo),
    },
  }))

  return useForm({
    rules,
    default: {
      src: '',
    },
    lazy: true,
    ...options,
  })
}
