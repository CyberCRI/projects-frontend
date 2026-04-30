import { ProjectOutputFactory } from '~~/tests/factories/project.factory'
import ResourcesRecap from '~/components/resources/ResourcesRecap.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'
import useProjectsStore from '~/stores/useProjects'
import pinia from '~/stores'

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
    const props = {
      target: '/file',
      redirect: '/redirect',
    }
    const wrapper = lpiShallowMount(ResourcesRecap, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
