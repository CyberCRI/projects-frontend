import { lpiMount } from '@/../tests/helpers/LpiMount'
import EditTagModal from '@/components/admin/EditTagModal.vue'

import { describe, expect, it } from 'vitest'

describe('EditTagModal.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EditTagModal, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
