import { OrganizationOutputFactory } from '~~/tests/factories/organization.factory'
import AccountForm from '~/components/people/Account/AccountForm.vue'
import { UserFactory } from '~~/tests/factories/user.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'
import pinia from '~/stores'

describe('AccountForm', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()
    defaultParams = {
      props: {
        isAddMode: true,
        selectedUser: UserFactory.generate(),
      },
    }
  })

  it('should render AccountForm component', () => {
    wrapper = lpiShallowMount(AccountForm, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
