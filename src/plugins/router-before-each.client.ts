import isAdmin from '@/functs/isAdmin'
import isAdminOrFacilitator from '@/functs/isAdminOrFacilitator'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import utils from '@/functs/functions'
import useUsersStore from '@/stores/useUsers'

export default defineNuxtPlugin(async () => {
  useRouter().beforeEach((to, from, next) => {
    // console.log('BEFORE EACH')
    if (to.matched.some((route) => route.meta.resetScroll)) {
      utils.resetScroll()
    }

    const usersStore = useUsersStore()
    if (to.matched.some((route) => route.meta.requiresAuth) && !usersStore.isConnected) {
      let proceed = true

      // if the page allow last minute login
      if (to.matched.some((route) => route.meta.loginFromNotification)) {
        const urlParams = new URLSearchParams(window.location.search)
        const notficationFlag = 'fromNotification'
        // if route has special param to append, add them
        // e.g. to trigger custom behavior (show notifcation popup in pageme)
        let newQueryParam = null
        to.matched.forEach(function (route) {
          if (route.meta.loginFromNotificationNewQueryParam) {
            newQueryParam = route.meta.loginFromNotificationNewQueryParam
          }
        })
        if (urlParams.has(notficationFlag)) {
          // remove flag so it not triggered again
          urlParams.delete(notficationFlag)
          // add custom flag
          if (newQueryParam) {
            urlParams.set(newQueryParam, '')
          }
          let query = urlParams.toString()
          if (query) query = '?' + query
          // set the url for post login redirection
          const newurl =
            window.location.protocol +
            '//' +
            window.location.host +
            window.location.pathname +
            query
          window.history.pushState({ path: newurl }, '', newurl)
          proceed = false
          // login
          goToKeycloakLoginPage()
        }
      }
      // if we didn't login, redirect to an authorized page
      if (proceed) {
        next({ name: 'Home' })
      }
    } else if (to.matched.some((route) => route.meta.requiresAdmin) && !isAdmin()) {
      next({ name: 'Home' })
    } else if (
      to.matched.some((route) => route.meta.requiresAdminOrFacilitator) &&
      !isAdminOrFacilitator()
    ) {
      next({ name: 'Home' })
    } else {
      next()
    }
  })
})
