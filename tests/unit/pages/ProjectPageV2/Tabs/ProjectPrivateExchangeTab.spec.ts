import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectPrivateExchangeTab from '~/pages/ProjectPageV2/Tabs/PrivateExchange/ProjectPrivateExchangeTab.vue'
import { ProjectTeamOutputFactory } from '~~/tests/factories/project-member.factory'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
