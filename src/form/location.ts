import { maxLength, required } from '@vuelidate/validators'

import type { LocationForm } from 'shared-projects-frontend/models'

import useForm from '~/composables/useForm'

export const defaultLocationForm = (): LocationForm => ({
  lat: null,
  lng: null,
  title: '',
  description: '',
})

export const useLocationForm = (options) => {
  const rules = computed(() => ({
    title: {
      maxLengthValue: maxLength(255),
    },
    description: {},
    lat: { required },
    lng: { required },
    type: { required },
  }))

  return useForm<LocationForm>({
    default: defaultLocationForm(),
    rules,
    ...options,
  })
}
