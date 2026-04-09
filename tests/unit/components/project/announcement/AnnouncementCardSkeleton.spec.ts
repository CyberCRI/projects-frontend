import { lpiMount } from '@/../tests/helpers/LpiMount'
import AnnouncementCardSkeleton from '@/components/project/announcement/AnnouncementCardSkeleton.vue'

import { describe, expect, it } from 'vitest'

describe('AnnouncementCardSkeleton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AnnouncementCardSkeleton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
