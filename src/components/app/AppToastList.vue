<script setup>
import useToasterStore from '@/stores/useToaster.ts'

const toaster = useToasterStore()
const { t } = useI18n()
const snackbars = computed(() => {
    return (toaster.toastList || []).map((toast) => {
        const iconMap = {
            error: 'Cancel',
            warning: 'AlertOutline',
            info: 'Check',
            success: 'Check',
        }
        const icon = iconMap[toast.type || ''] || 'Check'
        return {
            message: toast.translate ? t(toast.message) : toast.message,
            icon,
            type: toast.type || 'success',
        }
    })
})
</script>

<template>
    <div class="toast-list">
        <TransitionGroup name="toast" tag="div">
            <LpiSnackbar
                v-for="(toast, index) in snackbars"
                :key="index"
                :type="toast.type"
                class="toast"
                :icon="toast.icon"
            >
                <div v-html="toast.message"></div>
            </LpiSnackbar>
        </TransitionGroup>
    </div>
</template>

<style lang="scss" scoped>
.toast-list {
    z-index: $zindex-toast;
    position: fixed;
    top: calc($navbar-height + 10px);
    left: 50%;
    transform: translate(-50%, 0);
}

.toast {
    margin-top: $space-xs;
    box-shadow: 0 2px 5px rgb(54 54 54 / 50%);
    transition: all 0.5s ease;
}
</style>
