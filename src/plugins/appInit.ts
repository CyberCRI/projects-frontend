import VueKeyCloak, { useKeycloak } from '@dsb-norge/vue-keycloak-js'
import useUserStore from '~/stores/useUserStore'
import { defineNuxtPlugin } from '#imports'
import main from '~/main'

export default defineNuxtPlugin(async (nuxtApp) => {
  // main make some unit (keycloak.spec) tests fail
  // so disable when in test mode
  // see https://github.com/nuxt/test-utils/issues/526
  const process = await import('node:process')
  const isTest = String(process.env?.TEST) === 'true'

  if (import.meta.client) {
    const runtimeConfig = useRuntimeConfig()

    const onError = () => {
      const userStore = useUserStore()
      const toaster = useToaster()
      const { t } = useNuxtI18n()

      userStore?.removeUser?.()
      toaster.pushError(t('message.error-login'))
    }

    const onSuccess = () => {
      const userStore = useUserStore()

      const { subject } = useKeycloak()
      userStore.setUser(subject)
    }

    nuxtApp.vueApp.use(VueKeyCloak, {
      onInitError: () => onError(),
      onInitSuccess: (authenticated) => {
        if (authenticated) {
          onSuccess()
        } else {
          onError()
        }
      },
      onAuthLogout: () => onError(),
      onAuthRefreshSuccess: () => onSuccess(),
      init: {
        onLoad: 'check-sso',
      },
      config: {
        realm: runtimeConfig.public.appKeycloakRealm,
        url: runtimeConfig.public.appKeycloakUrl,
        clientId: runtimeConfig.public.appKeycloakClientId,
        clientSecret: runtimeConfig.public.appKeycloakClientSecret,
      },
    })
  }

  if (!isTest) {
    await main()
  }
})
