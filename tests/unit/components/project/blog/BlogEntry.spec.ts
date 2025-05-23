import { lpiMount } from '@/../tests/helpers/LpiMount'
import VueI18n from 'vue-i18n'
import english from '@/i18n/locales/en.json'
import BlogEntry from '@/components/project/blog/BlogEntry.vue'
import { BlogEntryFactory } from '@/../tests/factories/blog-entry.factory'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('BlogEntry.vue', () => {
  it('should render component', () => {
    const wrapper = lpiMount(BlogEntry, {
      props: {
        blogEntry: BlogEntryFactory.generate(),
      },
      i18n,
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should toggle expand', () => {
    const wrapper = lpiMount(BlogEntry, {
      props: {
        blogEntry: BlogEntryFactory.generate(),
      },
      i18n,
    })
    const vm: any = wrapper.vm

    vm.toggleExpand()
    expect(wrapper.emitted()['toggle-expand']).toBeTruthy()
  })
})
