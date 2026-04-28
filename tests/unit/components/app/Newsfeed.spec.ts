import Newsfeed from '~/components/app/NewsFeed.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ProjectOutputFactory } from '~~/tests/factories/project.factory'
import { AnnouncementFactory } from '~~/tests/factories/announcement.factory'
import { ProjectCategoryOutputFactory } from '~~/tests/factories/project-category.factory'
import pinia from '~/stores'
import useProjectCategoriesStore from '~/stores/useProjectCategories'
import useOrganizationsStore from '~/stores/useOrganizations'
import { OrganizationOutput } from '~/models/organization.model'

describe('Newsfeed', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { id: 'TEST', code: 'TEST' } as unknown as OrganizationOutput
    const projectCategories = useProjectCategoriesStore(pinia)
    projectCategories._all = ProjectCategoryOutputFactory.generateMany(2)
  })
  it('should render Newsfeed', async () => {
    const wrapper = lpiShallowMount(Newsfeed, { props: { newsfeed: [] } })
    await flushPromises()
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should display projects', async () => {
    const wrapper = lpiShallowMount(Newsfeed, {
      props: {
        newsfeed: [
          { id: 1, type: 'project', project: ProjectOutputFactory.generate() },
          { id: 2, type: 'project', project: ProjectOutputFactory.generate() },
        ],
      },
    })
    await flushPromises()
    expect(wrapper.findAll('newsfeed-project-item-stub')).toHaveLength(2)
  })

  it('should display announcements', async () => {
    const wrapper = lpiShallowMount(Newsfeed, {
      props: {
        newsfeed: [
          { id: 1, type: 'announcement', announcement: AnnouncementFactory.generate() },
          { id: 2, type: 'announcement', announcement: AnnouncementFactory.generate() },
        ],
      },
    })
    await flushPromises()
    expect(wrapper.findAll('newsfeed-announcements-item-stub')).toHaveLength(2)
  })

  it('should display news', async () => {
    const wrapper = lpiShallowMount(Newsfeed, {
      props: {
        newsfeed: [
          { id: 1, type: 'news', news: { id: 1 } }, /// TODO: news factory
          { id: 2, type: 'news', news: { id: 2 } },
        ],
      },
    })
    await flushPromises()
    expect(wrapper.findAll('news-item-stub')).toHaveLength(2)
  })

  it('should display mix of news, announcements and projects', async () => {
    const wrapper = lpiShallowMount(Newsfeed, {
      props: {
        newsfeed: [
          { id: 1, type: 'news', news: { id: 1 } }, /// TODO: news factory
          { id: 2, type: 'announcement', announcement: AnnouncementFactory.generate() },
          { id: 3, type: 'project', project: ProjectOutputFactory.generate() },
        ],
      },
    })
    await flushPromises()
    expect(wrapper.findAll('news-item-stub')).toHaveLength(1)
    expect(wrapper.findAll('newsfeed-announcements-item-stub')).toHaveLength(1)
    expect(wrapper.findAll('newsfeed-project-item-stub')).toHaveLength(1)
  })
})
