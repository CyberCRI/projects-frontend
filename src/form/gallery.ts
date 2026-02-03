import { required } from '@vuelidate/validators'
import useForm from '@/composables/useForm'
import { clone } from 'es-toolkit'
import { ImageGalleryForm } from '@/interfaces/gallery'

const DEFAULT_FORM: ImageGalleryForm = {
  imageSizes: null,
  header_image: null,
}

const RULES = {
  imageSizes: { required },
  header_image: { required },
}

export const useGalleryImageForm = (options) => {
  return useForm<ImageGalleryForm>({
    default: clone(DEFAULT_FORM),
    rules: clone(RULES),
    ...options,
  })
}
