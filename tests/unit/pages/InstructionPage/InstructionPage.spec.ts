import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import InstructionPage from '~/pages/InstructionPage/InstructionPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { InstructionFactory } from '../../../factories/instruction.factory'

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
