import GroupGalleryTab from '~/pages/GroupPageV2/Tabs/Gallery/GroupGalleryTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { groupTranslatedFactory } from '~~/tests/factories/group.factory'
import { ImageFactory } from '~~/tests/factories/image.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

describe('GroupGalleryTab.vue', () => {
  it('should render component', async () => {
    const group = groupTranslatedFactory.generate()
    group.modules.gallery = 10
    const props = { group }

    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/people-group/${group.id}/gallery/`, () => {
      return PaginationsFactory.generate({
        results: ImageFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(GroupGalleryTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
