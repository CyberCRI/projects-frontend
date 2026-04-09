import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserProjectsSearch from '@/components/people/UserProfile/UserProjectsSearch.vue'

import { describe, expect, it } from 'vitest'

describe('UserProjectsSearch.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(UserProjectsSearch, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
