import ProfileSkillsEditTab from '~/pages/UserProfilePageV2/Tabs/ProfileSkillsEditTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { OrganizationFactory } from '~~/tests/factories/organization.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import OrganizationTagFactory from '~~/tests/factories/tag.factory'
import { UserFactory } from '~~/tests/factories/user.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProfileSkillsEditTab.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const props = { user }

    const organizationStore = useOrganizationsStore()
    organizationStore._current = OrganizationFactory.generate()

    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/tag-classification/`, () => {
      return PaginationsFactory.generate({
        results: OrganizationTagFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(ProfileSkillsEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
