// Full API reference: https://developer.mixpanel.com/docs/javascript-full-api-reference
import Mixpanel, { RequestOptions } from 'mixpanel-browser'
import { useRuntimeConfig } from '#imports'

import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'

export const mixpanel = Mixpanel

/**
 * Init Analytics libraries
 */
export const init = () => {
  const runtimeConfig = useRuntimeConfig()

  if (!runtimeConfig.public.appMixpanelProjectToken) {
    console.error('Analytics missing env variable NUXT_PUBLIC_APP_MIXPANEL_PROJECT_TOKEN')
    return
  }
  // Init Mixpanel
  Mixpanel.init(runtimeConfig.public.appMixpanelProjectToken, {
    // Force route data to EU servers: https://developer.mixpanel.com/docs/javascript#eu-data-residency
    api_host: runtimeConfig.public.appMixpanelApiUrl,
    // debug: process.env.NODE_ENV === 'development',
  })
  // Useful for testing in dev
  // Mixpanel.reset()
}

/**
 * Set organization properties for all analytic events sent
 */
export const setOrganizationProperties = () => {
  const organizationsStore = useOrganizationsStore()
  try {
    Mixpanel.register({
      // Only add organization properties if not null
      ...(organizationsStore.current && {
        organization: {
          id: organizationsStore.current.id,
          code: organizationsStore.current.code,
          name: organizationsStore.current.name,
        },
      }),
    })
  } catch (err) {
    // Don't catch error if analytics return an error so it doesn't impact the App
    console.error('Analytics error setOrganizationProperties', err)
  }
}

/**
 * Identify user after login
 * @param userId
 */
export const identifyUser = (userId: string) => {
  try {
    Mixpanel.identify(userId)
    // As we don't update user info on the App and we only get the user information at each new login
    // We can call this method here, if later the App can update the user info, we should call in the user store
    setUserProperties()
  } catch (err) {
    // Don't catch error if analytics return an error so it doesn't impact the App
    console.error('Analytics error identifyUser', err)
  }
}

/**
 * Set additional information about the user identity
 */
export const setUserProperties = () => {
  const usersStore = useUsersStore()
  try {
    const fullName = `${usersStore.user.name.firstname} ${usersStore.user.name.lastname}`

    Mixpanel.people.set({
      // Only add user properties if not null
      ...(usersStore.user && {
        // Common properties with Mixpanel
        $name: fullName,
        $email: usersStore.user.email,
        // Custom properties on our side
        id: usersStore.id,
        roles: usersStore.user.roles,
        orgs: usersStore.user.orgs,
      }),
    })
    // Set "page_views" only if it doesn't exist yet, to not overwrite previous value
    Mixpanel.people.set_once('page_views', 0)
  } catch (err) {
    // Don't catch error if analytics return an error so it doesn't impact the App
    console.error('Analytics error setUserProperties', err)
  }
}

/**
 * Wrapper to send event (based on Mixpanel track method), can be adapted later if we use two analytics libraries/tools
 * Ref Mixpanel track method: https://developer.mixpanel.com/docs/javascript-full-api-reference#mixpaneltrack
 * @param eventName
 * @param properties
 * @param options
 * @param callback
 */
export const track = (
  eventName: string,
  properties?: any,
  options?: RequestOptions,
  callback?: () => void
) => {
  try {
    Mixpanel.track(eventName, properties, options, callback)
  } catch (err) {
    // Don't catch error if analytics return an error so it doesn't impact the App
    console.error('Analytics error track', err)
  }
}
