import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectSettingsTab from '@/pages/ProjectPageV2/Tabs/ProjectSettingsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { TranslatedProjectFactory } from '../../../../factories/project.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../../factories/paginations.factory'
import { OrganizationFactory } from '../../../../factories/organization.factory'

describe('ProjectSettingsTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const props = { project }

    registerEndpoint(`organization/`, () => {
      return PaginationsFactory.generate({ results: OrganizationFactory.generateMany(10) })
    })

    const wrapper = await lpiMount(ProjectSettingsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
