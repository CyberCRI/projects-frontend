import ProfileProjectsEditTab from '~/pages/UserProfilePageV2/Tabs/ProfileProjectsEditTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { userTranslatedFactory } from '~~/tests/factories/user.factory'
import { ProjectFactory } from '~~/tests/factories/project.factory'
import FollowFactory from '~~/tests/factories/follow.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

describe('ProfileProjectsEditTab.vue', () => {
  it('should render component', async () => {
    const user = userTranslatedFactory.generate()
    const props = { user }

    registerEndpoint(`user/${user.id}/follow/`, () => FollowFactory.generateMany(5))
    registerEndpoint(`project/`, () =>
      PaginationsFactory.generate({ results: ProjectFactory.generateMany(10) })
    )

    const wrapper = await lpiMountSuspended(ProfileProjectsEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
