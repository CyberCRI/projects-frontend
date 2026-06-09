import type { AttachmentForm } from '~/models/attachment.model'
import { helpers, required } from '@vuelidate/validators'
import { maxFileSize, urlCheck } from '~/form/base'
import type { RefOrRaw } from '~/interfaces/utils'
import { MAX_FILE_SIZE } from '~/functs/constants'

export const defaultAttachmentForm = (): AttachmentForm => {
  return {
    title: '',
    description: '',
    site_url: null,
    file: null,
  }
}

export const useAttachmentForm = (type: RefOrRaw<'file' | 'link'>, options = {}) => {
  const { t } = useNuxtI18n()
  const rules = computed(() => {
    const rules = {
      title: {
        required: helpers.withMessage(t('form.resources.title'), required),
      },
      description: {
        required: helpers.withMessage(t('form.resources.description'), required),
      },
    }
    if (unref(type) === 'file') {
      // @ts-expect-error not defined in rules
      rules.file = {
        required: helpers.withMessage(t('resource.file.form.required'), required),
        maxFileSize: maxFileSize(MAX_FILE_SIZE),
      }
    }
    if (unref(type) === 'link') {
      // @ts-expect-error not defined in rules
      rules.site_url = {
        required: helpers.withMessage(t('form.resources.link'), required),
        urlCheck,
      }
    }
    return rules
  })

  const onClean = (data) => {
    const cleanedData = structuredClone(data)

    // cleanup attachemenFiles
    if (unref(type) === 'link') {
      delete cleanedData.file
    } else if (unref(type) === 'file') {
      delete cleanedData.site_url
    }

    return cleanedData
  }

  return useForm<AttachmentForm>({ default: defaultAttachmentForm(), rules, onClean, ...options })
}
