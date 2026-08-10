import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectDescriptionTab from '~/pages/ProjectPageV2/Tabs/Description/ProjectDescriptionTab.vue'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProjectDescriptionTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectDescriptionTab, {
      props,
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
