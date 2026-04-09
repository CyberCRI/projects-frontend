import { lpiMount } from '@/../tests/helpers/LpiMount'
import TipTapCollaborativeConnectingStatus from '@/components/base/form/TextEditor/TipTapCollaborativeConnectingStatus.vue'

import { describe, expect, it } from 'vitest'

describe('TipTapCollaborativeConnectingStatus.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TipTapCollaborativeConnectingStatus, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
