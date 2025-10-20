import { lpiMount } from '@/../tests/helpers/LpiMount'
import TemplatesEditTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesEditTab.vue'
import { describe, it } from 'vitest'

describe('TemplatesEditTab.vue', () => {
  it('Mount', async () => {
    const wrapper = await lpiMount(TemplatesEditTab)
    await wrapper.unmount()
  })
})
