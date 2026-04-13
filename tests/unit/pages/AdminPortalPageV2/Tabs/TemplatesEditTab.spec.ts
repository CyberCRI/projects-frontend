import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import TemplatesEditTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import TemplateFactory from '../../../../factories/template.factory'

const template = TemplateFactory.generate()
mockNuxtImport('useRoute', () => () => ({
  params: { id: template.id },
}))

describe('TemplatesEditTab.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    const props = {}

    registerEndpoint(`organization/${organizationCode}/template/${template.id}/`, () => template)

    const wrapper = await lpiMountSuspended(TemplatesEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
