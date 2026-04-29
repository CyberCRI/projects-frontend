<template>
  <BaseDrawer
    :confirm-action-disabled="asyncing"
    :confirm-action-name="$t('common.send')"
    :is-opened="isOpen"
    :title="$t(`profile.edit.skills.mentorship.contact.title-${mode}`)"
    class="small"
    :asyncing="isLoading"
    @close="$emit('close')"
    @confirm="confirm"
  >
    <p class="notice">
      {{ $t(`profile.edit.skills.mentorship.contact.notice-${mode}`) }}
    </p>
    <div class="form-input">
      <h4 class="title">{{ $t('profile.edit.skills.mentorship.contact.fields.title.label') }} *</h4>
      <TextInput
        v-model="form.title"
        class="text-input"
        data-test="ask-mentorship-title"
        :placeholder="$t(`profile.edit.skills.mentorship.contact.fields.title.placeholder-${mode}`)"
        @blur="v$.title.$validate"
      />

      <FieldErrors :errors="v$.title.$errors" />
    </div>

    <div class="form-input">
      <h4 class="title">{{ $t('profile.edit.skills.mentorship.contact.fields.text.label') }} *</h4>
      <p class="notice">
        {{ $t(`profile.edit.skills.mentorship.contact.fields.text.notice-${mode}`) }}
      </p>
      <TextInput
        v-model="form.content"
        input-type="textarea"
        class="text-input"
        data-test="ask-mentorship-text"
        :placeholder="$t('profile.edit.skills.mentorship.contact.fields.text.placeholder')"
        @blur="v$.content.$validate"
      />
      <FieldErrors :errors="v$.content.$errors" />
    </div>

    <div class="form-input">
      <h4 class="title">{{ $t('profile.edit.skills.mentorship.contact.fields.email.label') }} *</h4>
      <p class="notice">
        {{ $t('profile.edit.skills.mentorship.contact.fields.email.notice') }}
      </p>
      <TextInput
        v-model="form.reply_to"
        class="text-input"
        data-test="ask-mentorship-email"
        :placeholder="$t('profile.edit.skills.mentorship.contact.fields.email.placeholder')"
        @blur="v$.reply_to.$validate"
      />
      <FieldErrors :errors="v$.reply_to.$errors" />
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { askMentorship, offerMentorship } from '@/api/mentorship.service'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import { email, helpers, required } from '@vuelidate/validators'
import TextInput from '@/components/base/form/TextInput.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import type { SkillModel } from '@/models/skill.model'
import useToasterStore from '@/stores/useToaster'
import { defaultForm } from '@/form/mentorship'
import useUsersStore from '@/stores/useUsers'
import useValidate from '@vuelidate/core'

const props = withDefaults(
  defineProps<{
    skill: SkillModel
    isOpen?: boolean
    asyncing?: boolean
    isOffer?: boolean
  }>(),
  {
    isOpen: false,
    asyncing: false,
    isOffer: false,
  }
)

const emit = defineEmits<{
  close: []
  'mentorship-send': []
}>()
const { t } = useNuxtI18n()
const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const usersStore = useUsersStore()

const form = ref(defaultForm())

const rules = computed(() => ({
  title: {
    required: helpers.withMessage(
      t('profile.edit.skills.mentorship.contact.fields.title.required'),
      required
    ),
  },
  content: {
    required: helpers.withMessage(
      t('profile.edit.skills.mentorship.contact.fields.title.required'),
      required
    ),
  },
  reply_to: {
    required: helpers.withMessage(
      t('profile.edit.skills.mentorship.contact.fields.title.required'),
      required
    ),
    email: helpers.withMessage(
      t('profile.edit.skills.mentorship.contact.fields.email.invalid'),
      email
    ),
  },
}))

const v$ = useValidate(rules, form)
const isLoading = ref(false)

const mode = computed(() => (props.isOffer ? 'offer' : 'ask'))

watch(
  () => props.isOpen,
  () => {
    form.value = defaultForm()
    // this the login mail
    form.value.reply_to = usersStore.userFromApi?.email || ''
    v$.value.$reset()
  }
)

const confirm = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    return
  }

  isLoading.value = true
  try {
    if (props.isOffer) {
      await offerMentorship(organizationCode, props.skill, form.value)
    } else {
      await askMentorship(organizationCode, props.skill, form.value)
    }
    emit('mentorship-send')
    await nextTick()
    toaster.pushSuccess(t('profile.edit.skills.mentorship.contact.success'))
  } catch (error) {
    toaster.pushError(`${t('profile.edit.skills.mentorship.contact.error')} (${error})`)
    console.error(error)
  } finally {
    isLoading.value = false
    emit('close')
  }
}
</script>

<style scoped lang="scss">
.title {
  font-size: $font-size-m;
  font-weight: bold;
  margin: $space-m 0;
}

.save-button {
  margin: $space-l 0;
}

.form-input {
  margin-bottom: $space-l;
}

.notice {
  margin: $space-m 0;
}
</style>
