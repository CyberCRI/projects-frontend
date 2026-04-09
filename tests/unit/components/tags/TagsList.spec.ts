import { lpiMount } from '@/../tests/helpers/LpiMount'
import TagsList from '@/components/tags/TagsList.vue'

import { describe, expect, it } from 'vitest'

describe('TagsList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TagsList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
