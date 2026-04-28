import ResourceCard from '~/components/resources/ResourceCard.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

describe('ResourceCard.vue', () => {
  it('should render component', () => {
    const wrapper = lpiMount(ResourceCard, { props: { title: 'File 1' } })
    expect(wrapper.exists()).toBe(true)
  })
})
