import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import MapRecap from '@/components/project/map/MapRecap.vue'
import pinia from '@/stores'
import useProjectsStore from '@/stores/useProjects'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
describe('MapRecap.vue', () => {
  it('should render component', () => {
    beforeEach(() => {
      const projectsStore = useProjectsStore(pinia)

      projectsStore.project = {
        ...ProjectOutputFactory.generate(),
        files: [],
        links: [],
      }
    })
    const wrapper = lpiShallowMount(MapRecap, {
      provide: {
        projectLayoutToggleAddModal: vi.fn(),
      },
      props: {
        locations: [
          {
            id: 32,
            title: 'Office',
            description: 'test',
            lat: 48.866667,
            lng: 2.333333,
            type: 'team',
            project: {
              id: 'string',
              title: 'string',
              purpose: 'string',
              header_image: {
                id: 0,
                name: 'string',
                url: 'string',
                height: 2147483647,
                width: 2147483647,
                created_at: '2022-06-28T09:59:48.743Z',
                variations: 'string',
              },
            },
          },
        ],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
