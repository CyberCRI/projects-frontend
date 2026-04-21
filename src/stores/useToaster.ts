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
}

export const DEFAULT_TOAST_DURATION = 5 * 1000

const useToasterStore = defineStore('toaster', {
  state: (): ToastState => ({
    toastList: [],
  }),

  actions: {
    _findIndexToast({ message, type }: ToastConfig) {
      return this.toastList.findIndex((item) => item.message === message && item.type === type)
    },
    deleteToast(toastIndex: number): void {
      this.toastList.splice(toastIndex, 1)
    },

    _deleteToastFromToast(toast: Pick<Toast, 'message' | 'type'>) {
      const findedIndex = this.toastList.findIndex(
        (item) => item.message === toast.message && item.type === toast.type
      )
      if (findedIndex !== -1) {
        this.deleteToast(findedIndex)
      }
    },

    _pushToast({ message, type, remaining, duration, translate }: ToastConfig) {
      this._deleteToastFromToast({ message, type })

      this.toastList.push({
        message,
        type,
        isOpened: true,
        translate: !!translate,
      })
      if (!remaining) {
        setTimeout(
          () => this._deleteToastFromToast({ message, type }),
          duration || DEFAULT_TOAST_DURATION
        )
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
      const _options = {
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
      const _options = {
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
      const _options = {
        remaining: false,
        duration: DEFAULT_TOAST_DURATION,
        translate: false,
        ...(options || {}),
      }
      this._pushToast({ message, type: 'success', ..._options })
    },
  },
})
export default useToasterStore
