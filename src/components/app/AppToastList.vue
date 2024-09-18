<template>
    <div class="toast-list">
        <TransitionGroup name="toast" tag="div">
            <LpiSnackbar
                v-for="(toast, index) in snackbars"
                :key="index"
                :closable="true"
                :type="toast.type"
                class="toast"
                :icon="toast.icon"
                @close="close(index)"
            >
                <div v-html="toast.message"></div>
            </LpiSnackbar>
        </TransitionGroup>
    </div>
</template>

<script>
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import useToasterStore from '@/stores/useToaster.ts'

export default {
    name: 'AppToastList',

    components: {
        LpiSnackbar,
    },

    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
    },

    computed: {
        snackbars() {
            return (this.toaster.toastList || []).map((toast) => {
                const iconMap = {
                    error: 'Cancel',
                    warning: 'AlertOutline',
                    info: 'Check',
                    success: 'Check',
                }
                const icon = iconMap[toast.type || ''] || 'Check'
                return {
                    message: toast.message,
                    icon,
                    type: toast.type || 'success',
                }
            })
        },
    },

    methods: {
        close(toastIndex) {
            this.toaster.deleteToast(toastIndex)
        },
    },
}
</script>

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
