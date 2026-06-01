import AnnouncementDrawer from '~/components/project/modules/Announcements/AnnouncementDrawer.vue'
import { TranslatedAnnouncementFactory } from '~~/tests/factories/announcement.factory'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { describe, expect, it } from 'vitest'
import waitForExpect from 'wait-for-expect'

describe('AnnouncementDrawer.vue', () => {
  it('should render component', () => {
    const project = TranslatedProjectFactory.generate()
    const wrapper = lpiShallowMount(AnnouncementDrawer, { props: { isOpened: true, project } })
    expect(wrapper.exists()).toBe(true)
  })

  it('assigns existing announcement to form in edit mode', async () => {
    const project = TranslatedProjectFactory.generate()
    const announcement = TranslatedAnnouncementFactory.generate()

    lpiShallowMount(AnnouncementDrawer, {
      props: { isOpened: true, project, announcement },
    })
  })
})
