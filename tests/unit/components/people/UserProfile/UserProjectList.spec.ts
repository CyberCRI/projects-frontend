import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import UserProjectList from '@/components/people/UserProfile/UserProjectList.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import ProjectMemberFactory from '@/../tests/factories/project-member.factory'
import PeopleFactory from '@/../tests/factories/people.factory'
import MockComponent from '@/../tests/helpers/MockComponent.vue'
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

const router = [{ name: 'Home', path: '/', component: MockComponent }]
describe('UserProjectList.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = { code: 'FOOBAR' } as unknown as OrganizationOutput
    defaultParams = {
      i18n,
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
