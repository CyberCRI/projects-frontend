import { lpiMount } from '@/../tests/helpers/LpiMount'
import TagsFilterSummary from '@/components/search/Filters/TagsFilterSummary.vue'

import { beforeEach, describe, expect, it } from 'vitest'

describe('TagsFilterSummary', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: { modelValue: [] },
    }
  })

  it('should render TagsFilterSummary component', () => {
    wrapper = lpiMount(TagsFilterSummary, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('goes back to add mode', async () => {
    wrapper = lpiMount(TagsFilterSummary, {
      ...defaultParams,
      ...{
        props: {
          modelValue: [
            { title: 'Test', id: 1 },
            { title: 'Test', id: 2 },
          ],
        },
      },
    })
    const vm: any = wrapper.vm

    await vm.$nextTick()
    const filterValues = wrapper.findAll('.filter-value')
    expect(filterValues.length).toBe(2)
  })

  it('should emit input event when removing a tag', async () => {
    wrapper = lpiMount(TagsFilterSummary, {
      ...defaultParams,
      ...{
        props: {
          modelValue: [
            { title: 'Test', id: 1 },
            { title: 'Test', id: 2 },
          ],
        },
      },
    })
    const vm: any = wrapper.vm

    await vm.$nextTick()
    const filterValue = wrapper.find('.filter-value')
    filterValue.trigger('click')
    await vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
