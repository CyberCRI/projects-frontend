import { lpiMount } from '@/../tests/helpers/LpiMount'
import LinkMenuBar from '@/components/base/form/TextEditor/LinkMenuBar.vue'

import { describe, expect, it } from 'vitest'

describe('LinkMenuBar.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LinkMenuBar, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
