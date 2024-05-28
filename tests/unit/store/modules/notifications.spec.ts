import notificationsStore from '@/store/modules/notifications'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/notifications.service')

vi.mock('vuex')
const commit = vi.fn()
const initialState = {
    toastList: [
        {
            message: '',
            isOpened: false,
            type: '',
        },
    ],
    notifications: [],
}

describe('Store module | notifications | getters', () => {
    it('getToastList()', () => {
        const result = notificationsStore.getters.getToastList(initialState)

        expect(result).toStrictEqual(initialState.toastList)
    })
})

describe('Store module | notifications | actions', () => {
    it('pushToast()', () => {
        const pushToastPayload = {
            message: 'my success message',
            type: 'success',
        }

        notificationsStore.actions.pushToast({ commit, state: initialState }, pushToastPayload)

        expect(commit).toBeCalledWith('ADD_TOAST', { ...pushToastPayload, isOpened: true })
    })

    it('deleteToast()', () => {
        notificationsStore.actions.deleteToast({ commit }, 0)

        expect(commit).toBeCalledWith('REMOVE_TOAST', 0)
    })
})

describe('Store module | notifications | mutations', () => {
    it('ADD_TOAST()', () => {
        const ADD_TOAST_payload = {
            message: 'my success message',
            type: 'success',
            isOpened: true,
        }

        notificationsStore.mutations.ADD_TOAST(initialState, ADD_TOAST_payload)

        expect(initialState.toastList).toStrictEqual([
            {
                message: '',
                isOpened: false,
                type: '',
            },
            {
                message: 'my success message',
                type: 'success',
                isOpened: true,
            },
        ])
    })

    it('REMOVE_TOAST()', () => {
        notificationsStore.mutations.REMOVE_TOAST(initialState, 0)

        expect(initialState.toastList).toStrictEqual([
            {
                message: 'my success message',
                type: 'success',
                isOpened: true,
            },
        ])
    })
})
