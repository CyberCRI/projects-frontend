<template>
    <div v-if="isLoading" class="loader">
        <LpiLoader type="simple" />
    </div>
    <div class="account-layout">
        <AccountFormTitleBlock :is-add-mode="isAddMode" @scroll-to="scrollTo" />

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
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import AccountFormTitleBlock from '@/components/Layouts/Account/AccountFormTitleBlock.vue'
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'
import AccountForm from '@/components/Layouts/Account/AccountForm.vue'
import GroupFrom from '@/components/Layouts/Account/GroupFrom.vue'

export default {
    name: 'AccountLayout',

    emits: ['update:modelValue', 'close'],

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
        if (this.selectedUser) await this.setFormFromSelectedUser()
    },

    computed: {
        accountTabs() {
            return [
                {
                    key: 'form-account',
                    label: this.$t('profile.edit.general.tab'),
                    component: AccountForm,
                    props: {
                        isAddMode: this.isAddMode,
                        selectedUser: this.currentUser,
                    },
                    condition: true,
                    dataTest: 'project-summary',
                },
                {
                    key: 'form-group-account',
                    label: this.$t('profile.edit.groups.tab'),
                    component: GroupFrom,
                    props: {
                        isAddMode: this.isAddMode,
                        selectedUser: this.currentUser,
                    },
                    condition: !!this.currentUser && !this.isAddMode,
                    dataTest: 'project-summary',
                },
            ].filter((tab) => tab.condition)
        },
    },

    methods: {
        async setFormFromSelectedUser() {
            await getUser(this.selectedUser.keycloak_id).then((user) => {
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
    margin: auto;
    width: pxToRem(500px);
}
</style>
