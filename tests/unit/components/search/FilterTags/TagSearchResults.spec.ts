import { lpiShallowMount, lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import TagSearchResults from '@/components/search/FilterTags/TagSearchResults.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('TagSearchResults', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        label: 'TagSearchResults',
      },
      i18n,
    }
  })

  it('should render TagSearchResults component', () => {
    wrapper = lpiShallowMount(TagSearchResults, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should mark disabled tags', () => {
    wrapper = lpiMount(TagSearchResults, {
      ...defaultParams,
      props: {
        tagResults: [{ id: 1 }, { id: 2 }, { id: 3 }],
        existingTags: [1, 3],
      },
    })
    const vm: any = wrapper.vm
    const filtered = vm.filteredTagResults
    expect(filtered.length).toBe(3)
    expect(filtered[0].id).toBe(1)
    expect(filtered[0].disabled).toBeTruthy()
    expect(filtered[1].id).toBe(2)
    expect(filtered[1].disabled).toBeFalsy()
    expect(filtered[2].id).toBe(3)
    expect(filtered[2].disabled).toBeTruthy()

    const results = wrapper.findAll('.tag-result')
    expect(results.length).toBe(3)

    // disabled item should not emit event
    results[0].trigger('click')
    expect(wrapper.emitted()['result-clicked']).toBeFalsy()

    // non disabled item should emit event (with item as payload)
    results[1].trigger('click')
    expect(wrapper.emitted()['result-clicked'].length).toBe(1)
    // for some reason paylod is wrapped in an array by vitest
    expect(wrapper.emitted()['result-clicked'][0][0]).toEqual(filtered[1])

    // disabled item should not emit event
    results[2].trigger('click')
    expect(wrapper.emitted()['result-clicked'].length).toBe(1)
  })
})
