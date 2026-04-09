import { lpiMount } from '@/../tests/helpers/LpiMount'
import VectorStoreIngestionForm from '@/components/VectorStoreIngestionForm.vue'

import { describe, expect, it } from 'vitest'

describe('VectorStoreIngestionForm.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(VectorStoreIngestionForm, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
