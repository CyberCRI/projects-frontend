import { lpiMount } from '@/../tests/helpers/LpiMount'
import VectorStoreDocumentShow from '@/components/VectorStoreDocumentShow.vue'

import { describe, expect, it } from 'vitest'

describe('VectorStoreDocumentShow.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(VectorStoreDocumentShow, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
