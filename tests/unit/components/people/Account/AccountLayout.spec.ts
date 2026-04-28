import AccountLayout from '~/components/people/Account/AccountLayout.vue'
import { UserFactory } from '~~/tests/factories/user.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'

describe('AccountLayout', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        isAddMode: true,
        selectedUser: UserFactory.generate(),
      },
    }
  })

  it('should render AccountLayout component', () => {
    wrapper = lpiShallowMount(AccountLayout, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
