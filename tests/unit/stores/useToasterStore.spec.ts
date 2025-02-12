import { setActivePinia, createPinia } from 'pinia'

import useToasterStore, { Toast, ToastType } from '@/stores/useToaster'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
vi.mock('@/api/notifications.service')

describe('Toaster Store', () => {
    beforeEach(() => {
        // creates a fresh pinia and makes it active
        // so it's automatically picked up by any useStore() call
        // without having to pass it to it: `useStore(pinia)`
        setActivePinia(createPinia())
    })

    it('_pushToast()', () => {
        const toaster = useToasterStore()
        const pushToastPayload = {
            message: 'my success message',
            type: 'success' as ToastType,
            remaining: false,
            duration: 5000,
        }

        toaster._pushToast(pushToastPayload)

        expect(toaster.toastList.length).toBe(1)
    })

    it('pushSuccess()', () => {
        const toaster = useToasterStore()
        const pushToastPayload = 'my success message'

        toaster.pushSuccess(pushToastPayload)

        expect(toaster.toastList.length).toBe(1)
        expect(toaster.toastList[0].type).toBe('success')
        expect(toaster.toastList[0].message).toBe(pushToastPayload)
    })

    it('pushError()', () => {
        const toaster = useToasterStore()
        const pushToastPayload = 'my success message'

        toaster.pushError(pushToastPayload)

        expect(toaster.toastList.length).toBe(1)
        expect(toaster.toastList[0].type).toBe('error')
        expect(toaster.toastList[0].message).toBe(pushToastPayload)
    })

    it('pushWarning()', () => {
        const toaster = useToasterStore()
        const pushToastPayload = 'my success message'

        toaster.pushWarning(pushToastPayload)

        expect(toaster.toastList.length).toBe(1)
        expect(toaster.toastList[0].type).toBe('warning')
        expect(toaster.toastList[0].message).toBe(pushToastPayload)
    })

    it('pushInfo()', () => {
        const toaster = useToasterStore()
        const pushToastPayload = 'my success message'

        toaster.pushInfo(pushToastPayload)

        expect(toaster.toastList.length).toBe(1)
        expect(toaster.toastList[0].type).toBe('info')
        expect(toaster.toastList[0].message).toBe(pushToastPayload)
    })

    it('deleteToast()', () => {
        const toaster = useToasterStore()
        toaster.toastList.push({
            message: 'my success message',
            type: 'success' as ToastType,
            isOpened: true,
        })
        expect(toaster.toastList.length).toBe(1)
        toaster.deleteToast(0)

        expect(toaster.toastList.length).toBe(0)
    })
})
