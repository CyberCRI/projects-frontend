import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import ProjectMemberSection from '@/components/group/ProjectMemberSection/ProjectMemberSection.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { GroupMemberFactory } from '@/../tests/factories/group-member.factory'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('ProjectMemberSection.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      i18n,
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
