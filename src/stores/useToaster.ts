import { defineStore } from 'pinia'

export type ToastType = 'error' | 'warning' | 'info' | 'success'

export interface Toast {
  message: string
  isOpened?: boolean
  type: ToastType
  translate?: boolean
}

type ToastConfig = Toast & {
  remaining: boolean
  duration: number
}

export interface ToastState {
  toastList: Toast[]
  timeouts: Map<Toast, any> // any == Timeout result
}

export const DEFAULT_TOAST_DURATION = 5 * 1000

const useToasterStore = defineStore('toaster', {
  state: (): ToastState => ({
    toastList: [],
    timeouts: new Map(),
  }),

  actions: {
    _findIndexToast({ message, type }: Toast) {
      return this.toastList.find((item) => item.message === message && item.type === type)
    },
    deleteToast(toast: Toast): void {
      const findedIndex = this.toastList.findIndex((item) => toRaw(item) === toRaw(toast))
      if (findedIndex !== -1) {
        const timeout = this.timeouts.get(toast)
        if (timeout !== undefined) {
          clearTimeout(timeout)
          this.timeouts.delete(toast)
        }
        this.toastList.splice(findedIndex, 1)
      }
    },

    _deleteToastFromInfo(toast: Pick<Toast, 'message' | 'type'>) {
      this.deleteToast(this._findIndexToast(toast))
    },

    _pushToast({ message, type, remaining, duration, translate }: ToastConfig) {
      this._deleteToastFromInfo({ message, type })

      const toast = {
        message,
        type,
        isOpened: true,
        translate: !!translate,
      }
      this.toastList.push(toast)
      if (!remaining) {
        const timeout = setTimeout(
          () => this.deleteToast(toast),
          duration || DEFAULT_TOAST_DURATION
        )
        this.timeouts.set(toast, timeout)
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
      const _options = {
        remaining: false,
        duration: DEFAULT_TOAST_DURATION,
        translate: false,
        ...options,
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
      const _options = {
        remaining: false,
        duration: DEFAULT_TOAST_DURATION,
        translate: false,
        ...options,
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
      const _options = {
        remaining: false,
        duration: DEFAULT_TOAST_DURATION,
        translate: false,
        ...options,
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
      const _options = {
        remaining: false,
        duration: DEFAULT_TOAST_DURATION,
        translate: false,
        ...options,
      }
      this._pushToast({ message, type: 'success', ..._options })
    },
  },
})
export default useToasterStore
