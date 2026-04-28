import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import SectionHeader from '~/components/base/SectionHeader.vue'

import { describe, expect, it } from 'vitest'
describe('SectionHeader.vue', () => {
  it('should render component', () => {
    const wrapper = lpiShallowMount(SectionHeader, {
      props: {
        title: 'test',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
