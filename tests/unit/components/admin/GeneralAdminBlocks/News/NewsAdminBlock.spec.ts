import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewsAdminBlock from '@/components/admin/GeneralAdminBlocks/News/NewsAdminBlock.vue'

import { describe, expect, it } from 'vitest'

describe('NewsAdminBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NewsAdminBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
