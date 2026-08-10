import { OrganizationOutputFactory } from '~~/tests/factories/organization.factory'
import AccountGroupsForm from '~/components/people/Account/AccountGroupsForm.vue'
import { peopleGroupFactory } from '~~/tests/factories/group.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

describe('GroupForm', () => {
  it('should render GroupForm component', () => {
    const organizationsStore = useOrganizationsStore()
    organizationsStore._current = OrganizationOutputFactory.generate()
    const organizationCode = useOrganizationCode()
    const props = {
      modelValue: {},
    }

    registerEndpoint(`organization/${organizationCode}/people-groups-hierarchy/`, () =>
      peopleGroupFactory.generate()
    )

    const wrapper = lpiShallowMount(AccountGroupsForm, { props })

    expect(wrapper.exists()).toBeTruthy()
  })
})
