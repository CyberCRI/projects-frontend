import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectPrivateExchangeTab from '@/pages/ProjectPageV2/Tabs/ProjectPrivateExchangeTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { TranslatedProjectFactory } from '../../../../factories/project.factory'
import { ProjectTeamOutputFactory } from '../../../../factories/project-member.factory'

describe('ProjectPrivateExchangeTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const projectMessages = []
    const team = ProjectTeamOutputFactory.generate()
    const props = { project, projectMessages, team }

    const wrapper = await lpiMount(ProjectPrivateExchangeTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
