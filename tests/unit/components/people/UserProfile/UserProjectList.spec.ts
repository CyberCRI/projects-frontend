import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import UserProjectList from '~/components/people/UserProfile/UserProjectList.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import PeopleFactory from '~~/tests/factories/people.factory'
import MockComponent from '~~/tests/helpers/MockComponent.vue'
import pinia from '~/stores'
import useOrganizationsStore from '~/stores/useOrganizations'
import { OrganizationOutput } from '~/models/organization.model'
import { TranslatedProjectFactory } from '../../../../factories/project.factory'

describe('UserProjectList.vue', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { code: 'FOOBAR' } as unknown as OrganizationOutput
  })

  it('should render UserProjectList component', () => {
    const props = {
      projects: TranslatedProjectFactory.generateMany(10),
    }
    const wrapper = lpiShallowMount(UserProjectList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
