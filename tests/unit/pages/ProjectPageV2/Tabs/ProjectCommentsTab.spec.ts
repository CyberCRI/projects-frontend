import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectCommentsTab from '@/pages/ProjectPageV2/Tabs/ProjectCommentsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ProjectFactory } from '../../../../factories/project.factory'
import { CommentFactory } from '../../../../factories/comment.factory'

describe('ProjectCommentsTab.vue', () => {
  it('should render component', async () => {
    const project = ProjectFactory.generate()
    const comments = CommentFactory.generateMany(10)
    const props = { project, comments }

    const wrapper = await lpiMount(ProjectCommentsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
