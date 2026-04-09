import { lpiMount } from '@/../tests/helpers/LpiMount'
import DateField from '@/components/base/form/DateField.vue'

import { describe, expect, it } from 'vitest'

describe('DateField.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(DateField, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
