import { lpiMount } from '@/../tests/helpers/LpiMount'
import FilterEditor from '@/components/base/form/FilterEditor.vue'

import { describe, expect, it } from 'vitest'

describe('FilterEditor.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FilterEditor, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
