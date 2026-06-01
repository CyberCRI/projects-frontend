import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import TemplatesTab from '~/pages/AdminPortalPageV2/Tabs/TemplatesTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('TemplatesTab.vue', () => {
  it('BackendResult', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/template/`, () =>
      PaginationsFactory.generate({
        results: [
          { id: 1, name: 'template-1' },
          { id: 2, name: 'template-2' },
        ],
      })
    )
    const wrapper = await lpiMountSuspended(TemplatesTab)
    await flushPromises()
    console.log(wrapper.html())
    expect(wrapper.findAll('li').length).toEqual(2)
  })
  it('DeleteTemplate', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/template/`, () =>
      PaginationsFactory.generate({
        results: [
          { id: 1, name: 'template-1' },
          { id: 2, name: 'template-2' },
        ],
      })
    )

    const wrapper = await lpiMountSuspended(TemplatesTab)
    await expect(wrapper.findAll('[data-test^=template-modal-delete]').length).toEqual(0)
    await wrapper.find(`[data-test=template-list-2] [data-test=action-delete]`).trigger('click')
    await expect(wrapper.findAll('[data-test^=template-modal-delete]').length).toEqual(1)
  })

  it('EditTemplate', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/template/`, () =>
      PaginationsFactory.generate({
        results: [
          { id: 1, name: 'template-1' },
          { id: 2, name: 'template-2' },
        ],
      })
    )
    const wrapper = await lpiMountSuspended(TemplatesTab)
    await wrapper.find(`[data-test=template-list-2] [data-test=action-edit]`).trigger('click')
  })

  it('umount', async () => {
    const wrapper = await lpiMountSuspended(TemplatesTab)
    await wrapper.unmount()
  })

  it('BackendError', async () => {
    const organizationCode = useOrganizationCode()

    registerEndpoint(`organization/${organizationCode}/template`, () => {
      throw createError({ statusCode: 500 })
    })
    const wrapper = await lpiMountSuspended(TemplatesTab)
    expect(wrapper.find('.error')).toBeTruthy()
  })
})
