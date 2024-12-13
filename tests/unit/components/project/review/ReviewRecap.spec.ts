import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import ReviewRecap from '@/components/project/review/ReviewRecap.vue'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
// issue with webcrypto, so mock so offending import
import { yUndoPluginKey } from 'y-prosemirror'
vi.mock('y-prosemirror', () => ({ default: {} }))

const project = {
    id: 123,
}

const reviews = [
    {
        id: 158,
        description: "<p>C'était <b>très</b> intéressant</p>",
        title: 'La grande revue',
        created_at: '2022-10-20T13:16:48.183141Z',
        updated_at: '2022-10-25T12:53:23.830479Z',
        reviewer: {
            id: 1133,
            given_name: 'test',
            email: 'test.auto@external.cri-paris.org',
            family_name: 'auto',
            pronouns: '',
        },
    },
    {
        id: 158,
        description: "<p>C'était <b>très</b> <b>très</b> intéressant</p>",
        title: 'La grande revue, saison 2',
        created_at: '2022-10-21T13:16:48.183141Z',
        updated_at: '2022-10-26T12:53:23.830479Z',
        reviewer: {
            id: 1133,
            given_name: 'test',
            email: 'test.auto@external.cri-paris.org',
            family_name: 'auto',
            pronouns: '',
        },
    },
]

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

function setUpComponent(props) {
    return lpiMount(ReviewRecap, {
        props,
        i18n,
    })
}

describe('ReviewRecap.vue', () => {
    let usersStore
    beforeEach(() => {
        const projectsStore = useProjectsStore(pinia)
        projectsStore.project = {
            ...ProjectOutputFactory.generate(),
            files: [],
            links: [],
        }
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
        organizationsStore.all = OrganizationOutputFactory.generateMany(2)

        usersStore = useUsersStore(pinia)
        usersStore.accessToken = 123
    })
    afterEach(() => {
        usersStore.$reset()
    })
    it('should render component', () => {
        usersStore.permissions = {}
        const wrapper = setUpComponent({
            project,
            reviews,
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('should contain review data', async () => {
        usersStore.permissions = {}
        const wrapper = setUpComponent({
            project,
            reviews,
        })

        expect(wrapper.text()).toMatch(/La grande revue/)
        expect(wrapper.text()).toMatch(/C'était très intéressant/)
        expect(wrapper.text()).toMatch(/test auto/i)
        // js locale is french on locale test server, english on remote
        expect(wrapper.text()).toMatch(new RegExp(new Date('2022-10-20').toLocaleDateString('en')))
    })

    it('should display edit button if allowed', async () => {
        usersStore.permissions = { 'projects.add_review': true }
        const wrapper = setUpComponent({
            project,
            reviews,
        })

        expect(wrapper.findAll('.edit-btn').length).toBe(2)
    })

    it('should not display edit button if not allowed', async () => {
        usersStore.permissions = {}
        const wrapper = setUpComponent({
            project,
            reviews,
        })

        expect(wrapper.findAll('.edit-btn').length).toBe(0)
    })
})
