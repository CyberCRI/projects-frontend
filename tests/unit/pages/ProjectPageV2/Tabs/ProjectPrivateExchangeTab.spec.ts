import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { TranslatedProjectFactory } from '../../../../factories/project.factory'
import { ProjectTeamOutputFactory } from '../../../../factories/project-member.factory'
import ProjectPrivateExchangeTab from '@/pages/ProjectPageV2/Tabs/PrivateExchange/ProjectPrivateExchangeTab.vue'

describe('ProjectPrivateExchangeTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const projectMessages = []
    const team = ProjectTeamOutputFactory.generate()
    const props = { project, projectMessages, team }

    const wrapper = await lpiMountSuspended(ProjectPrivateExchangeTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
