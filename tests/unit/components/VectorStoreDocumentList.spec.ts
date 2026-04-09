import { lpiMount } from '@/../tests/helpers/LpiMount'
import VectorStoreDocumentList from '@/components/VectorStoreDocumentList.vue'

import { describe, expect, it } from 'vitest'

describe('VectorStoreDocumentList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(VectorStoreDocumentList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
