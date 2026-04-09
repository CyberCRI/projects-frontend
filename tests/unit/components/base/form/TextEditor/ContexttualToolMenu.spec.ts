import { lpiMount } from '@/../tests/helpers/LpiMount'
import ContexttualToolMenu from '@/components/base/form/TextEditor/ContexttualToolMenu.vue'

import { describe, expect, it } from 'vitest'

describe('ContexttualToolMenu.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ContexttualToolMenu, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
