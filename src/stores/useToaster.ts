import { defineStore } from 'pinia'

export type ToastType = 'error' | 'warning' | 'info' | 'success'

export interface Toast {
    message: string
    isOpened: boolean
    type: ToastType
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
        }: {
            message: string
            type: ToastType
            remaining: boolean
            duration: number
        }): void {
            this.toastList.push({ message, type, isOpened: true })
            if (!remaining) {
                setTimeout(() => this.deleteToast(0), duration || DEFAULT_TOAST_DURATION)
            }
        },

        pushWarning(
            message: string,
            options?: {
                remaining: boolean
                duration: number
            }
        ) {
            if (!options) options = { remaining: false, duration: DEFAULT_TOAST_DURATION }
            this._pushToast({ message, type: 'warning', ...options })
        },
        pushError(
            message: string,
            options?: {
                remaining: boolean
                duration: number
            }
        ) {
            if (!options) options = { remaining: false, duration: DEFAULT_TOAST_DURATION }
            this._pushToast({ message, type: 'error', ...options })
        },
        pushInfo(
            message: string,
            options?: {
                remaining: boolean
                duration: number
            }
        ) {
            if (!options) options = { remaining: false, duration: DEFAULT_TOAST_DURATION }
            this._pushToast({ message, type: 'info', ...options })
        },
        pushSuccess(
            message: string,
            options?: {
                remaining: boolean
                duration: number
            }
        ) {
            if (!options) options = { remaining: false, duration: DEFAULT_TOAST_DURATION }
            this._pushToast({ message, type: 'success', ...options })
        },

        deleteToast(toastIndex: number): void {
            this.toastList.splice(toastIndex, 1)
        },
    },
})
export default useToasterStore
