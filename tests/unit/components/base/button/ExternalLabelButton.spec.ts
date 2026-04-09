import { lpiMount } from '@/../tests/helpers/LpiMount'
import ExternalLabelButton from '@/components/base/button/ExternalLabelButton.vue'

import { describe, expect, it } from 'vitest'

describe('ExternalLabelButton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ExternalLabelButton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
