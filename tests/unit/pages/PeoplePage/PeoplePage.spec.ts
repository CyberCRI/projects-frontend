import { lpiMount } from '@/../tests/helpers/LpiMount'
import PeoplePage from '@/pages/PeoplePage/PeoplePage.vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'

mockNuxtImport('useRoute', () => () => ({
  query: {},
}))

describe('PeoplePage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(PeoplePage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
