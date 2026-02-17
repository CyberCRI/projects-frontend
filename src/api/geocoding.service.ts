import { Geocoding } from '@/interfaces/maps'

/**
 * suggest location from nuxt server (google maps)
 *
 * @function
 * @name useSuggestLocations
 * @kind variable
 * @param {any} config
 * @returns {AsyncData<Geocoding[], FetchError<any>>}
 * @exports
 */
export const useSuggestLocations = (config) => {
  return $fetch<Geocoding[]>('/geocoding', config)
}
