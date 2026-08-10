import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectSnapshotTab from '~/pages/ProjectPageV2/ProjectSnapshotTab.vue'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
