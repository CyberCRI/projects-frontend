import { defineStore } from 'pinia'

export type ToastType = 'error' | 'warning' | 'info' | 'success'

export interface Toast {
    message: string
    isOpened: boolean
    type: ToastType
    translate?: boolean
}

export interface ToastState {
    toastList: Toast[]
}

export const DEFAULT_TOAST_DURATION = 5 * 1000

const useToasterStore = defineStore('toaster', {
    state: (): ToastState => ({
        toastList: [],
    }),

    actions: {
        _pushToast({
            message,
            type,
            remaining,
            duration,
            translate,
        }: {
            message: string
            type: ToastType
            remaining: boolean
            duration: number
            translate?: boolean
        }): void {
            this.toastList.push({ message, type, isOpened: true, translate: !!translate })
            if (!remaining) {
                setTimeout(() => this.deleteToast(0), duration || DEFAULT_TOAST_DURATION)
            }
        },

        pushWarning(
            message: string,
            options?: {
                remaining?: boolean
                duration?: number
                translate?: boolean
            }
        ) {
            let _options = {
                remaining: false,
                duration: DEFAULT_TOAST_DURATION,
                translate: false,
                ...(options || {}),
            }
            this._pushToast({ message, type: 'warning', ..._options })
        },
        pushError(
            message: string,
            options?: {
                remaining?: boolean
                duration?: number
                translate?: boolean
            }
        ) {
            let _options = {
                remaining: false,
                duration: DEFAULT_TOAST_DURATION,
                translate: false,
                ...(options || {}),
            }
            this._pushToast({ message, type: 'error', ..._options })
        },
        pushInfo(
            message: string,
            options?: {
                remaining?: boolean
                duration?: number
                translate?: boolean
            }
        ) {
            let _options = {
                remaining: false,
                duration: DEFAULT_TOAST_DURATION,
                translate: false,
                ...(options || {}),
            }
            this._pushToast({ message, type: 'info', ..._options })
        },
        pushSuccess(
            message: string,
            options?: {
                remaining?: boolean
                duration?: number
                translate?: boolean
            }
        ) {
            let _options = {
                remaining: false,
                duration: DEFAULT_TOAST_DURATION,
                translate: false,
                ...(options || {}),
            }
            this._pushToast({ message, type: 'success', ..._options })
        },

        deleteToast(toastIndex: number): void {
            this.toastList.splice(toastIndex, 1)
        },
    },
})
export default useToasterStore
