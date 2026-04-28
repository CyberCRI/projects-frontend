import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import OnboardingScreens from '~/components/onboarding/OnboardingScreens/OnboardingScreens.vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import pinia from '~/stores'
import useUsersStore from '~/stores/useUsers'

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
