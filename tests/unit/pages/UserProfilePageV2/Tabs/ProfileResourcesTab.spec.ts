import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import ProfileResourcesTab from '~/pages/UserProfilePageV2/Tabs/ProfileResourcesTab.vue'

import { describe, expect, it } from 'vitest'
import { UserFactory } from '../../../../factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../../factories/paginations.factory'
import { AttachmentFileFactory } from '../../../../factories/attachment-file.factory'
import { AttachmentLinkFactory } from '../../../../factories/attachment-link.factory'
import { flushPromises } from '@vue/test-utils'

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
