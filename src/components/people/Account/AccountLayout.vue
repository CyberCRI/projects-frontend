<template>
    <div v-if="isLoading" class="loader">
        <LpiLoader type="simple" />
    </div>
    <div class="account-layout">
        <AccountFormTitleBlock
            :main-title-label="mainTitleLabel"
            :show-help="isAddMode || isInviteMode"
        />

        <TabsLayout
            :align-left="true"
            :border="false"
            :tabs="accountTabs"
            @close="$emit('close')"
        />
    </div>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import { getUser } from '@/api/people.service.ts'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import AccountFormTitleBlock from '@/components/people/Account/AccountFormTitleBlock.vue'
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import AccountForm from '@/components/people/Account/AccountForm.vue'
import GroupForm from '@/components/people/Account/GroupForm.vue'

export default {
    name: 'AccountLayout',

    emits: ['update:modelValue', 'close', 'mode-changed'],

    mixins: [imageMixin],

    components: {
        TabsLayout,
        AccountFormTitleBlock,
        LpiLoader,
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
        this.isLoading = false
        if (this.selectedUser?.id) await this.setFormFromSelectedUser()
        else
            this.currentUser = {
                ...this.selectedUser,
                current_org_role: this.selectedUser?.current_org_role,
            }
    },

    computed: {
        mainTitleLabel() {
            return this.isAddMode
                ? this.$t('account.title-create')
                : this.isInviteMode
                  ? this.$t('account.title-invite')
                  : this.$t('account.title-edit')
        },
        accountTabs() {
            return [
                {
                    key: 'form-account',
                    label: this.$t('profile.edit.general.tab'),
                    component: AccountForm,
                    props: {
                        isAddMode: this.isAddMode,
                        isInviteMode: this.isInviteMode,
                        selectedUser: this.currentUser,
                        onModeChange: (mode) => {
                            this.$emit('mode-changed', mode)
                        },
                    },
                    condition: true,
                    dataTest: 'project-summary',
                },
                {
                    key: 'form-group-account',
                    label: this.$t('profile.edit.groups.tab'),
                    component: GroupForm,
                    props: {
                        isAddMode: this.isAddMode,
                        selectedUser: this.currentUser,
                    },
                    condition: !!this.currentUser && !this.isAddMode && !this.isInviteMode,
                    dataTest: 'project-summary',
                },
            ].filter((tab) => tab.condition)
        },
    },

    methods: {
        async setFormFromSelectedUser() {
            await getUser(this.selectedUser.id).then((user) => {
                this.currentUser = {
                    ...user,
                    current_org_role: this.selectedUser.current_org_role,
                }
            })
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
