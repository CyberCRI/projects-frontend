import NewsListPage from '~/pages/NewsListPage/NewsListPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { NewsFactory } from '~~/tests/factories/news.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('NewsListPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/news/`, () => {
      return PaginationsFactory.generate({
        results: NewsFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(NewsListPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
