import { lpiMount } from '@/../tests/helpers/LpiMount'
import EditClassification from '@/components/admin/EditClassification.vue'

import { describe, expect, it } from 'vitest'

describe('EditClassification.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EditClassification, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
