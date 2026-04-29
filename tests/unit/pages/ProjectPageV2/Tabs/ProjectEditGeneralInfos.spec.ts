import ProjectEditGeneralInfos from '~/pages/ProjectPageV2/Tabs/ProjectEditGeneralInfos.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProjectEditGeneralInfos.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(ProjectEditGeneralInfos)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
