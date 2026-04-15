import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import GroupGalleryTab from '@/pages/GroupPageV2/Tabs/Gallery/GroupGalleryTab.vue'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import { groupTranslatedFactory } from '../../../../../factories/group.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../../../factories/paginations.factory'
import { ImageFactory } from '../../../../../factories/image.factory'

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
