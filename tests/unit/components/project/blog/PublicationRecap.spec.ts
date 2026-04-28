import PublicationRecap from '~/components/project/blog/PublicationRecap.vue'
import { BlogEntryFactory } from '~~/tests/factories/blog-entry.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

describe('PublicationRecap.vue', () => {
  it('should render component', () => {
    const wrapper = lpiShallowMount(PublicationRecap, {
      props: {
        publications: BlogEntryFactory.generateMany(3),
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
