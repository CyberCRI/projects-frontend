import { lpiMount } from '@/../tests/helpers/LpiMount'
import TemplatesCreateTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesCreateTab.vue'
import { describe, expect, it } from 'vitest'
import { delay } from 'es-toolkit'
// import * as _ from '@/api/templates.service'

describe('TemplatesCreateTab.vue', () => {
  it('Mount', async () => {
    const wrapper = await lpiMount(TemplatesCreateTab)
    await wrapper.unmount()
  })
  it('CantSubmit', async () => {
    const wrapper = await lpiMount(TemplatesCreateTab)
    expect((wrapper.find('[data-test=submit]').element as any).disabled).toBe(true)

    wrapper.find('.form [data-test=name]').setValue('a test name')
    // need to wait 300, validation data form in useForm is debounced over 200ms
    await delay(300)
    expect((wrapper.find('[data-test=submit]').element as any).disabled).toBe(false)
    await wrapper.find('[data-test=submit]').trigger('click')
  })
})
