import { lpiMount } from '@/../tests/helpers/LpiMount'
import SignUpWrapper from '@/components/app/SignUpWrapper.vue'

import { describe, expect, it } from 'vitest'

describe('SignUpWrapper.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SignUpWrapper, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
