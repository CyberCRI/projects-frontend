import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import NewsfeedPage from '@/pages/NewsfeedPage/NewsfeedPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../factories/paginations.factory'

describe('NewsfeedPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/newsfeed/`, () => {
      return PaginationsFactory.generate({
        results: [],
      })
    })

    const wrapper = await lpiMountSuspended(NewsfeedPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
