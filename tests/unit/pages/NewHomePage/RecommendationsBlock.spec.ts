import RecommendationBlock from '@/components/search/Recommendations/RecommendationBlock.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/locales/i18n'
import { describe, expect, it } from 'vitest'
import flushPromises from 'flush-promises'
import MockComponent from '../../../helpers/MockComponent.vue'
import { ProjectOutputFactory } from '../../../factories/project.factory'
import { UserFactory } from '../../../factories/user.factory'
import {
    getRandomProjectsRecommendationsForUser,
    getRandomUsersRecommendationsForUser,
} from '@/api/recommendations.service'

vi.mock('@/api/recommendations.service', () => ({
    getRandomProjectsRecommendationsForUser: vi.fn(),
    getRandomUsersRecommendationsForUser: vi.fn(),
}))
vi.mocked(getRandomProjectsRecommendationsForUser).mockResolvedValue(
    ProjectOutputFactory.generateMany(2)
)
vi.mocked(getRandomUsersRecommendationsForUser).mockResolvedValue(UserFactory.generateMany(2))

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const storeFactory = (loggedIn) => ({
    modules: {
        projectCategories: {
            namespaced: true,
            getters: {
                allOrderedByOrderId: vi.fn().mockReturnValue([]),
            },
        },
        organizations: {
            state: {
                current: { id: 'TEST', code: 'TEST' },
            },
            namespaced: true,
            getters: {
                current: vi.fn().mockReturnValue({ id: 'TEST', code: 'TEST' }),
            },
        },
        users: {
            namespaced: true,
            getters: {
                isLoggedIn: vi.fn().mockReturnValue(loggedIn),
            },
        },
    },
})

const router = [{ name: 'Home', path: '/', component: MockComponent }]

const props = {}

describe('RecommendationBlock', () => {
    it('should render RecommendationBlock', async () => {
        let wrapper = lpiShallowMount(RecommendationBlock, {
            props,
            store: storeFactory(false),
            router,
            i18n,
        })
        await flushPromises()
        expect(wrapper.exists()).toBeTruthy()
    })

    it('should display projects reco for non connected user', async () => {
        let wrapper = lpiShallowMount(RecommendationBlock, {
            props,
            store: storeFactory(false),
            router,
            i18n,
        })
        await flushPromises()
        expect(wrapper.find('[data-test="project-recommendations"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="user-recommendations"]').exists()).toBe(false)
    })

    it('should display project and user reco for connected user', async () => {
        let wrapper = lpiShallowMount(RecommendationBlock, {
            props: props,
            store: storeFactory(true),
            router,
            i18n,
        })
        await flushPromises()

        expect(wrapper.find('[data-test="project-recommendations"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="user-recommendations"]').exists()).toBe(true)
    })
})
