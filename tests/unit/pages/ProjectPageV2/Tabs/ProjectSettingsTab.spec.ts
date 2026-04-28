import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectSettingsTab from '~/pages/ProjectPageV2/Tabs/Settings/ProjectSettingsTab.vue'
import { OrganizationFactory } from '~~/tests/factories/organization.factory'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProjectSettingsTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const props = { project }

    registerEndpoint(`organization/`, () => {
      return PaginationsFactory.generate({ results: OrganizationFactory.generateMany(10) })
    })

    const wrapper = await lpiMountSuspended(ProjectSettingsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
