import { lpiMount } from '@/../tests/helpers/LpiMount'
import LinkButton from '@/components/base/button/LinkButton.vue'

import { describe, expect, it } from 'vitest'

describe('LinkButton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LinkButton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
