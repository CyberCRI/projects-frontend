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
    const doc = await lpiMount(TemplatesTab)
    await delay(1)
    expect(doc.find('.error')).toBeTruthy()
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
    const doc = await lpiMount(TemplatesTab)
    expect(doc.find('.loading')).toBeTruthy()
    await delay(10)
    expect(doc.findAll('li').length).toEqual(2)
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
    const doc = await lpiMount(TemplatesTab)
    await delay(1)
    expect(doc.findAll('[data-test^=template-modal-delete]').length).toEqual(0)
    doc.find(`[data-test=template-list-666] [data-test=action-delete]`).trigger('click')
    await delay(1)
    expect(doc.findAll('[data-test^=template-modal-delete]').length).toEqual(1)
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
    const doc = await lpiMount(TemplatesTab)
    await delay(1)
    doc.find(`[data-test=template-list-666] [data-test=action-edit]`).trigger('click')
  })
})
