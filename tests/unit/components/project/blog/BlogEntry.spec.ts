import { BlogEntryFactory } from '~~/tests/factories/blog-entry.factory'
import BlogEntry from '~/components/project/blog/BlogEntry.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

import useAutoTranslate from '~/composables/useAutoTranslate'

describe('BlogEntry.vue', () => {
  it('should render component', () => {
    const { translateBlogEntry } = useAutoTranslate()
    const blog = translateBlogEntry(BlogEntryFactory.generate())
    const wrapper = lpiMount(BlogEntry, {
      props: {
        blogEntry: blog.value,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should toggle expand', () => {
    const { translateBlogEntry } = useAutoTranslate()
    const blog = translateBlogEntry(BlogEntryFactory.generate())
    const wrapper = lpiMount(BlogEntry, {
      props: {
        blogEntry: blog.value,
      },
    })
    const vm: any = wrapper.vm

    vm.toggleExpand()
    expect(wrapper.emitted()['toggle-expand']).toBeTruthy()
  })
})
