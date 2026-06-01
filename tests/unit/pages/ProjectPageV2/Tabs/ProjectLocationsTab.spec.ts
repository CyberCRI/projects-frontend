import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectLocationsTab from '~/pages/ProjectPageV2/Tabs/Locations/ProjectLocationsTab.vue'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import LocationFactory from '~~/tests/factories/location.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectLocationsTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()

    registerEndpoint(`project/${project.id}/location/`, () => LocationFactory.generateMany(10))

    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectLocationsTab, {
      props,
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
