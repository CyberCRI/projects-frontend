import { lpiMount } from '@/../tests/helpers/LpiMount'
import TipTapCollaborativeConnectedStatus from '@/components/base/form/TextEditor/TipTapCollaborativeConnectedStatus.vue'

import { describe, expect, it } from 'vitest'

describe('TipTapCollaborativeConnectedStatus.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TipTapCollaborativeConnectedStatus, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
