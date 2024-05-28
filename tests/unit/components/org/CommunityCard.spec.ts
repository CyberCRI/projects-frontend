import { lpiShallowMount } from '../../../helpers/LpiMount'
import CommunityCard from '@/components/org/CommunityCard.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
describe('CommunityCard', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                community: {
                    logo_image: {
                        url: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/e6780668-3d57-467b-aa58-df65416c0bd66086b3c3d9c3a0d87b16cae9_logo.png?se=2022-05-09T10%3A21%3A55Z&sp=r&sv=2021-04-10&sr=b&sig=NOT8SjamWz95I1y6MHOoKnQ78oQKsVQzjFdOl81z%2BZg%3D',
                        variations: {
                            small: 'https://criparisdevlabprojects.blob.core.windows.net/projects/organization/logo/e6780668-3d57-467b-aa58-df65416c0bd66086b3c3d9c3a0d87b16cae9_logo.png?se=2022-05-09T10%3A21%3A55Z&sp=r&sv=2021-04-10&sr=b&sig=NOT8SjamWz95I1y6MHOoKnQ78oQKsVQzjFdOl81z%2BZg%3D',
                        },
                    },
                    name: 'Test',
                    is_logo_visible_on_parent_dashboard: true,
                    background_color: 'rgb(132, 30, 62)',
                },
            },
            stubs: {
                PatatoidIcon: { template: '<div class="patatoid-stub" />' },
            },
        }
    })

    it('should render CommunityCard component', () => {
        wrapper = lpiShallowMount(CommunityCard, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should find the image selectors', () => {
        wrapper = lpiShallowMount(CommunityCard, defaultParams)

        const image = wrapper.find('img')

        expect(image.exists()).toBeTruthy()
    })

    it('should not find the image selectors but the title and the background component', () => {
        defaultParams.props.community.logo_image = null
        wrapper = lpiShallowMount(CommunityCard, defaultParams)

        const image = wrapper.find('img')
        const patatoid = wrapper.find('.patatoid-stub')
        const title = wrapper.find('.community-card__name')

        expect(image.exists()).toBeFalsy()
        expect(patatoid.exists()).toBeTruthy()
        expect(title.exists()).toBeTruthy()
        expect(title.text()).toContain(defaultParams.props.community.name)
    })
})
