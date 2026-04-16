import AccountGroupsForm from '@/components/people/Account/AccountGroupsForm.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

describe('GroupForm', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()
    defaultParams = {
      props: {
        modelValue: {},
      },
    }
  })

  it('should render GroupForm component', () => {
    wrapper = lpiShallowMount(AccountGroupsForm, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
