import RegisterPage from '~/pages/RegisterPage/RegisterPage.vue'

import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { createRandomString } from '@/api/auth/keycloakUtils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('RegisterPage.vue', () => {
  it('should render component', async () => {
    const props = { token: createRandomString(6) }

    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/invitation/${props.token}/`, () => {
      const date = new Date()
      date.setFullYear(date.getFullYear() + 2)
      return {
        expire_at: date,
      }
    })

    const wrapper = await lpiMountSuspended(RegisterPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
