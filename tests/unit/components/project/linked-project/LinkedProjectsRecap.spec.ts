import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import LinkedProjectsRecap from '@/components/project/linked-project/LinkedProjectsRecap.vue'
import { ProjectFactory } from '@/../tests/factories/project.factory'

import { describe, expect, it } from 'vitest'

describe('LinkedProjectsRecap.vue', () => {
  it('should render component', () => {
    const wrapper = lpiShallowMount(LinkedProjectsRecap, {
      props: {
        linkedProjects: [
          {
            reason: 'élément de',
            project: ProjectFactory.generate(),
          },
          {
            reason: 'inspiré de',
            project: ProjectFactory.generate(),
          },
        ],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
