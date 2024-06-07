<template>
    <BaseDrawer
        :is-opened="isOpened"
        title=""
        @close="$emit('close')"
        class="full"
        :has-footer="false"
    >
        <div v-if="isAddMode && !targetUser" class="account-layout">
            <AccountFormTitleBlock
                :main-title-label="this.$t('account.title-create-add')"
                :show-help="true"
            />
            <TextInput
                input-type="email"
                v-model="email"
                :placeholder="$t('profile.edit.general.professional-email.placeholder')"
            />

            <div class="footer">
                <LpiButton
                    :disabled="asyncing"
                    :label="$filters.capitalize($t('common.cancel'))"
                    secondary
                    class="footer__left-button"
                    @click="$emit('close')"
                    data-test="close-button"
                />

                <LpiButton
                    :disabled="confirmActionDisabled || asyncing"
                    :label="$filters.capitalize($t('common.confirm'))"
                    :btn-icon="asyncing ? 'LoaderSimple' : null"
                    class="footer__right-button"
                    @click="searchUser"
                    data-test="confirm-button"
                />
            </div>
        </div>

        <AccountLayout
            v-else
            ref="account"
            :is-add-mode="isAddMode"
            :is-invite-mode="isInviteMode"
            :selected-user="targetUser || selectedUser"
            @close="$emit('close')"
        ></AccountLayout>
    </BaseDrawer>
</template>
<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import AccountLayout from '@/components/people/Account/AccountLayout.vue'
import { searchPeopleAdmin } from '@/api/people.service'
import AccountFormTitleBlock from '@/components/people/Account/AccountFormTitleBlock.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import TextInput from '@/components/base/form/TextInput.vue'

export default {
    name: 'AccountDrawer',

    emits: ['close'],

    components: { AccountLayout, BaseDrawer, AccountFormTitleBlock, TextInput, LpiButton },

    props: {
        isOpened: {
            type: Boolean,
            required: true,
        },

        selectedUser: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
            targetUser: null,
            email: null,
            asyncing: false,
        }
    },

    computed: {
        isAddMode() {
            return !this.selectedUser && !this.targetUser?.id
        },

        isInviteMode() {
            return !(this.targetUser || this.selectedUser)?.current_org_role // null if not in current org
        },

        confirmActionDisabled() {
            return false // TODO
        },
    },

    methods: {
        async searchUser() {
            // TODO this search method is too lax
            // we need to search by exact email match
            // and get 0 or 1 result only
            try {
                this.asyncing = true
                this.targetUserReq = await searchPeopleAdmin({
                    org_id: 1,
                    search: this.email,
                })

                this.targetUser = this.targetUserReq.results.find(
                    (user) => user.email.toLowerCase() === this.email.toLowerCase()
                )
                if (!this.targetUser) {
                    this.targetUser = { email: this.email }
                }

                if (!this.addMode) {
                    this.$store.dispatch('notifications/pushToast', {
                        type: 'warning',
                        message: this.isInviteMode
                            ? this.$t('account.switch-to-invite')
                            : this.$t('account.switch-to-edit'),
                    })
                }
            } finally {
                this.asyncing = false
            }
        },
    },
}
</script>
<style scoped lang="scss">
.account-layout {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: 0 auto;
    width: pxToRem(500px);
}

.footer {
    flex-shrink: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    color: $primary-dark;
    font-weight: 700;
    padding-top: $space-l;
    padding-bottom: $space-l;
    position: sticky;
    bottom: 0;
    background: $white;

    button ~ button {
        margin-left: $space-m;
        text-transform: capitalize;
    }
}
</style>
