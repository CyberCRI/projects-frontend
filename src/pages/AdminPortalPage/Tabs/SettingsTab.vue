<script setup>
import { Sketch } from '@ckpack/vue-color'
import { useVuelidate } from '@vuelidate/core'
import { required, requiredIf, maxLength, email, helpers } from '@vuelidate/validators'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const { t } = useI18n()

const isLoading = ref(false)
const form = ref({
  contact_email: '',
  language: '',
  logo_image: {
    variations: {
      small: undefined,
    },
  },
  name: '',
  is_logo_visible_on_parent_dashboard: false,
  background_color: '',
})

const languageOptions = computed(() => {
  return organizationsStore.languages.value.map((lang) => {
    return {
      value: lang,
      label: t(`language.label-${lang}`),
      selected: form.value.language === lang,
    }
  })
})

const organization = computed(() => {
  return organizationsStore.current
})

const visibilityOptions = computed(() => {
  return [
    {
      value: true,
      label: t('admin.portal.general.visible'),
      iconName: 'Eye',
    },
    {
      value: false,
      label: t('admin.portal.general.invisible'),
      iconName: 'EyeSlash',
    },
  ]
})

onMounted(() => {
  const organizationData = JSON.parse(JSON.stringify(organization.value))
  for (const key in form.value) {
    form.value[key] = organizationData[key]
  }
  if (!form.value.background_color) form.value.background_color = '#FFFFFF'
})
const rules = {
  form: {
    name: {
      required: helpers.withMessage(t('admin.form.admin-info.name.required'), required),
      maxLength: helpers.withMessage(t('admin.form.admin-info.name.max-length'), maxLength(32)),
    },
    contact_email: {
      required: helpers.withMessage(t('admin.form.admin-info.contact-email.required'), required),
      email: helpers.withMessage(t('admin.form.admin-info.contact-email.email'), email),
    },
    language: {
      required: helpers.withMessage(t('admin.form.admin-info.language.required'), required),
    },
    background_color: {
      required: helpers.withMessage(
        t('admin.form.admin-info.background-color.required-if'),
        requiredIf(form.value.is_logo_visible_on_parent_dashboard)
      ),
    },
  },
}

const v$ = useVuelidate(rules, { form })

const saveData = async () => {
  isLoading.value = true

  const data = { ...form.value }

  try {
    await organizationsStore.updateCurrentOrganization(data)
    toaster.pushSuccess(t('toasts.organization-general-update.success'))
  } catch (error) {
    toaster.pushError(`${t('toasts.organization-general-update.error')} (${error})`)
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <ClientOnly>
    <div class="information-tab">
      <section>
        <div class="block-container">
          <LogoAdminBlock />

          <BannerAdminBlock />

          <ChatAdminBlock />

          <WordingAdminBlock />
        </div>
      </section>

      <section>
        <div class="block-container">
          <AdminBlock :block-title="$t('form.organization-name')">
            <span class="description">{{ $t('tips.organization-name') }}</span>
            <TextInput v-model="form.name" class="text-input" @blur="v$.form.name.$touch" />
            <FieldErrors :errors="v$.form.name.$errors" />
          </AdminBlock>
          <AdminBlock :block-title="$t('tips.organization-email')">
            <span class="description">{{}}</span>
            <TextInput
              v-model="form.contact_email"
              class="text-input"
              @blur="v$.form.contact_email.$touch"
            />
            <FieldErrors :errors="v$.form.contact_email.$errors" />
          </AdminBlock>
          <AdminBlock :block-title="$t('form.language')">
            <span class="description">{{ $t('tips.organization-language') }}</span>
            <LpiSelect
              v-model="form.language"
              :options="languageOptions"
              @blur="v$.form.language.$touch"
            />
            <FieldErrors :errors="v$.form.language.$errors" />
          </AdminBlock>
          <AdminBlock
            :block-title="$filters.capitalize($t('admin.portal.general.portal-referencing'))"
          >
            <span class="description">{{ $t('tips.organization-visibility') }}</span>
            <GroupButton
              v-model="form.is_logo_visible_on_parent_dashboard"
              :options="visibilityOptions"
              has-icon
            />
            <FieldErrors :errors="v$.form.background_color.$errors" />

            <div v-if="form.is_logo_visible_on_parent_dashboard" class="color-ctn">
              <span class="description">
                {{ $filters.capitalize($t('tips.organization-logo')) }}
              </span>

              <Sketch
                v-model="form.background_color"
                data-test="input-organization-logo-background"
                @update:model-value="(value) => (form.background_color = value.hex)"
              />
            </div>
          </AdminBlock>

          <LpiButton
            :disabled="v$.$invalid"
            :label="$filters.capitalize($t('common.save'))"
            :btn-icon="isLoading ? 'LoaderSimple' : null"
            class="save-button"
            @click="saveData"
          />
        </div>
      </section>
    </div>
  </ClientOnly>
</template>
<style lang="scss" scoped>
.information-tab {
  display: flex;
  flex-direction: column;
  padding: $space-xl 0;

  section:last-of-type {
    margin-top: $space-l;
  }

  .block-container {
    padding: $space-l 0;
    background: $white;
    border-radius: $border-radius-l;

    &:not(:first-of-type) {
      margin-top: $space-l;
    }

    .description {
      display: block;
      margin-bottom: $space-m;
      font-size: $font-size-s;
    }

    button {
      margin: $space-m auto 0;
    }

    .save-button {
      margin-top: $space-2xl;
    }

    .input-container:not(:first-of-type) {
      margin-top: $space-2xl;
    }

    .color-ctn {
      margin-top: $space-m;
    }
  }
}

@media (min-width: $min-desktop) {
  .information-tab {
    align-items: stretch;
    flex-direction: row;

    section {
      width: 50%;

      &:first-of-type {
        .block-container:not(:first-of-type) {
          margin-top: $space-xl;
        }
      }

      &:last-of-type {
        margin-top: 0;
        margin-left: $space-xl;
      }
    }
  }
}
</style>
