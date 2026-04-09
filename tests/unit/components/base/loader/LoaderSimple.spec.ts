import { lpiMount } from '@/../tests/helpers/LpiMount'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'

import { describe, expect, it } from 'vitest'

describe('LoaderSimple.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LoaderSimple, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
