import AccountForm from '@/components/people/Account/AccountForm.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserFactory } from '@/../tests/factories/user.factory'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

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
