import { BlogEntryFactory } from '~~/tests/factories/blog-entry.factory'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

import BlogEntry from '~/components/project/modules/BlogEntries/BlogEntry.vue'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import useAutoTranslate from '~/composables/useAutoTranslate'
import { flushPromises } from '@vue/test-utils'

describe('BlogEntry.vue', () => {
  it('should render component', () => {
    const { translateBlogEntry } = useAutoTranslate()
    const blog = translateBlogEntry(BlogEntryFactory.generate())
    const wrapper = lpiMount(BlogEntry, {
      props: {
        project: TranslatedProjectFactory.generate(),
        blogEntry: blog.value,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should toggle expand', async () => {
    const { translateBlogEntry } = useAutoTranslate()
    const blog = translateBlogEntry(BlogEntryFactory.generate())
    const wrapper = lpiMount(BlogEntry, {
      props: {
        project: TranslatedProjectFactory.generate(),
        blogEntry: blog.value,
      },
    })
    wrapper.setProps({
      expanded: true,
    })

    await flushPromises()

    expect(wrapper.emitted()['expanded']).toBeTruthy()
  })
})
