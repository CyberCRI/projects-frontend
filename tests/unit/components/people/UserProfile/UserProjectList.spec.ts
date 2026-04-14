import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import UserProjectList from '@/components/people/UserProfile/UserProjectList.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import PeopleFactory from '@/../tests/factories/people.factory'
import MockComponent from '@/../tests/helpers/MockComponent.vue'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput } from '@/models/organization.model'

const router = [{ name: 'Home', path: '/', component: MockComponent }]
describe('UserProjectList.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { code: 'FOOBAR' } as unknown as OrganizationOutput
    defaultParams = {
      props: {
        user: PeopleFactory.generate(),
      },
      router,
    }
  })

  it('should render UserProjectList component', () => {
    wrapper = lpiShallowMount(UserProjectList, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
