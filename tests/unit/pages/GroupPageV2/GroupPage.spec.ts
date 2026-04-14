import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'

import { describe, expect, it } from 'vitest'
import { peopleGroupFactory } from '../../../factories/group.factory'
import GroupPage from '@/pages/GroupPageV2/GroupPage.vue'
import { flushPromises } from '@vue/test-utils'
import GroupSnapshotTab from '@/pages/GroupPageV2/Tabs/GroupSnapshotTab.vue'
import { PaginationsFactory } from '../../../factories/paginations.factory'
import ProjectMemberFactory from '../../../factories/project-member.factory'

const group = peopleGroupFactory.generate()

mockNuxtImport('useRoute', () => () => ({
  params: { groupIdOrSlug: group.id },
  fullPath: `/group/${group.id}/snapshot`,
  path: `/group/${group.id}/snapshot`,
}))

describe('GroupPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()

    registerEndpoint(`organization/${organizationCode}/people-group/${group.id}/`, () => {
      return group
    })

    registerEndpoint(`organization/${organizationCode}/people-group/${group.id}/member/`, () => {
      return PaginationsFactory.generate({
        results: ProjectMemberFactory.generateMany(10),
      })
    })

    const props = {}

    const wrapper = await lpiMountSuspended(GroupPage, {
      props,
      // mock the nxtPage to groupSnapshot (probleme with nuxt resolve path/page)
      stubs: { NuxtPage: GroupSnapshotTab },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
