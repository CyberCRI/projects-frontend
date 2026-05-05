import GroupTeamSection from '~/components/group/GroupForm/GroupTeamSection.vue'
import { UserFactory } from '~~/tests/factories/user.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import { users } from '~~/tests/playwright/variables'
import { lpiMount } from '~~/tests/helpers/LpiMount'
import useUsersStore from '~/stores/useUsers'
import pinia from '~/stores'

describe('GroupTeamSection.vue', () => {
  let wrapper
  let defaultParams
  beforeEach(() => {
    defaultParams = {
      props: {
        modelValue: UserFactory.generateMany(2),
      },
    }

    const user = UserFactory.generate()
    const usersStore = useUsersStore(pinia)
    usersStore.userFromApi = user
  })
  it('should render GroupTeamSection component', () => {
    wrapper = lpiMount(GroupTeamSection, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
  it('should emit the update-team event', () => {
    wrapper = lpiMount(GroupTeamSection, defaultParams)
    const vm: any = wrapper.vm

    vm.addUsers([])
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
