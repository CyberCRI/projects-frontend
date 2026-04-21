import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import InstructionListPage from '@/pages/InstructionListPage/InstructionListPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../factories/paginations.factory'
import { InstructionFactory } from '../../../factories/instruction.factory'

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
