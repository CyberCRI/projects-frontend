// https://github.com/nuxt-modules/i18n/discussions/3027#discussioncomment-10384714

import { useI18n } from 'vue-i18n'

type i18N = ReturnType<typeof useI18n>
/**
 * use nuxt i18n insteadof vue18n (probleme render)
 *
 * @function
 * @name useNuxtI18n
 * @kind variable
 * @returns {Composer<{ "en-US": LocaleMessage<VueMessageType>; }, { "en-US": DateTimeFormat; }, { "en-US": NumberFormat; }, string, "en-US", "en-US">}
 */
const useNuxtI18n = (): i18N => {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$i18n as i18N
}
export default useNuxtI18n
