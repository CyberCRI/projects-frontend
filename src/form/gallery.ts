import { required } from '@vuelidate/validators'
import useForm from '@/composables/useForm'
import { clone } from 'es-toolkit'
import { ImageGalleryForm } from '@/interfaces/gallery'

const DEFAULT_FORM: ImageGalleryForm = {
  pictures: null,
}

const RULES = {
  pictures: { required },
}

export const useGalleryImageForm = (options = {}) => {
  return useForm<ImageGalleryForm>({
    default: clone(DEFAULT_FORM),
    rules: clone(RULES),
    ...options,
  })
}
