import ProjectEditDescriptionTab from '~/pages/ProjectPageV2/Tabs/ProjectEditDescriptionTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { ProjectFactory } from '~~/tests/factories/project.factory'
import { UserFactory } from '~~/tests/factories/user.factory'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import useUsersStore from '~/stores/useUsers'

describe('ProjectEditDescriptionTab.vue', () => {
  it('should render component', async () => {
    const project = ProjectFactory.generate()
    const props = { project }

    const user = UserFactory.generate()
    const userStore = useUsersStore()
    userStore.userFromToken = userStore.userFromApi = user

    const wrapper = await lpiMountSuspended(ProjectEditDescriptionTab, {
      props,
      provide: {
        projectLayoutProjectPatched: vi.fn(),
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
