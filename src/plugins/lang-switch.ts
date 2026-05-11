import useOrganizationsStore from '~/stores/useOrganizations'

export default defineNuxtPlugin((nuxtApp) => {
  // called right before setting a new locale
  nuxtApp.hook(
    'i18n:beforeLocaleSwitch',
    //  @ts-expect-error i18n:beforeLocaleSwitch not defined
    (data) => {
      const { oldLocale, newLocale } = data
      const organizationStore = useOrganizationsStore()
      const availableLanguages = organizationStore.current?.languages || []

      const runtimeConfig = useRuntimeConfig()
      const defaultLanguage = runtimeConfig.public.appI18nLocale
      if (!availableLanguages.includes(newLocale)) {
        if (availableLanguages.includes(defaultLanguage)) {
          data.newLocale = defaultLanguage
        } else if (availableLanguages.length) {
          data.newLocale = availableLanguages[0]
        } else {
          data.newLocale = oldLocale
        }
      }
    }
  )
})
