import GroupSnapshotTab from '~/pages/GroupPageV2/Tabs/GroupSnapshotTab.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'

import GroupDescriptionPreview from '~/components/group/Modules/Extras/GroupDescriptionPreview.vue'
import GroupDocumentsPreview from '~/components/group/Modules/Documents/GroupDocumentsPreview.vue'
import GroupLocationPreview from '~/components/group/Modules/Locations/GroupLocationPreview.vue'
import GroupProjectsPreview from '~/components/group/Modules/Projects/GroupProjectsPreview.vue'
import GroupSimilarsPreview from '~/components/group/Modules/Extras/GroupSimilarsPreview.vue'
import GroupMembersPreview from '~/components/group/Modules/Members/GroupMembersPreview.vue'
import GroupGalleryPreview from '~/components/group/Modules/Gallery/GroupGalleryPreview.vue'
import GroupEventPreview from '~/components/group/Modules/Event/GroupEventPreview.vue'
import GroupSubPreview from '~/components/group/Modules/GroupSub/GroupSubPreview.vue'
import GroupNewsPreview from '~/components/group/Modules/News/GroupNewsPreview.vue'
import { groupTranslatedFactory } from '~~/tests/factories/group.factory'
import OrganizationTagFactory from '~~/tests/factories/tag.factory'
import { groupSkeleton } from '~/skeletons/group.skeletons'

describe('GroupSnapshotTab', () => {
  it('display modules', async () => {
    const group = groupTranslatedFactory.generate(groupSkeleton())
    group.sdgs = [1, 2, 3, 4, 5]
    group.tags = [
      OrganizationTagFactory.generate(),
      OrganizationTagFactory.generate(),
      OrganizationTagFactory.generate(),
    ]
    group.$t.description = ''

    const wrapper = lpiShallowMount(GroupSnapshotTab, {
      props: {
        group,
      },
    })

    expect(wrapper.findComponent(GroupDescriptionPreview).exists()).toBe(false)
    expect(wrapper.findComponent(GroupSimilarsPreview).exists()).toBe(false)
    expect(wrapper.findComponent(GroupMembersPreview).exists()).toBe(false)
    expect(wrapper.findComponent(GroupSubPreview).exists()).toBe(false)
    expect(wrapper.findComponent(GroupMembersPreview).exists()).toBe(false)
    expect(wrapper.findComponent(GroupProjectsPreview).exists()).toBe(false)
    expect(wrapper.findComponent(GroupDocumentsPreview).exists()).toBe(false)
    expect(wrapper.findComponent(GroupLocationPreview).exists()).toBe(false)
    expect(wrapper.findComponent(GroupGalleryPreview).exists()).toBe(false)
    expect(wrapper.findComponent(GroupNewsPreview).exists()).toBe(false)
    expect(wrapper.findComponent(GroupEventPreview).exists()).toBe(false)

    // add modules numbers
    const newGroup = groupTranslatedFactory.generate()
    newGroup.modules.featured_projects = 6
    newGroup.modules.members = 8
    newGroup.modules.conferences = 8
    newGroup.modules.publications = 8
    newGroup.modules.similars = 8
    newGroup.modules.subgroups = 8
    newGroup.modules.locations = 8
    newGroup.modules.gallery = 8
    newGroup.modules.news = 8
    newGroup.modules.event = 8
    newGroup.$t.description = 'description'

    wrapper.setProps({
      group: newGroup,
    })

    await flushPromises()

    expect(wrapper.findComponent(GroupDescriptionPreview).exists()).toBe(true)
    expect(wrapper.findComponent(GroupSimilarsPreview).exists()).toBe(true)
    expect(wrapper.findComponent(GroupMembersPreview).exists()).toBe(true)
    expect(wrapper.findComponent(GroupSubPreview).exists()).toBe(true)
    expect(wrapper.findComponent(GroupMembersPreview).exists()).toBe(true)
    expect(wrapper.findComponent(GroupProjectsPreview).exists()).toBe(true)
    expect(wrapper.findComponent(GroupDocumentsPreview).exists()).toBe(true)
    expect(wrapper.findComponent(GroupLocationPreview).exists()).toBe(true)
    expect(wrapper.findComponent(GroupGalleryPreview).exists()).toBe(true)
    expect(wrapper.findComponent(GroupNewsPreview).exists()).toBe(true)
    expect(wrapper.findComponent(GroupEventPreview).exists()).toBe(true)
  })
})
