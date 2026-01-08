<script setup>
import useValidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'
import { postAccessRequest } from '@/api/organizations.service.ts'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const router = useRouter()
const { t } = useNuxtI18n()
const form = ref({
  email: '',
  given_name: '',
  family_name: '',
  job: '',
  message: '',
})
const rules = computed(() => ({
  form: {
    email: {
      required: helpers.withMessage(t('request-access.email.is-required'), required),
      email: helpers.withMessage(t('request-access.email.is-invalid'), email),
    },
    given_name: {
      required: helpers.withMessage(t('request-access.given_name.is-required'), required),
    },
    family_name: {
      required: helpers.withMessage(t('request-access.family_name.is-required'), required),
    },
    job: {
      required: helpers.withMessage(t('request-access.profile-title.is-required'), required),
    },
  },
}))
const v$ = useValidate(rules, { form })
const formIsInvalid = computed(() => {
  return v$.value.form.$invalid
})
const asyncing = ref(false)
const confirm = ref(false)
const showContactUsDrawer = ref(false)
const contactEmail = ref('')
onMounted(async () => {
  contactEmail.value = organizationsStore.current?.contact_email
})
async function requestAccess() {
  await v$.value.form.$validate()
  if (v$.value.form.$error) {
    return
  }
  asyncing.value = true
  try {
    const org_code = organizationsStore.current?.code
    const payload = {
      ...form.value,
      organization: org_code,
    }
    await postAccessRequest(org_code, payload)
    confirm.value = true
  } catch (error) {
    if (error?.response?.status === 409) {
      toaster.pushError(t('register.email-already-exists') /* TODO*/)
    } else {
      toaster.pushError(
        `${t('register.save-error')} ${
          // TODO
          error?.response?.data?.error || ''
        }`
      )
    }
    console.error(error)
  } finally {
    asyncing.value = false
  }
}
function cancel() {
  router.push({ name: 'HomeRoot' })
}
function login() {
  goToKeycloakLoginPage()
}
function closeDrawer() {
  showContactUsDrawer.value = false
}
try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('request-access.title')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <SignUpWrapper
    :sign-up-title="confirm ? $t('request-access.title-confirm') : $t('request-access.title')"
  >
    <transition name="fade" mode="out-in">
      <div v-if="confirm" class="confirm-message">
        <i18n-t keypath="request-access.confirmation" tag="p">
          <strong>{{ form.email }}</strong>
        </i18n-t>
      </div>
      <div v-else class="form">
        <p class="notice">
          {{ $t('request-access.notice') }}
        </p>
        <div class="form-group">
          <TextInput
            v-model="form.given_name"
            :label="$t('request-access.given_name.label')"
            :placeholder="$t('request-access.given_name.placeholder')"
            data-test="first-name"
            @blur="v$.form.given_name.$validate"
          />
          <FieldErrors :errors="v$.form.given_name.$errors" />
        </div>
        <div class="form-group">
          <TextInput
            v-model="form.family_name"
            :label="$t('request-access.family_name.label')"
            :placeholder="$t('request-access.family_name.placeholder')"
            data-test="last-name"
            @blur="v$.form.family_name.$validate"
          />
          <FieldErrors :errors="v$.form.family_name.$errors" />
        </div>
        <div class="form-group">
          <TextInput
            v-model="form.email"
            :label="$t('request-access.email.label')"
            input-type="email"
            :placeholder="$t('request-access.email.placeholder')"
            data-test="email"
            @blur="v$.form.email.$validate"
          />
          <FieldErrors :errors="v$.form.email.$errors" />
        </div>
        <div class="form-group">
          <TextInput
            v-model="form.job"
            :label="$t('request-access.profile-title.label')"
            :placeholder="$t('request-access.profile-title.placeholder')"
            data-test="title"
            @blur="v$.form.job.$validate"
          />
          <FieldErrors :errors="v$.form.job.$errors" />
        </div>
        <div class="form-group">
          <TextInput
            v-model="form.message"
            :label="$t('request-access.message.label')"
            input-type="textarea"
            :placeholder="$t('request-access.message.placeholder')"
            data-test="message"
          />
        </div>

        <div class="action">
          <LpiButton
            :disabled="asyncing"
            secondary
            :label="$t('common.cancel')"
            :btn-icon="asyncing ? 'LoaderSimple' : null"
            class="cancel-btn"
            data-test="cancel-btn"
            @click="cancel"
          />
          <LpiButton
            :disabled="formIsInvalid || asyncing"
            :label="$t('common.confirm')"
            :btn-icon="asyncing ? 'LoaderSimple' : null"
            class="register-btn"
            data-test="register-btn"
            @click="requestAccess"
          />
        </div>
      </div>
    </transition>
    <template #post-box>
      <div class="extra-links" :class="{ 'is-confirm': confirm }">
        <p v-if="!confirm" class="extra-link extra-login">
          {{ $t('request-access.have-account') }}
          <a href="#" class="link" @click.prevent="login">{{ $t('request-access.login') }}</a>
        </p>
        <p class="extra-link extra-help">
          {{ $t('request-access.need-help') }}
          <a href="#" class="link" @click.prevent="showContactUsDrawer = true">
            {{ $t('request-access.contact-us') }}
          </a>
        </p>
      </div>
    </template>
  </SignUpWrapper>

  <ContactDrawer :is-opened="showContactUsDrawer" @close="closeDrawer" />
</template>
<style lang="scss" scoped>
.confirm {
  border-radius: $border-radius-m;
  padding: $space-xl;
}

.notice {
  font-size: $font-size-m;
  margin-bottom: $space-l;
}

.action {
  display: flex;
  padding-bottom: pxToRem(24px);
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: $space-l;

  .register-btn,
  .cancel-btn {
    text-transform: capitalize;
  }
}

.extra-links {
  margin-top: pxToRem(29px);
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  gap: $space-unit;

  .extra-link {
    flex-basis: 50%;
  }

  .extra-login {
    text-align: left;
  }

  .extra-help {
    text-align: right;
  }

  &.is-confirm {
    .extra-link {
      flex-basis: 100%;
    }

    .extra-help {
      text-align: center;
    }
  }
}

.link {
  display: inline-block; // avoid breaking link on new line
  color: $primary-dark;
  text-decoration: underline;
  font-weight: 400;

  &:hover {
    text-decoration: none;
  }
}

.link-expired {
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 90px auto;

  // padding-top: pxToRem(20px);
}

.title {
  font-size: pxToRem(40px);
  font-weight: 900;
  color: $primary-dark;
  line-height: $line-height-tight;
  margin-bottom: pxToRem(15px);
}

.expired-text {
  font-size: pxToRem(40px);
  line-height: $line-height-squashed;
  text-align: center;
  color: $primary;
  font-weight: 700;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 20px;
  filter: drop-shadow(8px 0 0 #20393d) drop-shadow(-8px 0 0 #20393d) drop-shadow(0 8px 0 #20393d)
    drop-shadow(0 -8px 0 #20393d);
}

.illustration {
  max-width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: end;
  background-size: cover;
  text-align: center;
  margin: 0 auto;
}

.extra-informations {
  // font-size: smaller;
  text-align: center;
  padding-bottom: 40px;

  a {
    font-weight: 700;
    color: $primary-dark;
    text-decoration: underline;
  }
}

.confirm-message strong {
  font-weight: 700;
  color: $primary-dark;
}

.fade-leave-active,
.fade-enter-active {
  transition:
    transform 200ms ease-in-out,
    opacity 200ms ease-in-out;
  transform: translateZ(0) scale(1);
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateZ(0) scale(0);

  $opacity: 0;
}
</style>
