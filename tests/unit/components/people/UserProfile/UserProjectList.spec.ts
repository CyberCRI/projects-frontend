import UserProjectList from '~/components/people/UserProfile/UserProjectList.vue'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { OrganizationOutput } from '~/models/organization.model'
import useOrganizationsStore from '~/stores/useOrganizations'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'
import pinia from '~/stores'

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
