import ProjectMemberSection from '~/components/group/ProjectMemberSection/ProjectMemberSection.vue'
import { GroupMemberFactory } from '~~/tests/factories/group-member.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import { lpiMount } from '~~/tests/helpers/LpiMount'

describe('ProjectMemberSection.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        members: GroupMemberFactory.generateMany(3),
      },
    }
  })

  it('should render ProjectMemberSection component', () => {
    wrapper = lpiMount(ProjectMemberSection, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
