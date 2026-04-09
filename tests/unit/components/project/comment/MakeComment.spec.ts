import { lpiMount } from '@/../tests/helpers/LpiMount'
import MakeComment from '@/components/project/comment/MakeComment.vue'

import { describe, expect, it } from 'vitest'

describe('MakeComment.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MakeComment, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
