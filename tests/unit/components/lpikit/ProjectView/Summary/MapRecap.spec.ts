import { lpiShallowMount } from '../../../../../helpers/LpiMount'
import MapRecap from '@/components/project/Recap/MapRecap.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
describe('MapRecap.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(MapRecap, {
            store: {
                modules: {
                    projects: {
                        module: true,
                        getters: {
                            project: () => ({ id: 1 }),
                        },
                    },
                },
            },
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
