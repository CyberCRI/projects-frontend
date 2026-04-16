import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import CurrentTags from '@/components/search/FilterTags/CurrentTags.vue'

import { beforeEach, describe, expect, it } from 'vitest'

describe('CurrentTags', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        label: 'CurrentTags',
      },
    }
  })

  it('should render CurrentTags component', () => {
    wrapper = lpiShallowMount(CurrentTags, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
