import AccountDrawer from '@/components/people/Account/AccountDrawer.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'

import { beforeEach, describe, expect, it } from 'vitest'
import { UserFactory } from '@/../tests/factories/user.factory'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('AccountDrawer', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        isOpened: true,
        isAddMode: true,
        selectedUser: UserFactory.generate(),
      },
      i18n,
    }
  })

  it('should render AccountDrawer component', () => {
    wrapper = lpiShallowMount(AccountDrawer, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
