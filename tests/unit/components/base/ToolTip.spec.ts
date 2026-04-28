import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import ToolTip from '~/components/base/ToolTip.vue'

import { beforeEach, describe, expect, it } from 'vitest'
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
