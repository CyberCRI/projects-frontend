import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import UserCard from '@/components/people/UserCard.vue'
import { UserFactory } from '@/../tests/factories/user.factory'
import { loadLocaleMessages } from '@/../tests/helpers/loadLocaleMessages'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
}

describe('UserCard', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      i18n,
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
