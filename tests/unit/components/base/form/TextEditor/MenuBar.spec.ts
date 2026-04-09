import { lpiMount } from '@/../tests/helpers/LpiMount'
import MenuBar from '@/components/base/form/TextEditor/MenuBar.vue'

import { describe, expect, it } from 'vitest'

describe('MenuBar.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MenuBar, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
