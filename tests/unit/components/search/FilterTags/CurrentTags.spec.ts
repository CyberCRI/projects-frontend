import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import CurrentTags from '@/components/search/FilterTags/CurrentTags.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('CurrentTags', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        label: 'CurrentTags',
      },
      i18n,
    }
  })

  it('should render CurrentTags component', () => {
    wrapper = lpiShallowMount(CurrentTags, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
