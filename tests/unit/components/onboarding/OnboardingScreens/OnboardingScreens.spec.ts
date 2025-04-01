import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import OnboardingScreens from '@/components/onboarding/OnboardingScreens/OnboardingScreens.vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('OnboardingScreens', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
    usersStore.$patch({
      id: '123',
      userFromApi: {},
      permissions: {},
      getUser: vi.fn(),
    } as any)
    defaultParams = {
      i18n,
    }
  })

  it('should render OnboardingScreens component', () => {
    wrapper = lpiShallowMount(OnboardingScreens, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
