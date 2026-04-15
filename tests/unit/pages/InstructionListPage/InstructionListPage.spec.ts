import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import InstructionListPage from '@/pages/InstructionListPage/InstructionListPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('InstructionListPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(InstructionListPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
