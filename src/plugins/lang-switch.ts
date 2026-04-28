import useOrganizationsStore from '~/stores/useOrganizations'

export default defineNuxtPlugin((nuxtApp) => {
  // called right before setting a new locale
  nuxtApp.hook(
    'i18n:beforeLocaleSwitch',
    //  @ts-expect-error i18n:beforeLocaleSwitch not defined
    ({ oldLocale, newLocale }) => {
      const organizationStore = useOrganizationsStore()
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
