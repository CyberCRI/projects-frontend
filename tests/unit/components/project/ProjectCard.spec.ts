import { ProjectOutputFactory } from '~~/tests/factories/project.factory'
import ProjectCard from '~/components/project/ProjectCard.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'

import { beforeEach, describe, expect, it } from 'vitest'

describe('ProjectCard', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        project: ProjectOutputFactory.generate(),
      },
    }
  })

  it('should render ProjectCard component', () => {
    wrapper = lpiShallowMount(ProjectCard, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
