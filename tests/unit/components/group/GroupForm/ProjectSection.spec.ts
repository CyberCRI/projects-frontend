import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import ProjectSection from '~/components/group/GroupForm/ProjectSection.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { lpiMount } from '~~/tests/helpers/LpiMount'

const projects = TranslatedProjectFactory.generateMany(2).map((project) => ({ ...project }))

describe('ProjectSection.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        modelValue: projects,
      },
    }
  })

  it('should render ProjectSection component', () => {
    wrapper = lpiMount(ProjectSection, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
