import useOrganizationsStore from '~/stores/useOrganizations'
import type { Language } from '~/models/types'
export default defineNuxtPlugin((nuxtApp) => {
  // called right before setting a new locale
  nuxtApp.hook(
    'i18n:beforeLocaleSwitch',

    (data) => {
      const { oldLocale, newLocale } = data
      const organizationStore = useOrganizationsStore()
      const availableLanguages = organizationStore.current?.languages || []

      const runtimeConfig = useRuntimeConfig()
      const defaultLanguage = runtimeConfig.public.appI18nLocale
      if (!availableLanguages.includes(newLocale)) {
        if (availableLanguages.includes(defaultLanguage)) {
          data.newLocale = defaultLanguage as Language
        } else if (availableLanguages.length) {
          data.newLocale = availableLanguages[0] as Language
        } else {
          data.newLocale = oldLocale as Language
        }
      }
    }
  )
})
