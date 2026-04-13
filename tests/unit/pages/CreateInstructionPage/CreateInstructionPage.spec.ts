import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import CreateInstructionPage from '@/pages/CreateInstructionPage/CreateInstructionPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

describe('CreateInstructionPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/people-groups-hierarchy/`, () => {
      return {
        id: 1,
        children: [],
      }
    })

    const wrapper = await lpiMountSuspended(CreateInstructionPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
