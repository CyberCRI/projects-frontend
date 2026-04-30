import { maxLength, required } from '@vuelidate/validators'

import type { LocationForm } from '~/models/location.model'

import useForm from '~/composables/useForm'

import { clone } from 'es-toolkit'

const DEFAULT_FORM: LocationForm = {
  lat: null,
  lng: null,
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
