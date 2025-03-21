import SearchPage from '@/pages/SearchPage/SearchPage.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserFactory } from '@/../tests/factories/user.factory'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const route = {
  query: {
    section: 'all',
  },
}

describe('BrowseLayout', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = { code: 'TEST' } as unknown as OrganizationOutput
    defaultParams = {
      props: {
        isAddMode: true,
        selectedUser: UserFactory.generate(),
      },
      i18n,
      router: [],
      global: {
        mocks: {
          $route: route,
        },
      },
    }
  })

  it('should render BrowseLayout component', () => {
    wrapper = lpiShallowMount(SearchPage, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
