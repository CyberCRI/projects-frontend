import { lpiMount } from '@/../tests/helpers/LpiMount'
import AnnouncementCardListSkeleton from '@/components/project/announcement/AnnouncementCardListSkeleton.vue'

import { describe, expect, it } from 'vitest'

describe('AnnouncementCardListSkeleton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AnnouncementCardListSkeleton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
