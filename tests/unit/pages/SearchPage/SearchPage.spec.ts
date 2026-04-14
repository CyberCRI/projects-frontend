import SearchPage from '@/pages/SearchPage/SearchPage.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserFactory } from '@/../tests/factories/user.factory'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput } from '@/models/organization.model'

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
    organizationsStore._current = { code: 'TEST' } as unknown as OrganizationOutput
    defaultParams = {
      props: {
        isAddMode: true,
        selectedUser: UserFactory.generate(),
      },
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
