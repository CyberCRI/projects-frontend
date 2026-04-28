import { OrganizationOutput } from '~/models/organization.model'
import { UserFactory } from '~~/tests/factories/user.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import SearchPage from '~/pages/SearchPage/SearchPage.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import pinia from '~/stores'

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
