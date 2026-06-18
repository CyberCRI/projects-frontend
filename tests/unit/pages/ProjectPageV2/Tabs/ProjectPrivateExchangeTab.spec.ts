import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectPrivateExchangeTab from '~/pages/ProjectPageV2/Tabs/PrivateExchange/ProjectPrivateExchangeTab.vue'
import { ProjectTeamOutputFactory } from '~~/tests/factories/project-member.factory'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { CommentFactory } from '~~/tests/factories/comment.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProjectPrivateExchangeTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()

    registerEndpoint(`project/${project.id}/project-message/`, () => {
      return PaginationsFactory.generate({
        results: CommentFactory.generateMany(10),
      })
    })

    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectPrivateExchangeTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
