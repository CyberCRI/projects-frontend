<template>
  <div ref="container" class="account-layout">
    <AccountFormTitleBlock :main-title-label="$t('account.title-create-add')" :show-help="true" />

    <div class="input-field">
      <TextInput
        v-model="form.email"
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
<script setup lang="ts">
import AccountFormTitleBlock from '@/components/people/Account/AccountFormTitleBlock.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import { searchPeopleByExactMail } from '@/api/people.service'
import useValidate from '@vuelidate/core'
import { helpers, required, email as emailValidator } from '@vuelidate/validators'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import useOrganizationsStore from '@/stores/useOrganizations'
import { UserModel } from '@/models/user.model'

defineOptions({ name: 'ExistingAccountChecker' })

const emits = defineEmits<{
  cancel: []
  'check-done': [value: UserModel | { email: string }]
}>()

const container = useTemplateRef('container')
const organizationsStore = useOrganizationsStore()
const organization = computed(() => organizationsStore.current)

const form = ref({ email: '' })
const { t } = useNuxtI18n()
const asyncing = ref(false)
const rules = computed(() => ({
  email: {
    required: helpers.withMessage(t('project.form.title-errors.required'), required),
    email: helpers.withMessage(t('form.report.email.format'), emailValidator),
  },
}))
const v$ = useValidate(rules, form)

onMounted(() => {
  container.value?.querySelector<HTMLElement>('[type=email]')?.focus()
})

const searchUser = async () => {
  if (v$.value.$invalid) return
  // TODO this search method is too lax
  // we need to search by exact email match
  // and get 0 or 1 result only

  let targetUser = form.value
  asyncing.value = true
  try {
    // 404 if user doesn't exist
    targetUser = await searchPeopleByExactMail(targetUser.email, {
      current_org_pk: organization.value.id,
    })
  } catch {
    console.log('no user match, proceed to account cretaion')
  } finally {
    emits('check-done', targetUser)
    asyncing.value = false
  }
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
