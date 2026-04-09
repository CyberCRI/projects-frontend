import { lpiMount } from '@/../tests/helpers/LpiMount'
import MenuItem from '@/components/base/form/TextEditor/MenuItem.vue'

import { describe, expect, it } from 'vitest'

describe('MenuItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MenuItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
