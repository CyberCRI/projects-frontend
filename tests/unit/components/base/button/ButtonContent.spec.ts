import { lpiMount } from '@/../tests/helpers/LpiMount'
import ButtonContent from '@/components/base/button/ButtonContent.vue'

import { describe, expect, it } from 'vitest'

describe('ButtonContent.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ButtonContent, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
