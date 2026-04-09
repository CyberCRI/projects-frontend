import { lpiMount } from '@/../tests/helpers/LpiMount'
import ContentExpandable from '@/components/base/ContentExpandable.vue'

import { describe, expect, it } from 'vitest'

describe('ContentExpandable.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ContentExpandable, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
