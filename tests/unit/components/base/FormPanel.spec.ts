import { lpiMount } from '@/../tests/helpers/LpiMount'
import FormPanel from '@/components/base/FormPanel.vue'

import { describe, expect, it } from 'vitest'

describe('FormPanel.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FormPanel, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
