import { defineNuxtRouteMiddleware, scrollTo } from '#imports'

// scrool with remove padding navBAR
export default defineNuxtRouteMiddleware(
  onClient((to) => {
    if (to.hash) {
      // slice to remove '#' first char
      const el = document.getElementById(to.hash.slice(1))
      if (el) {
        scrollTo(el)
      }
    }
  })
)
