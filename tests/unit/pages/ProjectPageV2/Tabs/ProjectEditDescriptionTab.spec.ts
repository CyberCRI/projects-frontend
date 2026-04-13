import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import ProjectEditDescriptionTab from '@/pages/ProjectPageV2/Tabs/ProjectEditDescriptionTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ProjectFactory } from '../../../../factories/project.factory'
import { UserFactory } from '../../../../factories/user.factory'
import useUsersStore from '@/stores/useUsers'

describe('ProjectEditDescriptionTab.vue', () => {
  it('should render component', async () => {
    const project = ProjectFactory.generate()
    const props = { project }

    const user = UserFactory.generate()
    const userStore = useUsersStore()
    userStore.userFromToken = userStore.userFromApi = user

    const wrapper = await lpiMountSuspended(ProjectEditDescriptionTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
