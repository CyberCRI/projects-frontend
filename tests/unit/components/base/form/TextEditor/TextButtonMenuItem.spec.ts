import { lpiMount } from '@/../tests/helpers/LpiMount'
import TextButtonMenuItem from '@/components/base/form/TextEditor/TextButtonMenuItem.vue'

import { describe, expect, it } from 'vitest'

describe('TextButtonMenuItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TextButtonMenuItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
