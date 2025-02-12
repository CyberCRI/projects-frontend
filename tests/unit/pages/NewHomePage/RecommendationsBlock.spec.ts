import RecommendationBlock from '@/components/search/Recommendations/RecommendationBlock.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/../i18n.config'
import { vi, beforeEach, afterEach, describe, expect, it } from 'vitest'
import flushPromises from 'flush-promises'
import MockComponent from '@/../tests/helpers/MockComponent.vue'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { UserFactory } from '@/../tests/factories/user.factory'
import { ProjectCategoryOutputFactory } from '@/../tests/factories/project-category.factory'
import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useProjectCategoriesStore from '@/stores/useProjectCategories'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'
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

const router = [{ name: 'Home', path: '/', component: MockComponent }]

const props = {}

describe('RecommendationBlock', () => {
    let usersStore

    beforeEach(() => {
        usersStore = useUsersStore(pinia)
        const projectCategories = useProjectCategoriesStore(pinia)
        projectCategories.all = ProjectCategoryOutputFactory.generateMany(2)

        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = { id: 'TEST', code: 'TEST' } as unknown as OrganizationOutput
    })
    afterEach(() => {
        usersStore.$reset()
    })
    it('should render RecommendationBlock', async () => {
        usersStore.isConnected = false
        let wrapper = lpiShallowMount(RecommendationBlock, {
            props,
            router,
            i18n,
        })
        await flushPromises()
        expect(wrapper.exists()).toBeTruthy()
    })

    it('should display projects reco for non connected user', async () => {
        usersStore.isConnected = false
        let wrapper = lpiShallowMount(RecommendationBlock, {
            props,
            router,
            i18n,
        })
        await flushPromises()
        expect(wrapper.find('[data-test="project-recommendations"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="user-recommendations"]').exists()).toBe(false)
    })

    it('should display project and user reco for connected user', async () => {
        usersStore.isConnected = true
        let wrapper = lpiShallowMount(RecommendationBlock, {
            props: props,
            router,
            i18n,
        })
        await flushPromises()

        expect(wrapper.find('[data-test="project-recommendations"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="user-recommendations"]').exists()).toBe(true)
    })
})
