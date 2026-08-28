import CompleteProfileStep1 from '~/components/people/CompleteProfileDrawer/CompleteProfileStep1.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'

import useUsersStore from '~/stores/useUserStore'

import { UserFactory } from '~~/tests/factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

describe('CompleteProfileStep1.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const usersStore = useUsersStore()
    const user = UserFactory.generate({ id: 123 })
    registerEndpoint(`user/${user.id}/`, () => user)
    usersStore.userFromApi = usersStore.userFromToken = user
    defaultParams = {}
  })
  it('should render component', () => {
    const wrapper = lpiShallowMount(CompleteProfileStep1, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
  it('should emit the saving event', () => {
    wrapper = lpiShallowMount(CompleteProfileStep1, defaultParams)
    const vm: any = wrapper.vm

    vm.save()
    expect(wrapper.emitted('saving')).toBeTruthy()
  })
})
