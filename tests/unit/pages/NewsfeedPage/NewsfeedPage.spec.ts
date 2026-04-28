import NewsfeedPage from '~/pages/NewsfeedPage/NewsfeedPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('NewsfeedPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/newsfeed/`, () => {
      return PaginationsFactory.generate({
        results: [],
      })
    })

    const wrapper = await lpiMountSuspended(NewsfeedPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
