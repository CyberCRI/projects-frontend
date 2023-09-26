// Full API reference: https://developer.mixpanel.com/docs/javascript-full-api-reference
import Mixpanel, { RequestOptions } from 'mixpanel-browser'

import store from '@/store'

export const mixpanel = Mixpanel

/**
 * Init Analytics libraries
 */
export const init = () => {
    if (!import.meta.env.VITE_APP_MIXPANEL_PROJECT_TOKEN) {
        console.error('Analytics missing env variable VITE_APP_MIXPANEL_PROJECT_TOKEN')
        return
    }
    // Init Mixpanel
    Mixpanel.init(import.meta.env.VITE_APP_MIXPANEL_PROJECT_TOKEN, {
        // Force route data to EU servers: https://developer.mixpanel.com/docs/javascript#eu-data-residency
        api_host: import.meta.env.VITE_APP_MIXPANEL_API_URL,
        debug: import.meta.env.NODE_ENV === 'development',
    })
    // Useful for testing in dev
    // Mixpanel.reset()
}

/**
 * Set organization properties for all analytic events sent
 */
export const setOrganizationProperties = () => {
    try {
        Mixpanel.register({
            // Only add organization properties if not null
            ...(store.state.organizations.current && {
                organization: {
                    id: store.state.organizations.current.id,
                    code: store.state.organizations.current.code,
                    name: store.state.organizations.current.name,
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
    try {
        const fullName = `${store.getters['users/user'].name.firstname} ${store.getters['users/user'].name.lastname}`

        Mixpanel.people.set({
            // Only add user properties if not null
            ...(store.getters['users/user'] && {
                // Common properties with Mixpanel
                $name: fullName,
                $email: store.getters['users/user'].email,
                // Custom properties on our side
                id: store.state.users.id,
                roles: store.getters['users/user'].roles,
                orgs: store.getters['users/user'].orgs,
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
