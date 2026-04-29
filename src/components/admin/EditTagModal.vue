<script setup lang="ts">
import { helpers, required } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'

import { postClassificationTag, putClassificationTag } from '~/api/tag-classification.service'

import FieldErrors from '~/components/base/form/FieldErrors.vue'
import CharCounter from '~/components/base/form/CharCounter.vue'
import BaseModal from '~/components/base/modal/BaseModal.vue'
import TextInput from '~/components/base/form/TextInput.vue'

import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'

import type { TagClassificationModel } from '~/models/tagclassification.model'
import LpiButton from '../base/button/LpiButton.vue'
import type { TagModel } from '~/models/tag.model'
import { defaultForm } from '~/form/tag'

const { t } = useNuxtI18n()

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()

const rules = computed(() => ({
  title_en: {
    required: helpers.withMessage(t('admin.classifications.tag-form.required-error'), required),
  },
  title_fr: {
    required: helpers.withMessage(t('admin.classifications.tag-form.required-error'), required),
  },
  description_en: {
    required: helpers.withMessage(t('admin.classifications.tag-form.required-error'), required),
  },
  description_fr: {
    required: helpers.withMessage(t('admin.classifications.tag-form.required-error'), required),
  },
}))

const props = withDefaults(
  defineProps<{
    tag?: TagModel
    classification: TagClassificationModel
    isOpen?: boolean
  }>(),
  {
    tag: null,
    isOpen: true,
  }
)

const emit = defineEmits(['close', 'tag-edited'])

const asyncing = ref(false)

const form = ref(defaultForm())

const v$ = useValidate(rules, form)

watchEffect(() => {
  if (props.isOpen) {
    nextTick(() => v$.value.$reset())
    form.value = defaultForm()
    if (props.tag) {
      form.value = {
        ...props.tag,
      }
    }
  }
})

const isAddMode = computed(() => !form.value.id)

const drawerTitle = computed(() => {
  return isAddMode.value
    ? t('admin.classifications.add-tag.title')
    : t('admin.classifications.edit-tag.title')
})

async function saveTag() {
  asyncing.value = true

  const isFrOrg = organizationsStore.current.language === 'fr'

  const payload = {
    ...form.value,
    title: isFrOrg ? form.value.title_fr : form.value.title_en,
    description: isFrOrg ? form.value.description_fr : form.value.description_en,
  }

  try {
    if (isAddMode.value) {
      delete payload.id
      await postClassificationTag(organizationsStore.current.code, props.classification.id, payload)
      toaster.pushSuccess(t('admin.classifications.add-tag.success'))
    } else {
      await putClassificationTag(
        organizationsStore.current.code,
        props.classification.id,
        form.value.id,
        payload
      )
      toaster.pushSuccess(t('admin.classifications.edit-tag.success'))
    }
  } catch (error) {
    if (isAddMode.value) {
      toaster.pushError(t('admin.classifications.add-tag.error'))
    } else {
      toaster.pushError(t('admin.classifications.edit-tag.error'))
    }
    console.error(error)
  } finally {
    asyncing.value = false
    emit('tag-edited')
  }
}
</script>
<template>
  <BaseModal v-if="isOpen" @close="emit('close')">
    <template #header-title>
      {{ drawerTitle }}
    </template>
    <template #content>
      <div class="form-section">
        <TextInput
          v-model.trim="form.title_en"
          :label="t('admin.classifications.tag-form.title-en') + ' *'"
          :required="true"
          :max-length="50"
          @blur="v$.title_en.$validate"
        />
        <div class="input-footer">
          <FieldErrors :errors="v$.title_en.$errors" />
          <CharCounter :text="form.title_en" :max-length="50" />
        </div>
      </div>
      <div class="form-section">
        <TextInput
          v-model.trim="form.title_fr"
          :label="t('admin.classifications.tag-form.title-fr') + ' *'"
          :required="true"
          :max-length="50"
          @blur="v$.title_fr.$validate"
        />
        <div class="input-footer">
          <FieldErrors :errors="v$.title_fr.$errors" />
          <CharCounter :text="form.title_fr" :max-length="50" />
        </div>
      </div>
      <div class="form-section">
        <TextInput
          v-model.trim="form.description_en"
          :label="t('admin.classifications.tag-form.description-en') + ' *'"
          :required="true"
          input-type="textarea"
          :max-length="500"
          @blur="v$.description_en.$validate"
        />

        <div class="input-footer">
          <FieldErrors :errors="v$.description_en.$errors" />
          <CharCounter :text="form.description_en" :max-length="500" />
        </div>
      </div>
      <div class="form-section">
        <TextInput
          v-model.trim="form.description_fr"
          :label="t('admin.classifications.tag-form.description-fr') + ' *'"
          :required="true"
          input-type="textarea"
          :max-length="500"
          @blur="v$.description_fr.$validate"
        />
        <div class="input-footer">
          <FieldErrors :errors="v$.description_fr.$errors" />
          <CharCounter :text="form.description_fr" :max-length="500" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="actions">
        <LpiButton :disabled="asyncing" :label="t('common.cancel')" @click="emit('close')" />
        <LpiButton
          :loading="asyncing"
          :label="t('common.save')"
          :disabled="v$.$invalid || asyncing"
          :btn-icon="asyncing ? 'LoaderSimple' : null"
          @click="saveTag"
        />
      </div>
    </template>
  </BaseModal>
</template>
<style lang="scss" scoped>
.form-section + .form-section {
  margin-top: 1.5rem;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  .char-counter {
    margin-left: auto;
  }
}

.actions,
.checkboxes {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
