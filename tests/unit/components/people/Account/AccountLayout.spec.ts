import AccountLayout from '~/components/people/Account/AccountLayout.vue'
import { UserFactory } from '~~/tests/factories/user.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

describe('AccountLayout', () => {
  it('should render AccountLayout component', () => {
    const user = UserFactory.generate()
    const props = {
      isAddMode: true,
      selectedUser: user,
    }
    registerEndpoint(`user/${user.id}/`, () => user)
    const wrapper = lpiShallowMount(AccountLayout, { props })

    expect(wrapper.exists()).toBeTruthy()
  })
})
