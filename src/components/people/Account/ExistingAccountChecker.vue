<template>
  <div class="account-layout">
    <AccountFormTitleBlock :main-title-label="$t('account.title-create-add')" :show-help="true" />

    <div class="input-field">
      <TextInput
        v-model="email"
        :label="$t('profile.edit.general.professional-email.label')"
        input-type="email"
        :placeholder="$t('profile.edit.general.professional-email.placeholder')"
        @keyup.enter="searchUser"
        @blur="v$.email.$validate"
      />
      <FieldErrors :errors="v$.email.$errors" />
    </div>

    <div class="footer">
      <LpiButton
        :disabled="asyncing"
        :label="$t('common.cancel')"
        secondary
        class="footer__left-button"
        data-test="close-button"
        @click="$emit('cancel')"
      />

      <LpiButton
        :disabled="v$.$invalid || asyncing"
        :label="$t('common.confirm')"
        :btn-icon="asyncing ? 'LoaderSimple' : null"
        class="footer__right-button"
        data-test="confirm-button"
        @click="searchUser"
      />
    </div>
  </div>
</template>
<script>
import AccountFormTitleBlock from '@/components/people/Account/AccountFormTitleBlock.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import { searchPeopleByExactMail } from '@/api/people.service'
import useValidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
  name: 'ExistingAccountChecker',

  components: { AccountFormTitleBlock, TextInput, LpiButton, FieldErrors },

  emits: ['cancel', 'check-done'],

  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },
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
        required: helpers.withMessage(this.$t('project.form.title-errors.required'), required),
        email: helpers.withMessage(this.$t('form.report.email.format'), email),
      },
    }
  },

  computed: {
    organization() {
      return this.organizationsStore.current
    },
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

      let targetUser = { email: this.email }
      this.asyncing = true
      try {
        // 404 if user doesn't exist
        targetUser = await searchPeopleByExactMail(this.email, {
          current_org_pk: this.organization.id,
        })
      } catch {
        console.log('no user match, proceed to account cretaion')
      } finally {
        this.$emit('check-done', targetUser)
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
