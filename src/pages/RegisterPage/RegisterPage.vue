<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'
import { postUserWithInvitation } from '@/api/people.service'
import { imageSizesFormDataPost } from '@/functs/imageSizesUtils'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import { getInvitation } from '@/api/invitations.service'
import useToasterStore from '@/stores/useToaster'
import useOrganizationsStore from '@/stores/useOrganizations'
import { getPatatoidFile } from '@/composables/usePatatoids'
import { usePublicURL } from '@/composables/usePublic'
import { I18nT } from 'vue-i18n'

const props = defineProps<{
  token: string
}>()

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const { t, locale } = useNuxtI18n()
const organizationCode = useOrganizationCode()

const form = ref({
  email: '',
  given_name: '',
  family_name: '',
  password: '',
  profile_picture: '',
  acceptedTOS: false,
})

const asyncing = ref(false)
const confirm = ref(false)
const currentPatatoidIndex = ref(1)
const showContactUsDrawer = ref(false)
const isLinkValid = ref(false)
const contactEmail = ref('')
const verifyingLink = ref(true)

const rules = computed(() => ({
  acceptedTOS: {
    checked: helpers.withMessage(
      () => t('register.tos-is-required'),
      (value) => value === true
    ),
  },
  email: {
    required: helpers.withMessage(() => t('register.email.is-required'), required),
    email: helpers.withMessage(() => t('register.email.is-invalid'), email),
  },
  given_name: {
    required: helpers.withMessage(() => t('register.given_name.is-required'), required),
  },
  family_name: {
    required: helpers.withMessage(() => t('register.family_name.is-required'), required),
  },
  password: {
    required: helpers.withMessage(() => t('register.password.is-required'), required),
  },
}))

const v$ = useVuelidate(rules, form, {
  // ContactDrawer have form/vuelidate, so no scope all child
  $scope: false,
})

const backgroundImageUrl = computed(() => usePublicURL('/page404/page-404.png'))

const validateToken = async () => {
  try {
    const apiToken = await getInvitation(organizationCode, props.token)
    const expirationDate = new Date(apiToken.expire_at)
    if (expirationDate > new Date()) {
      return true
    }
  } catch (error) {
    console.error(error)
  }
  return false
}
const register = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    return
  }
  asyncing.value = true
  try {
    const formData = new FormData()
    imageSizesFormDataPost(formData)

    const profileImage = await getPatatoidFile(currentPatatoidIndex.value)
    if (profileImage instanceof File) {
      formData.append('profile_picture_file', profileImage, profileImage.name)
    }

    ;['given_name', 'family_name', 'password', 'email'].forEach((key) => {
      formData.append(key, form.value[key])
    })

    formData.append('language', locale.value)

    await postUserWithInvitation(props.token, formData)

    confirm.value = true
  } catch (error) {
    if (error?.response?.status === 409) {
      toaster.pushError(t('register.email-already-exists'))
    } else {
      toaster.pushError(`${t('register.save-error')} ${error?.response?.data?.error || ''}`)
    }

    console.error(error)
  } finally {
    asyncing.value = false
  }
}

const login = () => goToKeycloakLoginPage

const closeDrawer = () => {
  showContactUsDrawer.value = false
}

onMounted(async () => {
  isLinkValid.value = await validateToken()
  verifyingLink.value = false
  contactEmail.value = organizationsStore.current?.contact_email
})

useLpiHead2({
  title: computed(() => t('register.title')),
})
</script>

<template>
  <div v-if="verifyingLink" class="loader">
    <LoaderSimple />
  </div>
  <div v-else>
    <div v-if="!isLinkValid" class="link-expired">
      <div>
        <h1 class="title">
          {{ $t('page404.title') }}
        </h1>
        <p class="extra-informations">
          {{ $t('invitation.expired-link') }}
          <a :href="`mailto:${contactEmail}`">
            {{ contactEmail }}
          </a>
        </p>
        <div class="illustration" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
          <p class="expired-text">
            {{ $t('invitation.expired-link-image') }}
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      <SignUpWrapper :sign-up-title="confirm ? $t('register.title-confirm') : $t('register.title')">
        <transition name="fade" mode="out-in">
          <div v-if="confirm" class="confirm-message">
            <I18nT keypath="register.confirmation" tag="p">
              <strong>{{ form.email }}</strong>
            </I18nT>
          </div>
          <div v-else class="form">
            <div class="form-group">
              <TextInput
                v-model="form.given_name"
                :label="$t('register.given_name.label')"
                :placeholder="$t('register.given_name.placeholder')"
                data-test="first-name"
                @blur="v$.given_name.$validate"
              />
              <FieldErrors :errors="v$.given_name.$errors" />
            </div>
            <div class="form-group">
              <TextInput
                v-model="form.family_name"
                :label="$t('register.family_name.label')"
                :placeholder="$t('register.family_name.placeholder')"
                data-test="last-name"
                @blur="v$.family_name.$validate"
              />
              <FieldErrors :errors="v$.family_name.$errors" />
            </div>
            <div class="form-group">
              <TextInput
                v-model="form.email"
                :label="$t('register.email.label')"
                input-type="email"
                :placeholder="$t('register.email.placeholder')"
                data-test="email"
                @blur="v$.email.$validate"
              />
              <FieldErrors :errors="v$.email.$errors" />
            </div>

            <div class="form-group">
              <TextInput
                v-model="form.password"
                input-type="password"
                :label="$t('register.password.label')"
                :placeholder="$t('register.password.placeholder')"
                data-test="password"
                @blur="v$.password.$validate"
              />
              <FieldErrors :errors="v$.password.$errors" />
            </div>
            <div class="form-group">
              <div class="tos-wrapper">
                <LpiCheckbox v-model="form.acceptedTOS" label="" data-test="accepted-tos" />
                <I18nT keypath="register.tos" tag="p" class="tos">
                  <template #term>
                    <NuxtLink to="/terms-of-service" class="link" target="_blank">
                      {{ $t('register.term') }}
                    </NuxtLink>
                  </template>

                  <template #privacy>
                    <NuxtLink to="/personal-data" class="link" target="_blank">
                      {{ $t('register.privacy') }}
                    </NuxtLink>
                  </template>
                </I18nT>
              </div>
              <FieldErrors :errors="v$.acceptedTOS.$errors" />
            </div>
            <div class="action">
              <div>
                <LpiButton
                  :disabled="v$.$invalid || asyncing"
                  :label="$t('common.confirm')"
                  :btn-icon="asyncing ? 'LoaderSimple' : null"
                  class="register-btn"
                  data-test="register-btn"
                  @click.stop="register"
                />
              </div>
            </div>
          </div>
        </transition>
        <template #post-box>
          <div class="extra-links" :class="{ 'is-confirm': confirm }">
            <p v-if="!confirm" class="extra-link extra-login">
              {{ $t('register.have-account') }}
              <a href="#" class="link" @click.prevent="login">{{ $t('register.login') }}</a>
            </p>
            <p class="extra-link extra-help">
              {{ $t('register.need-help') }}
              <a href="#" class="link" @click.prevent="showContactUsDrawer = true">
                {{ $t('register.contact-us') }}
              </a>
            </p>
          </div>
        </template>
      </SignUpWrapper>
    </div>
  </div>

  <ContactDrawer :is-opened="showContactUsDrawer" @close="closeDrawer" />
</template>

<style lang="scss" scoped>
.confirm {
  border-radius: $border-radius-m;
  padding: $space-xl;
}

.tos-wrapper {
  display: flex;
  gap: $space-m;
  align-items: flex-start;
  justify-content: stretch;

  > label {
    margin-top: 4px;
  }

  > p {
    flex-grow: 1;
  }
}

.action {
  display: flex;
  padding-bottom: pxToRem(24px);
  flex-direction: column;
  align-items: center;

  .register-btn {
    width: 100%;
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
