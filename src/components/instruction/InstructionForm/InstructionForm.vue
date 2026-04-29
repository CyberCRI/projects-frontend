<template>
  <form>
    <div class="form-section">
      <TextInput
        :model-value="modelValue.title"
        :label="$t('instructions.form.title.label')"
        :placeholder="$t('instructions.form.title.placeholder')"
        class="input-field"
        @update:model-value="updateForm({ title: $event })"
        @blur="v$.title.$validate"
      />
      <FieldErrors :errors="v$.title.$errors" />
    </div>

    <div class="form-section">
      <label>{{ $t('instructions.form.content.label') }}</label>
      <TipTapEditor
        ref="tiptapEditor"
        :model-value="modelValue.content"
        :save-image-callback="saveOrganizationImage"
        class="input-field content-editor no-max-height"
        mode="full"
        @update:model-value="updateForm({ content: $event })"
        @blur="v$.content.$validate"
      />

      <FieldErrors :errors="v$.content.$errors" />
    </div>

    <DateField
      :model-value="modelValue.publication_date"
      :label="$t('instructions.form.publication_date.label')"
      :errors="v$.publication_date.$errors"
      @update:model-value="onDateSelected"
    />

    <div class="form-section">
      <label>{{ $t('instructions.form.notify.label') }}</label>
      <p class="notice">
        {{ $t('instructions.form.notify.notice') }}
      </p>

      <button type="button" class="date-btn" @click="toggleNotify">
        <IconImage
          class="icon"
          :name="modelValue.has_to_be_notified ? 'SquareRounded' : 'SquareRoundedOutline'"
        />
        {{ $t('instructions.form.notify.button') }}
      </button>
    </div>

    <div class="form-section">
      <label>{{ $t('instructions.form.visibility.label') }}</label>
      <LpiCheckbox
        :model-value="modelValue.visible_by_all"
        :label="$t('instructions.form.visibility.notice')"
        @update:is-public="updateForm({ visible_by_all: $event })"
      />
    </div>

    <div class="form-section">
      <label>{{ $t('instructions.form.groups.label') }}</label>
      <p class="notice">
        {{ $t('instructions.form.groups.notice') }}
      </p>

      <MultiGroupPicker
        :model-value="modelValue.people_groups"
        @update:model-value="updateForm({ people_groups: $event })"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import MultiGroupPicker from '@/components/group/MultiGroupPicker/MultiGroupPicker.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import { postOrganizationImage } from '@/api/organizations.service'
import type { InstructionForm } from '@/models/instruction.model'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import DateField from '@/components/base/form/DateField.vue'
import { helpers, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

const model = defineModel<InstructionForm>()

const emit = defineEmits<{
  invalid: [boolean]
}>()
const { t } = useNuxtI18n()
const organizationCode = useOrganizationCode()

const rules = computed(() => ({
  title: {
    required: helpers.withMessage(t('instructions.form.title.required'), required),
  },
  content: {
    required: helpers.withMessage(t('instructions.form.content.required'), required),
  },
  publication_date: {
    required: helpers.withMessage(t('instructions.form.publication_date.required'), required),
  },
}))

const v$ = useVuelidate(rules, model)
defineExpose({ v$ })

watch(
  () => v$.value.$invalid,
  (isInvalid) => {
    emit('invalid', isInvalid)
  }
)

const updateForm = (data) => {
  model.value = {
    ...model.value,
    ...data,
  }
}

const saveOrganizationImage = (file) => {
  const formData = new FormData()
  formData.append('file', file, file.name)
  return postOrganizationImage({
    orgCode: organizationCode,
    body: formData,
  })
}
const onDateSelected = (modelData) => {
  updateForm({ publication_date: modelData })
}

const toggleNotify = () => {
  updateForm({ has_to_be_notified: !model.value.has_to_be_notified })
}
</script>

<style lang="scss" scoped>
.input-field {
  margin: $space-l;
  margin-bottom: $space-xs;
}

.content-editor {
  flex-grow: 1;
  min-height: pxToRem(300px);
}

.date-preview {
  margin-left: $space-l;
  display: inline-block;
  font-size: 1.2rem;
  font-weight: 700;
}

.img-ctn {
  margin-bottom: $space-xl;
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    align-self: flex-start;
  }
}

.form-section + .form-section {
  margin-top: $space-xl;
}

label {
  font-size: 0.875rem;
  font-weight: bold;
  color: $black;
  display: block;
}

label,
.notice {
  margin-bottom: $space-l !important;
}

// TODO fix cleanly
:deep(.input-ctn),
:deep(.input-field) {
  margin: 0;
}

.date-btn {
  padding: $space-s;
  background-color: $white;
  border: $border-width-s solid $primary-dark;
  border-radius: $border-radius-s;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  gap: $space-m;
  color: $primary-dark;
  font-weight: 700;
  cursor: pointer;

  .icon {
    width: $layout-size-2xl;
    fill: $primary-dark;
  }
}
</style>
