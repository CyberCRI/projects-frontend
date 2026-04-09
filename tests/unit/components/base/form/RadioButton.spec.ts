import { lpiMount } from '@/../tests/helpers/LpiMount'
import RadioButton from '@/components/base/form/RadioButton.vue'

import { describe, expect, it } from 'vitest'

describe('RadioButton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(RadioButton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
