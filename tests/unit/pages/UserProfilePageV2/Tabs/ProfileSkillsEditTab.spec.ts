import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileSkillsEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileSkillsEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { UserFactory } from '../../../../factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../../factories/paginations.factory'
import OrganizationTagFactory from '../../../../factories/tag.factory'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationFactory } from '../../../../factories/organization.factory'

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

    const wrapper = await lpiMount(ProfileSkillsEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
