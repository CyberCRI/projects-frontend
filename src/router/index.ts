import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import analytics from '@/analytics'
import isAdmin from '@/functs/isAdmin'
import isAdminOrFacilitator from '@/functs/isAdminOrFacilitator'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import utils from '@/functs/functions'
import useUsersStore from '@/stores/useUsers'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to) => {
    const isProjectPage = to.path.includes('projects') && !!to.params.slugOrId
    if (!isProjectPage) return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, _from, next) => {
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
          window.location.protocol + '//' + window.location.host + window.location.pathname + query
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

router.afterEach((to) => {
  const isProjectPage = to.path.includes('projects') && !!to.params.slugOrId
  const additionalProperties = {
    // Only add project properties if it's a project page
    ...(isProjectPage && {
      project: {
        id: to.params.slugOrId,
      },
    }),
  }

  const scrollView = document.getElementById('scrollview')
  if (scrollView) scrollView.scrollTop = 0

  analytics.page.viewed(
    {
      name: String(to.name), // TODO this is a cheap fix, inverstigate the issue with typescript
      url: window.location.href,
    },
    additionalProperties
  )
})

export default router
