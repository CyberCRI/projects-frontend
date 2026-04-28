import OnboardingScreens from '~/components/onboarding/OnboardingScreens/OnboardingScreens.vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'

import useUsersStore from '~/stores/useUsers'
import pinia from '~/stores'

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
    defaultParams = {}
  })

  it('should render OnboardingScreens component', () => {
    wrapper = lpiShallowMount(OnboardingScreens, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
