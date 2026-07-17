import CompleteProfileStep2 from '~/components/people/CompleteProfileDrawer/CompleteProfileStep2.vue'
import { UserFactory } from '~~/tests/factories/user.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import useUsersStore from '~/stores/useUsers'
import { describe, expect, it } from 'vitest'

describe('CompleteProfileStep1.vue', () => {
  it('should render component', () => {
    const user = UserFactory.generate()
    const userStore = useUsersStore()
    registerEndpoint(`user/${user.id}/`, () => user)
    userStore.userFromApi = userStore.userFromToken = user

    const wrapper = lpiShallowMount(CompleteProfileStep2)
    expect(wrapper.exists()).toBe(true)
  })
})
