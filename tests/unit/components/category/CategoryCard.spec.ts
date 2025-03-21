import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoryCard from '@/components/category/CategoryCard.vue'

import { describe, expect, it } from 'vitest'
const category = {
  background_color: '#00DBA7',
  foreground_color: 'white',
  name: 'LPI Projects',
}

const factory = (propsData?) => {
  return lpiMount(CategoryCard, {
    props: {
      ...propsData,
    },
  })
}

describe('CategoryCard.vue', () => {
  it('should render component', () => {
    const wrapper = factory({ category })
    expect(wrapper.exists()).toBe(true)
  })
})
