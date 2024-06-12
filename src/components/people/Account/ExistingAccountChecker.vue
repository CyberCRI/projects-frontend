<template>
    <div class="account-layout">
        <AccountFormTitleBlock
            :main-title-label="this.$t('account.title-create-add')"
            :show-help="true"
        />

        <div class="input-field">
            <TextInput
                input-type="email"
                v-model="email"
                :placeholder="$t('profile.edit.general.professional-email.placeholder')"
                @keyup.enter="searchUser"
                @blur="v$.email.$validate"
            />
            <p v-for="error of v$.email.$errors" :key="error.$uid" class="error-description">
                {{ error.$message }}
            </p>
        </div>

        <div class="footer">
            <LpiButton
                :disabled="asyncing"
                :label="$filters.capitalize($t('common.cancel'))"
                secondary
                class="footer__left-button"
                @click="$emit('cancel')"
                data-test="close-button"
            />

            <LpiButton
                :disabled="v$.$invalid || asyncing"
                :label="$filters.capitalize($t('common.confirm'))"
                :btn-icon="asyncing ? 'LoaderSimple' : null"
                class="footer__right-button"
                @click="searchUser"
                data-test="confirm-button"
            />
        </div>
    </div>
</template>
<script>
import AccountFormTitleBlock from '@/components/people/Account/AccountFormTitleBlock.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import { searchPeopleAdmin } from '@/api/people.service'
import useValidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'
export default {
    name: 'ExistingAccountChecker',

    emits: ['cancel', 'check-done'],

    components: { AccountFormTitleBlock, TextInput, LpiButton },

    data() {
        return {
            email: '',
            asyncing: false,
            v$: useValidate(),
        }
    },

    validations() {
        return {
            email: {
                required: helpers.withMessage(
                    this.$t('project.form.title-errors.required'),
                    required
                ),
                email: helpers.withMessage(this.$t('form.report.email.format'), email),
            },
        }
    },

    mounted() {
        this.$el?.querySelector('[type=email]')?.focus()
    },

    methods: {
        async searchUser() {
            if (this.v$.$invalid) return
            // TODO this search method is too lax
            // we need to search by exact email match
            // and get 0 or 1 result only
            try {
                this.asyncing = true
                this.targetUserReq = await searchPeopleAdmin({
                    org_id: 1,
                    search: this.email,
                })

                let targetUser = this.targetUserReq.results.find(
                    (user) => user.email.toLowerCase() === this.email.toLowerCase()
                )
                if (!targetUser) {
                    targetUser = { email: this.email }
                }

                this.$emit('check-done', targetUser)
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

.input-field {
    padding: $space-2xs 0;
}

.error-description {
    color: $red;
    font-size: $font-size-s;
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
