import BlogSummaryBlock from '~/components/project/blog/BlogSummaryBlock.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

describe('SummaryBlock.vue', () => {
  it('should render component', () => {
    const wrapper = lpiMount(BlogSummaryBlock, {
      props: {
        summaryTextContainer: '.description',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
