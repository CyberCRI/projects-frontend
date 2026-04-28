import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import TagResult from '~/components/search/FilterTags/TagResult.vue'

import { beforeEach, describe, expect, it } from 'vitest'

describe('TagResult', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        label: 'Test',
        isAmbiguous: false,
      },
    }
  })

  it('should render TagResult component', () => {
    wrapper = lpiShallowMount(TagResult, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
