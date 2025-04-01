import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import BlogSummaryBlock from '@/components/project/blog/BlogSummaryBlock.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const factory = (props?) => {
  return lpiMount(BlogSummaryBlock, {
    props: {
      summaryTextContainer: '.description',
      ...props,
    },
    i18n,
  })
}

describe('SummaryBlock.vue', () => {
  it('should render component', () => {
    const wrapper = factory()
    expect(wrapper.exists()).toBe(true)
  })
})
