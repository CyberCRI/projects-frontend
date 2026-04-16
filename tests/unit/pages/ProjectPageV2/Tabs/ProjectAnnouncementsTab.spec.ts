import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import ProjectAnnouncementsTab from '@/pages/ProjectPageV2/Tabs/ProjectAnnouncementsTab.vue'

import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ProjectFactory } from '../../../../factories/project.factory'
import { TranslatedAnnouncementFactory } from '../../../../factories/announcement.factory'

describe('ProjectAnnouncementsTab.vue', () => {
  it('should render component', async () => {
    const project = ProjectFactory.generate()
    const announcements = TranslatedAnnouncementFactory.generateMany(10)
    const props = { project, announcements }

    const wrapper = await lpiMountSuspended(ProjectAnnouncementsTab, {
      props,
      provide: {
        projectLayoutToggleAddModal: vi.fn(),
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
