import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { ProjectFactory, TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import ProjectSnapshotTab from '~/pages/ProjectPageV2/ProjectSnapshotTab.vue'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectSnapshotTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectSnapshotTab, {
      props,
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
