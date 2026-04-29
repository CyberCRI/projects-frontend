import InstructionListPage from '~/pages/InstructionListPage/InstructionListPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { InstructionFactory } from '~~/tests/factories/instruction.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('InstructionListPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/instruction/`, () => {
      return PaginationsFactory.generate({
        results: InstructionFactory.generateMany(10),
      })
    })
    const wrapper = await lpiMountSuspended(InstructionListPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
