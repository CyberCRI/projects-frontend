import { required } from '@vuelidate/validators'

import type { ImageGalleryForm } from '~/interfaces/gallery'

import useForm from '~/composables/useForm'

import { clone } from 'es-toolkit'

const DEFAULT_FORM: ImageGalleryForm = {
  files: null,
}

const RULES = {
  files: { required },
}

export const useGalleryImageForm = (options = {}) => {
  return useForm<ImageGalleryForm>({
    default: clone(DEFAULT_FORM),
    rules: clone(RULES),
    ...options,
  })
}
