import { required } from '@vuelidate/validators'

import type { ImageGalleryForm } from 'shared-projects-frontend/models'

import useForm from '~/composables/useForm'

export const defaultGalleryForm = (): ImageGalleryForm => ({
  files: null,
})

export const useGalleryImageForm = (options = {}) => {
  const rules = computed(() => ({
    files: { required },
  }))

  return useForm<ImageGalleryForm>({
    default: defaultGalleryForm(),
    rules,
    ...options,
  })
}
