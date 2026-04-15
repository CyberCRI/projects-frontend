import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import LpiLogo from '@/components/app/LpiLogo.vue'
import { describe, expect, it } from 'vitest'

describe('LpiFooter', () => {
  it('should render LpiLogo component', () => {
    const wrapper = lpiShallowMount(LpiLogo)

    expect(wrapper.exists()).toBeTruthy()
  })
})
