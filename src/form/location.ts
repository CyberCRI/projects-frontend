import { required, maxLength } from '@vuelidate/validators'
import useForm from '@/composables/useForm'
import { clone } from 'es-toolkit'
import { LocationForm } from '@/models/location.model'

const DEFAULT_FORM: LocationForm = {
  lat: null,
  lng: null,
  type: 'address',
  title: '',
  description: '',
}

const RULES = {
  title: {
    maxLengthValue: maxLength(255),
  },
  description: {},
  lat: { required },
  lng: { required },
  type: { required },
}

export const useLocationForm = (options) => {
  return useForm<LocationForm>({ default: clone(DEFAULT_FORM), rules: clone(RULES), ...options })
}
