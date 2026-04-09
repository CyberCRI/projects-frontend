import { lpiMount } from '@/../tests/helpers/LpiMount'
import ReplyAnnouncementDrawer from '@/components/project/announcement/ReplyAnnouncementDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('ReplyAnnouncementDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ReplyAnnouncementDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
