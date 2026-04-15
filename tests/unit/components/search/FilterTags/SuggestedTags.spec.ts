import { lpiShallowMount, lpiMount } from '@/../tests/helpers/LpiMount'
import SuggestedTags from '@/components/search/FilterTags/SuggestedTags.vue'

import { beforeEach, describe, expect, it } from 'vitest'

describe('SuggestedTags', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {}
  })

  it('should render SuggestedTags component', () => {
    wrapper = lpiShallowMount(SuggestedTags, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render all Suggested Tags items', () => {
    wrapper = lpiMount(SuggestedTags, {
      ...defaultParams,
      props: {
        suggestedTags: [
          { id: 1, title: 'tag1' },
          { id: 2, title: 'tag2' },
          { id: 3, title: 'tag3' },
        ],
      },
    })

    const vm: any = wrapper.vm

    expect(vm.displayableTags.length).toBe(3)

    const tags = wrapper.findAll('.filter-value')
    expect(tags.length).toBe(3)
  })

  it('should not render alredy selected Tags items', () => {
    wrapper = lpiMount(SuggestedTags, {
      ...defaultParams,
      props: {
        suggestedTags: [
          { id: 1, title: 'tag1' },
          { id: 2, title: 'tag2' },
          { id: 3, title: 'tag3' },
        ],
        currentTags: [1, 3],
      },
    })

    const vm: any = wrapper.vm

    expect(vm.displayableTags.length).toBe(1)
    expect(vm.displayableTags[0].id).toBe(2)

    const tags = wrapper.findAll('.filter-value')
    expect(tags.length).toBe(1)
  })
})
