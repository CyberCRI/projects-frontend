import RecommendationBlock from '@/components/lpikit/Recommendations/RecommendationBlock.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/locales/i18n'
import { describe, expect, it } from 'vitest'
import flushPromises from 'flush-promises'
import MockComponent from '../../../helpers/MockComponent.vue'
import { ProjectOutputFactory } from '../../../factories/project.factory'
import { UserFactory } from '../../../factories/user.factory'
import { getProjectsRecommendations, getUsersRecommendations } from '@/api/recommendations.service'

vi.mock('@/api/recommendations.service', () => ({
    getProjectsRecommendations: vi.fn(),
    getUsersRecommendations: vi.fn(),
}))
vi.mocked(getProjectsRecommendations).mockResolvedValue(ProjectOutputFactory.generateMany(2))
vi.mocked(getUsersRecommendations).mockResolvedValue(UserFactory.generateMany(2))

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const store = {
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
                isLoggedIn: vi.fn().mockReturnValue(false),
            },
        },
    },
}

const connectedStore = {
    modules: {
        ...store.modules,
        users: {
            namespaced: true,
            getters: {
                id: vi.fn(),
                userFromApi: vi.fn(),
                getPermissions: vi.fn().mockReturnValue({}),
                isLoggedIn: vi.fn().mockReturnValue(true),
            },
            actions: {
                getUser: vi.fn(),
            },
        },
    },
}

const router = [{ name: 'Home', path: '/', component: MockComponent }]

const props = {
    organization: {
        code: 'TEST',
    },
    loggedIn: false,
}

const propsLoggedIn = {
    organization: {
        code: 'TEST',
    },
    loggedIn: true,
}

describe('RecommendationBlock', () => {
    it('should render RecommendationBlock', async () => {
        let wrapper = lpiShallowMount(RecommendationBlock, { props, store, router, i18n })
        await flushPromises()
        expect(wrapper.exists()).toBeTruthy()
    })

    it('should display projects reco for non connected user', async () => {
        let wrapper = lpiShallowMount(RecommendationBlock, { props, store, router, i18n })
        await flushPromises()
        expect(wrapper.find('[data-test="project-recommendations"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="user-recommendations"]').exists()).toBe(false)
    })

    it('should display project and user reco for connected user', async () => {
        let wrapper = lpiShallowMount(RecommendationBlock, {
            props: propsLoggedIn,
            store,
            router,
            i18n,
        })
        await flushPromises()

        expect(wrapper.find('[data-test="project-recommendations"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="user-recommendations"]').exists()).toBe(true)
    })
})
