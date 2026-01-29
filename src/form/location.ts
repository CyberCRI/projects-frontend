import { required, minLength } from '@vuelidate/validators'
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
    required,
    minLengthValue: minLength(1),
  },
  description: {
    required,
    minLengthValue: minLength(1),
  },
  lat: { required },
  lng: { required },
  type: { required },
}

export const useLocationForm = (options) => {
  return useForm<LocationForm>({ default: clone(DEFAULT_FORM), rules: clone(RULES), ...options })
}
