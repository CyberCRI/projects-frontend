<template>
    <div v-if="isLoading" class="loader">
        <LpiLoader type="simple" />
    </div>
    <div class="account-layout">
        <AccountFormTitleBlock
            :main-title-label="mainTitleLabel"
            :show-help="isAddMode || isInviteMode"
        />

        <AccountForm
            v-if="currentUser"
            :is-add-mode="isAddMode"
            :is-invite-mode="isInviteMode"
            :selected-user="currentUser"
            @close="$emit('close')"
        />
    </div>
</template>

<script>
import { getUser } from '@/api/people.service.ts'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import AccountFormTitleBlock from '@/components/people/Account/AccountFormTitleBlock.vue'
import AccountForm from '@/components/people/Account/AccountForm.vue'

export default {
    name: 'AccountLayout',

    emits: ['close'],

    components: {
        AccountFormTitleBlock,
        LpiLoader,
        AccountForm,
    },

    props: {
        isAddMode: {
            type: Boolean,
            default: true,
        },
        isInviteMode: {
            type: Boolean,
            default: false,
        },
        selectedUser: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
            currentUser: null,
            isLoading: true,
        }
    },

    async mounted() {
        if (this.selectedUser?.id) await this.setFormFromSelectedUser()
        else
            this.currentUser = {
                ...this.selectedUser,
                current_org_role: this.selectedUser?.current_org_role,
            }
        this.isLoading = false
    },

    computed: {
        mainTitleLabel() {
            return this.isAddMode
                ? this.$t('account.title-create')
                : this.isInviteMode
                  ? this.$t('account.title-invite')
                  : this.$t('account.title-edit')
        },
    },

    methods: {
        async setFormFromSelectedUser() {
            const user = await getUser(this.selectedUser.id)
            this.currentUser = {
                ...user,
                current_org_role: this.selectedUser.current_org_role,
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.loader {
    position: absolute;
    margin: auto;
    width: 100vw;
    height: 100vh;
    top: 50%;
    left: 50%;
    display: flex;
    background-color: rgb(255 255 255 / 80%);
    transform: translate(-50%, -50%);
    justify-content: center;
    align-items: center;
    z-index: 1;
}

.account-layout {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: 0 auto;
    width: pxToRem(500px);
}
</style>
