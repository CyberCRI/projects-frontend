import { lpiMount } from '@/../tests/helpers/LpiMount'
import FieldDisabler from '@/components/base/form/FieldDisabler.vue'

import { describe, expect, it } from 'vitest'

describe('FieldDisabler.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FieldDisabler, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
