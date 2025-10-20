import { lpiMount } from '@/../tests/helpers/LpiMount'
import TemplatesCreateTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesCreateTab.vue'
import { describe, it } from 'vitest'

describe('TemplatesCreateTab.vue', () => {
  it('Mount', async () => {
    const doc = await lpiMount(TemplatesCreateTab)
  })
})
