import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import { TranslatedProjectFactory } from '@/../tests/factories/project.factory'
import { lpiShallowMount, lpiMount } from '@/../tests/helpers/LpiMount'
import GoalDrawer from '@/components/project/goal/GoalDrawer.vue'
import useOrganizationsStore from '~/stores/useOrganizations'
import { beforeEach, describe, expect, it } from 'vitest'
import useProjectsStore from '~/stores/useProjects'
import pinia from '~/stores'

describe('GoalDrawer.vue', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    const projectsStore = useProjectsStore(pinia)

    projectsStore.project = {
      ...TranslatedProjectFactory.generate(),
      files: [],
      links: [],
    }
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()
    defaultProps = {
      project: projectsStore.project,
    }
  })
  it('should render component', () => {
    const wrapper = lpiShallowMount(GoalDrawer, { props: defaultProps })
    expect(wrapper.exists()).toBe(true)
  })

  it('should render GoalDrawer component fully', () => {
    wrapper = lpiMount(GoalDrawer, { props: defaultProps })
    expect(wrapper.exists()).toBe(true)
  })

  it('should emit the close event', () => {
    wrapper = lpiMount(GoalDrawer, { props: defaultProps })
    const vm: any = wrapper.vm

    vm.closeModalNoConfirm()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
