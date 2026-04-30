<script setup lang="ts">
import useToasterStore from '~/stores/useToaster'

import type { IconImageChoice } from '~/functs/IconImage'

const toaster = useToasterStore()
const { t } = useNuxtI18n()

// gen unique key (for good transition) with toast type and message
const genKeys = (toast) => {
  return `${toast.type}::${toast.message}`
}

const snackbars = computed(() => {
  return (toaster.toastList || []).map((toast) => {
    const iconMap: Record<string, IconImageChoice> = {
      error: 'Cancel',
      warning: 'AlertOutline',
      info: 'Check',
      success: 'Check',
    }
    const icon = iconMap[toast.type || ''] || 'Check'
    const newToast = {
      message: toast.translate ? t(toast.message) : toast.message,
      icon,
      type: toast.type || 'success',
      key: '',
      toast,
    }
    newToast.key = genKeys(newToast)
    return newToast
  })
})

const onClose = (snackbar) => {
  console.log(onClose)
  toaster.deleteToast(snackbar.toast)
}
</script>

<template>
  <TransitionGroup name="toast" tag="div" class="toast-list">
    <LpiSnackbar
      v-for="toast in snackbars"
      :key="toast.key"
      :type="toast.type"
      class="toast"
      closable
      :icon="toast.icon"
      @close="onClose(toast)"
    >
      <div v-html="toast.message" />
    </LpiSnackbar>
  </TransitionGroup>
</template>

<style lang="scss" scoped>
.toast-list {
  position: fixed;
  z-index: $zindex-toast;
  top: calc($navbar-height + 10px);
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  box-shadow: 0 2px 5px rgb(54 54 54 / 50%);
  transition: all 0.5s ease;
  word-break: break-all;
}
</style>
