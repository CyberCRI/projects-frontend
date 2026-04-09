import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupForm from '@/components/group/GroupForm/GroupForm.vue'

import { describe, expect, it } from 'vitest'

describe('GroupForm.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupForm, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
