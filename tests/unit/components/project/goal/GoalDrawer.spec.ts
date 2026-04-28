import { OrganizationOutputFactory } from '~~/tests/factories/organization.factory'
import { ProjectOutputFactory } from '~~/tests/factories/project.factory'
import { lpiShallowMount, lpiMount } from '~~/tests/helpers/LpiMount'
import GoalDrawer from '~/components/project/goal/GoalDrawer.vue'
import useOrganizationsStore from '~/stores/useOrganizations'
import { beforeEach, describe, expect, it } from 'vitest'
import useProjectsStore from '~/stores/useProjects'
import pinia from '~/stores'

describe('GoalDrawer.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const projectsStore = useProjectsStore(pinia)

    projectsStore.project = {
      ...ProjectOutputFactory.generate(),
      files: [],
      links: [],
    }
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()
    defaultParams = {}
  })
  it('should render component', () => {
    const wrapper = lpiShallowMount(GoalDrawer, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })

  it('should render GoalDrawer component fully', () => {
    wrapper = lpiMount(GoalDrawer, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })

  it('should emit the close event', () => {
    wrapper = lpiMount(GoalDrawer, defaultParams)
    const vm: any = wrapper.vm

    vm.closeModalNoConfirm()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
