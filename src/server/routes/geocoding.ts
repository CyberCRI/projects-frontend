import { Geocoding } from '@/interfaces/maps'

async function fetchFromPhoton(address, locale, runtimeConfig) {
  // TODO: use an env variable for the geocoding API URL

  const res: any = await $fetch(runtimeConfig.public.appGeocodingApiUrl, {
    query: {
      q: address,
      lang: locale,
    },
  })

  //console.log('Geocoding response:', res)

  const suggestedLocations: Geocoding[] = (res?.features || [])
    .filter((feature) => feature.geometry.type === 'Point')
    .map((feature, idx) => {
      const lng = feature.geometry.coordinates[0]
      const lat = feature.geometry.coordinates[1]

      return {
        id: idx,
        title: `${feature.properties.name || ''} ${feature.properties.country || ''}`,
        lat,
        lng,
        description: '',
        type: 'address',
      } satisfies Geocoding
    })

  return suggestedLocations
}

async function fetchFromGoogle(address, locale, runtimeConfig) {
  // TODO: use an env variable for the geocoding API URL
  const res: any = await $fetch(runtimeConfig.public.appGeocodingApiUrl, {
    query: {
      key: runtimeConfig.appGeocodingApiKey,
      address,
      language: locale,
    },
  })

  //console.log('Geocoding response:', res)

  const suggestedLocations: Geocoding[] = (res?.results || [])
    .filter((feature) => !!feature.geometry.location)
    .map((feature, idx) => {
      const lng = feature.geometry.location.lng
      const lat = feature.geometry.location.lat

      return {
        id: idx,
        title: feature.formatted_address || '',
        lat,
        lng,
        description: '',
        type: 'address',
      } satisfies Geocoding
    })
  return suggestedLocations
}

export default defineEventHandler(async (event) => {
  const { address, locale } = getQuery(event)
  const runtimeConfig = useRuntimeConfig()
  const apiUrl = runtimeConfig.public.appGeocodingApiUrl
  let res
  try {
    if (apiUrl.match(/photon/)) {
      res = await fetchFromPhoton(address, locale, runtimeConfig)
    } else if (apiUrl.match(/google/)) {
      res = await fetchFromGoogle(address, locale, runtimeConfig)
    } else {
      throw new Error('No geocoding API URL found in runtime config')
    }
  } catch (error) {
    console.error('Error fetching geocoding API:', error)
    res = { message: error?.message || error }
    setResponseStatus(event, 503)
  }

  return res
})
