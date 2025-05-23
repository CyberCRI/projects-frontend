import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import UserSkills from '@/components/people/skill/UserSkills.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const factory = (props) => {
  return lpiShallowMount(UserSkills, {
    props: {
      skills: [
        {
          id: 14685,
          user: '1cb609f9-b5c5-4f09-89cd-218a00545c70',
          tag: {
            id: 'Q11634',
            title: 'art of sculpture',
            description:
              'art of making figures or designs in relief or the round by carving wood, moulding plaster, etc',
          },
          level: 4,
          level_to_reach: 4,
        },
        {
          id: 14683,
          user: '1cb609f9-b5c5-4f09-89cd-218a00545c70',
          tag: {
            id: 'Q11190',
            title: 'medicine',
            description:
              'science and practice of the diagnosis, treatment, and prevention of disease',
          },
          level: 3,
          level_to_reach: 4,
        },
        {
          id: 14684,
          user: '1cb609f9-b5c5-4f09-89cd-218a00545c70',
          tag: {
            id: 'Q8034374',
            title: 'word usage',
            description: 'the way in which words are used in a language',
          },
          level: 1,
          level_to_reach: 2,
        },
      ],
      ...props,
    },
  })
}

describe('UserSkills.vue', () => {
  it('renders component', () => {
    const wrapper = factory({})
    expect(wrapper.exists()).toBe(true)
  })

  it('displays all skills', async () => {
    const limit = 2
    const wrapper = factory({ limit })
    const vm: any = wrapper.vm

    expect(vm.visibleSkills.length).toEqual(limit)
    wrapper.setProps({ fullList: true })
    await vm.$nextTick()
    expect(vm.visibleSkills.length).toEqual(vm.skills.length)
  })
})
