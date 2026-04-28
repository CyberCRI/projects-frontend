import { ProjectFactory, ProjectOutputFactory } from '~~/tests/factories/project.factory'
import DescriptionDrawer from '~/components/project/description/DescriptionDrawer.vue'
import { OrganizationOutputFactory } from '~~/tests/factories/organization.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { beforeEach, vi, describe, expect, it } from 'vitest'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import useProjectsStore from '~/stores/useProjects'
import pinia from '~/stores'

describe('DescriptionDrawer.vue', () => {
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
    defaultParams = {
      props: {
        project: {
          ...ProjectFactory.generate(),
          organizations: [OrganizationOutputFactory.generate()],
        },
        isOpened: true,
      },
      provide: {
        projectLayoutProjectPatched: vi.fn(),
      },
    }
  })

  it('should render DescriptionDrawer component', () => {
    wrapper = lpiShallowMount(DescriptionDrawer, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
