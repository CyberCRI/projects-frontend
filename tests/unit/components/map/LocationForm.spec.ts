import { lpiMount } from '@/../tests/helpers/LpiMount'
import LocationForm from '@/components/map/LocationForm.vue'

import { describe, expect, it } from 'vitest'

describe('LocationForm.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LocationForm, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
