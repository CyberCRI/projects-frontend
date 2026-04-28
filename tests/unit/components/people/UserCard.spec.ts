import { UserFactory } from '~~/tests/factories/user.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import UserCard from '~/components/people/UserCard.vue'

import { beforeEach, describe, expect, it } from 'vitest'

describe('UserCard', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        user: UserFactory.generate(),
      },
    }
  })

  it('should render UserCard component', () => {
    wrapper = lpiShallowMount(UserCard, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
