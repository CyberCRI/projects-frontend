import { useNuxtApp } from 'nuxt/app'

export const isNuxtReady = () => {
  const isNuxtTestEnv = typeof $fetch !== 'undefined' || typeof useNuxtApp !== 'undefined'
  if (!isNuxtTestEnv) {
    return false
  }

  // disable registerendpoint in non nuxt env (for keycloackUtils.spec.ts, it use happy-dom)
  try {
    useNuxtApp()
  } catch {
    return false
  }
  return true
}

export const onlyOnce = (callback: () => Pormise<boolean | undefined> | boolean | undefined) => {
  let called = false

  return async () => {
    if (called) {
      return
    }
    called = !!(await callback())
  }
}
