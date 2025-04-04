import { lpiMount } from '@/../tests/helpers/LpiMount'
import SkillsEditDrawer from '@/components/people/skill/SkillsEditDrawer.vue'

import english from '@/i18n/locales/en.json'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

import flushPromises from 'flush-promises'
import {
  getAllOrgClassifications,
  getOrgClassificationTags,
} from '@/api/tag-classification.service'
import { postUserSkill } from '@/api/people.service'

import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/api/people.service.ts', () => ({
  postUserSkill: vi.fn().mockResolvedValue({}),
}))

vi.mock('@/api/tag-classification.service', () => ({
  getOrgClassificationTags: vi
    .fn()
    .mockResolvedValue({ results: [{ id: 1 }, { id: 2 }, { id: 3 }] }),
  getAllOrgClassifications: vi.fn().mockResolvedValue({
    results: [
      {
        id: 123,
        slug: 'for-project',
        is_enabled_for_projects: true,
        is_enabled_for_skills: false,
      },
      {
        id: 456,
        slug: 'for-skill',
        is_enabled_for_projects: false,
        is_enabled_for_skills: true,
      },
      {
        id: 789,
        slug: 'for-skill-and-project',
        is_enabled_for_projects: true,
        is_enabled_for_skills: true,
      },
    ],
  }),
}))

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}
describe('SkillsEditDrawer.vue', () => {
  let wrapper

  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = {
      code: 'test',
      tags: [],
      enabled_projects_tag_classifications: [
        { id: 123, slug: 'for-project' },
        { id: 789, slug: 'for-skill-and-project' },
      ],
      enabled_skills_tag_classifications: [
        { id: 456, slug: 'for-skill' },
        { id: 789, slug: 'for-skill-and-project' },
      ],
      default_projects_tags: [{ id: 11 }, { id: 12 }, { id: 13 }],
      default_skills_tags: [{ id: 21 }, { id: 22 }, { id: 23 }],
    } as unknown as OrganizationOutput
    wrapper = lpiMount(SkillsEditDrawer, {
      props: {
        isOpen: true,
        type: 'skills',
        user: { id: 1, skills: [] },
        searchAllMode: true,
      },
      i18n,
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders BaseDrawer component', () => {
    expect(wrapper.findComponent({ name: 'BaseDrawer' }).exists()).toBe(true)
  })

  it('renders SearchInput component when in add-skill-mode', () => {
    expect(wrapper.findComponent({ name: 'search-input' }).exists()).toBe(true)
  })

  it('renders SkillEditor component when in edit-skill-mode', async () => {
    await wrapper.setData({ addedTalent: { tag: { id: 1 }, level: 1, level_to_reach: 1 } })
    expect(wrapper.findComponent({ name: 'skill-editor' }).exists()).toBe(true)
  })

  it('emits close event when BaseDrawer close button is clicked', async () => {
    await wrapper.findComponent({ name: 'base-drawer' }).vm.$emit('close')
    expect(wrapper.emitted().close).toBeTruthy()
  })

  it('emits skill-added event after saving a skill', async () => {
    wrapper.setData({ addedTalent: { tag: { id: 1 }, level: 1, level_to_reach: 1 } })
    await wrapper.vm.save()
    expect(wrapper.emitted()['skill-added']).toBeTruthy()
  })

  it('sets talent level correctly', async () => {
    const talent = { tag: { id: 1 }, level: 1, level_to_reach: 1 }
    wrapper.vm.setTalentLevel(talent, 3)
    expect(talent.level).toBe(3)
  })
})
