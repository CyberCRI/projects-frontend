import { lpiMount } from '@/../tests/helpers/LpiMount'
import LoaderComplex from '@/components/base/loader/LoaderComplex.vue'

import { describe, expect, it } from 'vitest'

describe('LoaderComplex.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LoaderComplex, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
