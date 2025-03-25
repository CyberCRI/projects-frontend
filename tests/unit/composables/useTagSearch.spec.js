import { describe, it, expect, beforeEach, vi } from 'vitest'
import useTagSearch from '@/composables/useTagSearch.js'
import useOrganizationsStore from '@/stores/useOrganizations'
import { getAllOrgClassifications } from '@/api/tag-classification.service'

vi.mock('@/stores/useOrganizations')
vi.mock('@/api/tag-classification.service', () => ({
  getAllOrgClassifications: vi
    .fn()
    .mockResolvedValue({ count: 1, results: [{ id: 1, title: 'test' }] }),
  getOrgClassificationTags: vi
    .fn()
    .mockResolvedValue({ count: 1, results: [{ id: 1, title: 'test' }] }),
}))

describe('useTagSearch', () => {
  let organizationsStoreMock

  beforeEach(() => {
    organizationsStoreMock = {
      current: {
        code: 'org-code',
        default_skills_tags: ['skill1', 'skill2'],
        default_projects_tags: ['project1', 'project2'],
      },
    }
    useOrganizationsStore.mockReturnValue(organizationsStoreMock)
  })

  describe('organizationTags', () => {
    it('returns default skills tags when useSkills is true', () => {
      const { organizationTags } = useTagSearch({ useSkills: true })
      expect(organizationTags.value).toEqual(['skill1', 'skill2'])
    })

    it('returns default projects tags when useProjects is true', () => {
      const { organizationTags } = useTagSearch({ useProjects: true })
      expect(organizationTags.value).toEqual(['project1', 'project2'])
    })

    it('returns empty array when hideOrganizationTags is true', () => {
      const { organizationTags } = useTagSearch({ hideOrganizationTags: true })
      expect(organizationTags.value).toEqual([])
    })

    it('returns both skills and projects tags when useSkills and useProjects are true', () => {
      const { organizationTags } = useTagSearch({ useSkills: true, useProjects: true })
      expect(organizationTags.value).toEqual(['skill1', 'skill2', 'project1', 'project2'])
    })

    it('returns empty array when none of the conditions are true', () => {
      const { organizationTags } = useTagSearch()
      expect(organizationTags.value).toEqual([])
    })
  })

  describe('orgClassifications', () => {
    it('returns filtered classifications based on classificationType', async () => {
      getAllOrgClassifications.mockResolvedValue({
        results: [
          {
            id: 1,
            type: 'type1',
            is_enabled_for_projects: true,
            is_enabled_for_skills: true,
          },
          {
            id: 2,
            type: 'type2',
            is_enabled_for_projects: false,
            is_enabled_for_skills: true,
          },
        ],
      })
      const { orgClassifications, fetchAllClassifications } = useTagSearch({
        classificationType: 'type1',
      })
      await fetchAllClassifications()
      expect(orgClassifications.value).toEqual([
        {
          id: 1,
          type: 'type1',
          is_enabled_for_projects: true,
          is_enabled_for_skills: true,
        },
      ])
    })

    it('returns filtered classifications based on useProjects', async () => {
      getAllOrgClassifications.mockResolvedValue({
        results: [
          {
            id: 1,
            type: 'type1',
            is_enabled_for_projects: true,
            is_enabled_for_skills: true,
          },
          {
            id: 2,
            type: 'type2',
            is_enabled_for_projects: false,
            is_enabled_for_skills: true,
          },
        ],
      })
      const { orgClassifications, fetchAllClassifications } = useTagSearch({
        useProjects: true,
      })
      await fetchAllClassifications()
      expect(orgClassifications.value).toEqual([
        {
          id: 1,
          type: 'type1',
          is_enabled_for_projects: true,
          is_enabled_for_skills: true,
        },
      ])
    })

    it('returns filtered classifications based on useSkills', async () => {
      getAllOrgClassifications.mockResolvedValue({
        results: [
          {
            id: 1,
            type: 'type1',
            is_enabled_for_projects: true,
            is_enabled_for_skills: true,
          },
          {
            id: 2,
            type: 'type2',
            is_enabled_for_projects: false,
            is_enabled_for_skills: true,
          },
        ],
      })
      const { orgClassifications, fetchAllClassifications } = useTagSearch({
        useSkills: true,
      })
      await fetchAllClassifications()
      expect(orgClassifications.value).toEqual([
        {
          id: 1,
          type: 'type1',
          is_enabled_for_projects: true,
          is_enabled_for_skills: true,
        },
        {
          id: 2,
          type: 'type2',
          is_enabled_for_projects: false,
          is_enabled_for_skills: true,
        },
      ])
    })

    it('returns all classifications when no filters are applied', async () => {
      getAllOrgClassifications.mockResolvedValue({
        results: [
          {
            id: 1,
            type: 'type1',
            is_enabled_for_projects: true,
            is_enabled_for_skills: true,
          },
          {
            id: 2,
            type: 'type2',
            is_enabled_for_projects: false,
            is_enabled_for_skills: true,
          },
        ],
      })
      const { orgClassifications, fetchAllClassifications } = useTagSearch()
      await fetchAllClassifications()
      expect(orgClassifications.value).toEqual([
        {
          id: 1,
          type: 'type1',
          is_enabled_for_projects: true,
          is_enabled_for_skills: true,
        },
        {
          id: 2,
          type: 'type2',
          is_enabled_for_projects: false,
          is_enabled_for_skills: true,
        },
      ])
    })
  })
  describe('selectedClassification', () => {
    it('returns the selected classification based on selectedClassificationId', async () => {
      getAllOrgClassifications.mockResolvedValue({
        results: [
          {
            id: 1,
            type: 'type1',
            is_enabled_for_projects: true,
            is_enabled_for_skills: true,
          },
          {
            id: 2,
            type: 'type2',
            is_enabled_for_projects: false,
            is_enabled_for_skills: true,
          },
        ],
      })
      const { selectedClassification, selectedClassificationId, fetchAllClassifications } =
        useTagSearch()
      await fetchAllClassifications()
      selectedClassificationId.value = 1
      expect(selectedClassification.value).toEqual({
        id: 1,
        type: 'type1',
        is_enabled_for_projects: true,
        is_enabled_for_skills: true,
      })
    })
  })

  describe('showTagSearch', () => {
    it('returns true when selectedClassificationId is not null and suggestedTags is empty', async () => {
      const results = [
        {
          id: 1,
          type: 'type1',
          is_enabled_for_projects: true,
          is_enabled_for_skills: true,
        },
        {
          id: 2,
          type: 'type2',
          is_enabled_for_projects: false,
          is_enabled_for_skills: true,
        },
      ]
      getAllOrgClassifications.mockResolvedValue({
        count: results.length,
        results,
      })
      const { showTagSearch, selectedClassificationId, fetchAllClassifications } = useTagSearch()
      await fetchAllClassifications()
      selectedClassificationId.value = 1
      expect(showTagSearch.value).toBe(true)
    })

    it('returns false when selectedClassificationId is null', async () => {
      const results = [
        {
          id: 1,
          type: 'type1',
          is_enabled_for_projects: true,
          is_enabled_for_skills: true,
        },
        {
          id: 2,
          type: 'type2',
          is_enabled_for_projects: false,
          is_enabled_for_skills: true,
        },
      ]
      getAllOrgClassifications.mockResolvedValue({
        count: results.length,
        results,
      })
      const { showTagSearch, selectedClassificationId, fetchAllClassifications } = useTagSearch()
      await fetchAllClassifications()
      selectedClassificationId.value = null
      expect(showTagSearch.value).toBe(false)
    })

    it('returns false when suggestedTags is not empty', async () => {
      const results = [
        {
          id: 1,
          type: 'type1',
          is_enabled_for_projects: true,
          is_enabled_for_skills: true,
        },
        {
          id: 2,
          type: 'type2',
          is_enabled_for_projects: false,
          is_enabled_for_skills: true,
        },
      ]
      getAllOrgClassifications.mockResolvedValue({
        count: results.length,
        results,
      })
      const { showTagSearch, selectedClassificationId, suggestedTags, fetchAllClassifications } =
        useTagSearch()
      await fetchAllClassifications()
      selectedClassificationId.value = 1
      suggestedTags.value = ['tag1', 'tag2']
      expect(showTagSearch.value).toBe(false)
    })
  })
})
