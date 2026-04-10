import { lpiMount } from '@/../tests/helpers/LpiMount'
import SubGroupsTab from '@/pages/GroupPageV2/Tabs/SubGroups/SubGroupsTab.vue'

import { describe, expect, it } from 'vitest'
import { MockRouter } from '../../../../../helpers/router'
import { flushPromises } from '@vue/test-utils'
import { peopleGroupFactory } from '../../../../../factories/group.factory'

describe('SubGroupsTab.vue', () => {
  it('should render component', async () => {
    const group = peopleGroupFactory.generate()
    const props = {
      group,
    }

    const wrapper = await lpiMount(SubGroupsTab, { props, router: MockRouter() })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
