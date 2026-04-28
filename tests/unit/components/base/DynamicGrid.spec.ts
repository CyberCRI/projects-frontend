import DynamicGrid from '~/components/base/DynamicGrid.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

describe('DynamicGrid.vue', () => {
  it('should render DynamicGrid component', () => {
    const wrapper = lpiMount(DynamicGrid)
    expect(wrapper.exists()).toBe(true)
  })
})
