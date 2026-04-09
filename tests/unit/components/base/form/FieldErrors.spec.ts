import { lpiMount } from '@/../tests/helpers/LpiMount'
import FieldErrors from '@/components/base/form/FieldErrors.vue'

import { describe, expect, it } from 'vitest'

describe('FieldErrors.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FieldErrors, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
