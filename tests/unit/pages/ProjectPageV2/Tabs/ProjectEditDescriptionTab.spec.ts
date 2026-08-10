import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectEditDescriptionTab from '~/pages/ProjectPageV2/Tabs/Description/ProjectEditDescriptionTab.vue'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { UserFactory } from '~~/tests/factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import useUsersStore from '~/stores/useUsers'
import { describe, expect, it } from 'vitest'

describe('ProjectEditDescriptionTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const props = { project }

    const user = UserFactory.generate()
    const userStore = useUsersStore()
    userStore.userFromToken = userStore.userFromApi = user

    registerEndpoint(`user/${user.id}/category-follow/`, () => {
      return PaginationsFactory.generate()
    })

    const wrapper = await lpiMountSuspended(ProjectEditDescriptionTab, {
      props,
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
