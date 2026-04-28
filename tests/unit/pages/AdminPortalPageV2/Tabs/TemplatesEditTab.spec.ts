import TemplatesEditTab from '~/pages/AdminPortalPageV2/Tabs/TemplatesEditTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import TemplateFactory from '~~/tests/factories/template.factory'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

const template = TemplateFactory.generate()
mockNuxtImport('useRoute', () => () => ({
  params: { id: template.id },
}))

describe('TemplatesEditTab.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()

    registerEndpoint(`organization/${organizationCode}/template/${template.id}/`, () => template)

    const wrapper = await lpiMountSuspended(TemplatesEditTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
