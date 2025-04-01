import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import CompleteProfileStep2 from '@/components/people/CompleteProfileDrawer/CompleteProfileStep2.vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadLocaleMessages } from '@/../tests/helpers/loadLocaleMessages'
import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
}

describe('CompleteProfileStep1.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
    usersStore.$patch({
      id: 123,
      userFromApi: {},
      permissions: {},
      getUser: vi.fn(),
    } as any)
    defaultParams = {
      i18n,
    }
  })

  it('should render component', () => {
    wrapper = lpiShallowMount(CompleteProfileStep2, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
