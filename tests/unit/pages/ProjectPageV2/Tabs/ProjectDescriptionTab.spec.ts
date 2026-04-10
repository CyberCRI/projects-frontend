import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectDescriptionTab from '@/pages/ProjectPageV2/Tabs/ProjectDescriptionTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { TranslatedProjectFactory } from '../../../../factories/project.factory'

describe('ProjectDescriptionTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const props = { project }

    const wrapper = await lpiMount(ProjectDescriptionTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
