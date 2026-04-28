import { lpiMount } from '~~/tests/helpers/LpiMount'
import SearchOptionDropDown from '~/components/search/SearchOptionDropDown/SearchOptionDropDown.vue'
import { ALL_SECTION_KEY } from '~/components/search/Filters/useSectionFilters'

import { beforeEach, describe, expect, it } from 'vitest'

describe('SearchOptionDropDown.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        selectedSection: ALL_SECTION_KEY,
      },
    }
  })

  it('should render SearchOptionDropDown component', () => {
    wrapper = lpiMount(SearchOptionDropDown, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
