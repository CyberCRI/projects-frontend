import ProfileResourcesTab from '~/pages/UserProfilePageV2/Tabs/ProfileResourcesTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { AttachmentLinkFactory } from '~~/tests/factories/attachment-link.factory'
import { AttachmentFileFactory } from '~~/tests/factories/attachment-file.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { UserFactory } from '~~/tests/factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProfileResourcesTab.vue', () => {
  it('should render component', async () => {
    const props = {
      user: UserFactory.generate(),
      isInEditingMode: false,
    }

    registerEndpoint(`user/${props.user.id}/link/`, () => {
      return PaginationsFactory.generate({
        results: AttachmentLinkFactory.generateMany(10),
      })
    })
    registerEndpoint(`user/${props.user.id}/file/`, () => {
      return PaginationsFactory.generate({
        results: AttachmentFileFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(ProfileResourcesTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
