import { lpiMount } from '@/../tests/helpers/LpiMount'
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'

import { describe, expect, it } from 'vitest'
import { peopleGroupFactory } from '../../../factories/group.factory'
import GroupPage from '@/pages/GroupPageV2/GroupPage.vue'
import { flushPromises } from '@vue/test-utils'
import { MockRouter } from '../../../helpers/router'

const group = peopleGroupFactory.generate()

mockNuxtImport('useRoute', () => () => ({
  params: { groupIdOrSlug: group.id },
  fullPath: `group/${group.id}`,
}))

describe('GroupPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()

    registerEndpoint(`organization/${organizationCode}/group/${group.id}/`, () => {
      return group
    })

    const props = {}

    const wrapper = await lpiMount(GroupPage, {
      props,
      router: MockRouter(),
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
