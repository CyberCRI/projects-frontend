import { lpiMount } from '@/../tests/helpers/LpiMount'
import WordingAdminBlock from '@/components/admin/GeneralAdminBlocks/Wording/WordingAdminBlock.vue'

import { describe, expect, it } from 'vitest'

describe('WordingAdminBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(WordingAdminBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
