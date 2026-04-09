import { lpiMount } from '@/../tests/helpers/LpiMount'
import ContactDrawer from '@/components/app/ContactDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('ContactDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ContactDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
