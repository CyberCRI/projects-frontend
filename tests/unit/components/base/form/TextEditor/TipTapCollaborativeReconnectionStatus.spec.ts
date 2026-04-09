import { lpiMount } from '@/../tests/helpers/LpiMount'
import TipTapCollaborativeReconnectionStatus from '@/components/base/form/TextEditor/TipTapCollaborativeReconnectionStatus.vue'

import { describe, expect, it } from 'vitest'

describe('TipTapCollaborativeReconnectionStatus.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TipTapCollaborativeReconnectionStatus, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
