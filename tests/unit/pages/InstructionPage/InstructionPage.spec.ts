import InstructionPage from '~/pages/InstructionPage/InstructionPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { InstructionFactory } from '~~/tests/factories/instruction.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('InstructionPage.vue', () => {
  it('should render component', async () => {
    const instruction = InstructionFactory.generate()
    const props = { slugOrId: instruction.id }

    const organizationCode = useOrganizationCode()
    registerEndpoint(
      `organization/${organizationCode}/instruction/${props.slugOrId}/`,
      () => instruction
    )

    const wrapper = await lpiMountSuspended(InstructionPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
