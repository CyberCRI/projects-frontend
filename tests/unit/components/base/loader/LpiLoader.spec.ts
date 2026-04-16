import { lpiMount } from '@/../tests/helpers/LpiMount'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'

import { describe, expect, it } from 'vitest'

describe('LpiLoader.vue', () => {
  it('should render component', () => {
    const wrapper = lpiMount(LpiLoader, { props: { type: 'simple' } })
    expect(wrapper.exists()).toBe(true)
  })

  it('should display simple loader', () => {
    const wrapper = lpiMount(LpiLoader, { props: { type: 'simple' } })
    const type = wrapper.find('.loader-simple')

    expect(type.exists()).toBeTruthy()
  })

  it('should display complex loader', () => {
    const wrapper = lpiMount(LpiLoader, { props: { type: 'complex' } })
    const type = wrapper.find('.loader-complex')

    expect(type.exists()).toBeTruthy()
  })
})
