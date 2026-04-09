import { lpiMount } from '@/../tests/helpers/LpiMount'
import ClassificationDescription from '@/components/admin/ClassificationDescription.vue'

import { describe, expect, it } from 'vitest'

describe('ClassificationDescription.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ClassificationDescription, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
