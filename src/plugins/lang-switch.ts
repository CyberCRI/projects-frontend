export default defineNuxtPlugin((nuxtApp) => {
  // called right before setting a new locale
  nuxtApp.hook(
    //  @ts-expect-error i18n:beforeLocaleSwitch not defined
    'i18n:beforeLocaleSwitch',
    ({ oldLocale, newLocale /*, initialSetup, context */ }) => {
      const organizationStore = useOrganizations()
      const availableLanguages = organizationStore.current?.languages || []

      const runtimeConfig = useRuntimeConfig()
      const defaultLanguage = runtimeConfig.public.appI18nLocale
      if (!availableLanguages.includes(newLocale)) {
        if (availableLanguages.includes(defaultLanguage)) {
          return defaultLanguage
        }
        if (availableLanguages.length) {
          return availableLanguages[0]
        }
        return oldLocale
      }
      return newLocale
    }
  )
})
