import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import ToolTip from '@/components/base/ToolTip.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
describe('ToolTip', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {},
    }
  })

  it('should render Tooltip component', () => {
    wrapper = lpiShallowMount(ToolTip, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
