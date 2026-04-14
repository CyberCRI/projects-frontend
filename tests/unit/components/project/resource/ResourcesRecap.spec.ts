import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import ResourcesRecap from '@/components/resources/ResourcesRecap.vue'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import pinia from '@/stores'
import useProjectsStore from '@/stores/useProjects'
import { beforeEach, describe, expect, it } from 'vitest'

describe('ResourcesRecap.vue', () => {
  beforeEach(() => {
    const projectsStore = useProjectsStore(pinia)

    projectsStore.project = {
      ...ProjectOutputFactory.generate(),
      files: [],
      links: [],
    }
  })
  it('should render component', () => {
    const wrapper = lpiShallowMount(ResourcesRecap, {})
    expect(wrapper.exists()).toBe(true)
  })
})
