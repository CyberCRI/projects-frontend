import { lpiMount } from '@/../tests/helpers/LpiMount'
import FeaturedProjectAdminListItem from '@/components/admin/GeneralAdminBlocks/FeaturedProject/FeaturedProjectAdminListItem.vue'

import { describe, expect, it } from 'vitest'

describe('FeaturedProjectAdminListItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FeaturedProjectAdminListItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
