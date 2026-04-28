import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import NewsPage from '~/pages/NewsPage/NewsPage.vue'

import { NewsFactory } from '~~/tests/factories/news.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('NewsPage.vue', () => {
  it('should render component', async () => {
    const news = NewsFactory.generate()
    const props = { slugOrId: news.id.toString() }
    const organizationCode = useOrganizationCode()

    registerEndpoint(`organization/${organizationCode}/news/${news.id}/`, () => {
      return news
    })

    const wrapper = await lpiMountSuspended(NewsPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
