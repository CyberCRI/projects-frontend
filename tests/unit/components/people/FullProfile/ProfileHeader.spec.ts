import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import ProfileHeader from '@/components/people/FullProfile/ProfileHeader.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import { UserFactory } from '@/../tests/factories/user.factory'
import MockComponent from '@/../tests/helpers/MockComponent.vue'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('ProfileHeader', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()
    defaultParams = {
      props: {
        user: UserFactory.generate(),
      },
      i18n,
      router: [
        {
          path: '/',
          component: MockComponent,
          name: 'Home',
        },
        { path: '/group', name: 'HelpVideoTab', component: MockComponent },
      ],
    }
  })

  it('should render ProfileHeader component', () => {
    wrapper = lpiShallowMount(ProfileHeader, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
