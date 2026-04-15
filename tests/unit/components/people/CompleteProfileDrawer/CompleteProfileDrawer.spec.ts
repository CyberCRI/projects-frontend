import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import CompleteProfileDrawer from '@/components/people/CompleteProfileDrawer/CompleteProfileDrawer.vue'

import { beforeEach, describe, expect, it } from 'vitest'

describe('CompleteProfileDrawer.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        isOpened: true,
        initialStep: 2,
      },
    }
  })
  it('should render component', () => {
    const wrapper = lpiShallowMount(CompleteProfileDrawer, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
  it('should emit the close event', () => {
    wrapper = lpiShallowMount(CompleteProfileDrawer, defaultParams)
    const vm: any = wrapper.vm

    vm.cancel()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
