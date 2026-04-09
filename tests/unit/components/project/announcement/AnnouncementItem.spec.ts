import { lpiMount } from '@/../tests/helpers/LpiMount'
import AnnouncementItem from '@/components/project/announcement/AnnouncementItem.vue'

import { describe, expect, it } from 'vitest'

describe('AnnouncementItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AnnouncementItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
