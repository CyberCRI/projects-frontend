import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import CompleteProfileStep2 from '@/components/people/CompleteProfileDrawer/CompleteProfileStep2.vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'

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
    defaultParams = {}
  })

  it('should render component', () => {
    wrapper = lpiShallowMount(CompleteProfileStep2, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
