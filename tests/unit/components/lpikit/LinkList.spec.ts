import { lpiMount } from '../../../helpers/LpiMount'
import LinkList from '@/pages/AdminPortalPage/Tabs/LinksList.vue'
import english from '@/locales/en.json'
import * as invitationSrv from '@/api/invitations.service'
import flushPromises from 'flush-promises'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/invitations.service.ts', () => {
    return {
        getInvitations: vi.fn(() => ({ results: [] })),
        postInvitations: vi.fn(),
        deleteInvitations: vi.fn(),
    }
})

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

function buildStore() {
    return {
        modules: {
            organizations: {
                namespaced: true,
                state: {
                    current: { code: 'FOOBAR' },
                },
            },
        },
    }
}

const factory = (props?) => {
    return lpiMount(LinkList, {
        props,
        i18n,
        store: buildStore(),
    })
}

describe('LinkList.vue', () => {
    it('should mount the component', () => {
        const wrapper = factory({ projects: [] })
        const vm: any = wrapper.vm
        expect(wrapper.exists()).toBeTruthy()
        expect(invitationSrv.getInvitations).toHaveBeenCalled()
    })

    it('should mount the component with all invitations', async () => {
        ;(invitationSrv.getInvitations as Mock).mockReturnValueOnce({
            results: [
                {
                    id: 1,
                    owner: { given_name: 'joe', family_name: 'test' },
                    expire_at: '2020-01-01',
                    description: 'test 1',
                    token: 'aaaaaa',
                    people_group: { name: 'testgoup', id: 1 },
                },
                {
                    id: 2,
                    owner: { given_name: 'joe', family_name: 'test' },
                    expire_at: '2020-01-01',
                    description: 'test 2',
                    token: 'aaaaaa',
                    people_group: { name: 'testgoup', id: 1 },
                },
                {
                    id: 3,
                    owner: { given_name: 'joe', family_name: 'test' },
                    expire_at: '2222-01-01',
                    description: 'test 3',
                    token: 'aaaaaa',
                    people_group: { name: 'testgoup', id: 1 },
                },
            ],
        })
        const wrapper = factory({ projects: [] })
        const vm: any = wrapper.vm
        await flushPromises()
        const lines = wrapper.findAll('tbody tr')
        expect(lines.length).toBe(3)
    })
})
