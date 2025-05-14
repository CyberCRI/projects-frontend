async function fetchFromPhoton(address, locale, runtimeConfig) {
  // TODO: use an env variable for the geocoding API URL
  const res: any = await $fetch(runtimeConfig.public.appGeocodingApiUrl, {
    query: {
      q: address,
      lang: locale,
    },
  })

  //console.log('Geocoding response:', res)

  const suggestedLocations = (res?.features || [])
    .filter((feature) => feature.geometry.type === 'Point')
    .map((feature) => {
      const lng = feature.geometry.coordinates[0]
      const lat = feature.geometry.coordinates[1]
      const latlng = {
        lat,
        lng,
      }

      return {
        id: Math.random().toString(36).substring(2, 15),
        label: `${feature.properties.name || ''} ${feature.properties.country || ''}`,
        lat,
        lng,
        latlng,
        type: feature.properties.type,
      }
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

  const suggestedLocations = (res?.results || [])
    .filter((feature) => !!feature.geometry.location)
    .map((feature) => {
      const lng = feature.geometry.location.lng
      const lat = feature.geometry.location.lat
      const latlng = {
        lat,
        lng,
      }

      return {
        id: Math.random().toString(36).substring(2, 15),
        label: feature.formatted_address || '',
        lat,
        lng,
        latlng,
        type: feature.types.length ? feature.types[0] : '',
      }
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
