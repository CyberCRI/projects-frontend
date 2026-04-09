import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupDocumentsPreview from '@/components/group/Modules/Documents/GroupDocumentsPreview.vue'

import { describe, expect, it } from 'vitest'

describe('GroupDocumentsPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupDocumentsPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
