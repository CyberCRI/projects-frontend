import { lpiMount } from '@/../tests/helpers/LpiMount'
import TableMenuBar from '@/components/base/form/TextEditor/TableMenuBar.vue'

import { describe, expect, it } from 'vitest'

describe('TableMenuBar.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TableMenuBar, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
