<script setup lang="ts">
import { IconImageChoice } from '~/functs/IconImage'
import useToasterStore from '~/stores/useToaster'

const toaster = useToasterStore()
const { t } = useNuxtI18n()

const genKeys = (toast) => {
  return `${toast}::${toast.message}`
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
    }
    newToast.key = genKeys(newToast)
    return newToast
  })
})
</script>

<template>
  <TransitionGroup name="toast" tag="div" class="toast-list">
    <LpiSnackbar
      v-for="toast in snackbars"
      :key="toast.key"
      :type="toast.type"
      class="toast"
      :icon="toast.icon"
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
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.toast {
  box-shadow: 0 2px 5px rgb(54 54 54 / 50%);
  transition: all 0.5s ease;
}
</style>
