import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import StatCard from '@/components/stats/StatCard.vue'

import { describe, expect, it } from 'vitest'

describe('StatCard.vue', () => {
  it('should render component', () => {
    const wrapper = lpiShallowMount(StatCard, {
      props: {
        title: 'title',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
