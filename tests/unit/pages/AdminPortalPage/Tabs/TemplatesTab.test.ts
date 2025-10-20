import { lpiMount } from '@/../tests/helpers/LpiMount'
import TemplatesTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesTab.vue'
import { describe, expect, it } from 'vitest'
import { delay } from 'es-toolkit'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

describe('TemplatesTab.vue', () => {
  it('BackendError', async () => {
    registerEndpoint('organization/CRI/template', () => {
      throw createError({ statusCode: 500 })
    })
    const wrapper = await lpiMount(TemplatesTab)
    expect(wrapper.find('.error')).toBeTruthy()
  })
  it('BackendResult', async () => {
    registerEndpoint('organization/CRI/template', () => {
      return {
        results: [
          { id: 1, name: 'template-1' },
          { id: 2, name: 'template-2' },
        ],
      }
    })
    const wrapper = await lpiMount(TemplatesTab)
    await delay(1)
    expect(wrapper.findAll('li').length).toEqual(2)
  })
  it('DeleteTemplate', async () => {
    registerEndpoint('organization/CRI/template', () => {
      return {
        results: [
          { id: 1, name: 'template-1' },
          { id: 666, name: 'template-2' },
        ],
      }
    })
    const wrapper = await lpiMount(TemplatesTab)
    await delay(1)
    expect(wrapper.findAll('[data-test^=template-modal-delete]').length).toEqual(0)
    await wrapper.find(`[data-test=template-list-666] [data-test=action-delete]`).trigger('click')
    expect(wrapper.findAll('[data-test^=template-modal-delete]').length).toEqual(1)
  })
  it('EditTemplate', async () => {
    registerEndpoint('organization/CRI/template', () => {
      return {
        results: [
          { id: 1, name: 'template-1' },
          { id: 666, name: 'template-2' },
        ],
      }
    })
    const wrapper = await lpiMount(TemplatesTab)
    await wrapper.find(`[data-test=template-list-666] [data-test=action-edit]`).trigger('click')
  })
  it('umount', async () => {
    const wrapper = await lpiMount(TemplatesTab)
    await wrapper.unmount()
  })
})
