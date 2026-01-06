import { lpiMount } from '@/../tests/helpers/LpiMount'
import TemplatesTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesTab.vue'
import { describe, expect, it, vi } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

describe('TemplatesTab.vue', () => {
  it('BackendError', async () => {
    registerEndpoint(`organization/CRI/template`, () => {
      throw createError({ statusCode: 500 })
    })
    const wrapper = await lpiMount(TemplatesTab)
    expect(wrapper.find('.error')).toBeTruthy()
  })
  it('BackendResult', async () => {
    vi.mock('@/api/templates.service', () => ({
      getTemplates: () => ({
        loading: false,
        data: {
          results: [
            { id: 1, name: 'template-1' },
            { id: 2, name: 'template-2' },
          ],
        },
        status: 'success',
      }),
    }))
    const wrapper = await lpiMount(TemplatesTab)
    expect(wrapper.findAll('li').length).toEqual(2)
  })
  it('DeleteTemplate', async () => {
    vi.mock('@/api/templates.service', () => ({
      getTemplates: () => ({
        loading: false,
        data: {
          results: [
            { id: 1, name: 'template-1' },
            { id: 2, name: 'template-2' },
          ],
        },
        status: 'success',
      }),
      deleteTemplate: vi.fn(),
    }))

    const wrapper = await lpiMount(TemplatesTab)
    await expect(wrapper.findAll('[data-test^=template-modal-delete]').length).toEqual(0)
    await wrapper.find(`[data-test=template-list-2] [data-test=action-delete]`).trigger('click')
    await expect(wrapper.findAll('[data-test^=template-modal-delete]').length).toEqual(1)
  })
  it('EditTemplate', async () => {
    vi.mock('@/api/templates.service', () => ({
      getTemplates: () => ({
        loading: false,
        data: {
          results: [
            { id: 1, name: 'template-1' },
            { id: 2, name: 'template-2' },
          ],
        },
        status: 'success',
      }),
    }))
    const wrapper = await lpiMount(TemplatesTab)
    await wrapper.find(`[data-test=template-list-2] [data-test=action-edit]`).trigger('click')
  })
  it('umount', async () => {
    const wrapper = await lpiMount(TemplatesTab)
    await wrapper.unmount()
  })
})
