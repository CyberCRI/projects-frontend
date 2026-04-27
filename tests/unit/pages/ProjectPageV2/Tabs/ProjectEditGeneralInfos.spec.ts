import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import ProjectEditGeneralInfos from '@/pages/ProjectPageV2/Tabs/Summary/ProjectEditGeneralInfos.vue'

describe('ProjectEditGeneralInfos.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(ProjectEditGeneralInfos)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
