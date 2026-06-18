<template>
  <form class="list-container">
    <TextInput
      v-model="form.title"
      :label="$t('instructions.form.title.label')"
      :placeholder="$t('instructions.form.title.placeholder')"
      class="input-field"
      :errors="errors.title"
      required
    />

    <Field :label="$t('instructions.form.content.label')" required>
      <TipTapEditor
        ref="tiptapEditor"
        v-model="form.content"
        :save-image-callback="saveOrganizationImage"
        class="input-field content-editor no-max-height w-full"
        mode="full"
        :errors="errors.content"
      />
    </Field>

    <DateField
      v-model="form.publication_date"
      :label="$t('instructions.form.publication_date.label')"
      :errors="errors.publication_date"
    />

    <Field
      :label="$t('instructions.form.notify.label')"
      :help="$t('instructions.form.notify.notice')"
    >
      <button type="button" class="date-btn" @click="toggleNotify">
        <IconImage
          class="icon"
          :name="form.has_to_be_notified ? 'SquareRounded' : 'SquareRoundedOutline'"
        />
        {{ $t('instructions.form.notify.button') }}
      </button>
    </Field>

    <Field :label="$t('instructions.form.visibility.label')">
      <LpiCheckbox
        v-model="form.visible_by_all"
        :label="$t('instructions.form.visibility.notice')"
      />
    </Field>

    <Field
      :label="$t('instructions.form.groups.label')"
      :help="$t('instructions.form.groups.notice')"
    >
      <MultiGroupPicker v-model="form.people_groups" />
    </Field>
  </form>
</template>

<script setup lang="ts">
import MultiGroupPicker from '@/components/group/MultiGroupPicker/MultiGroupPicker.vue'
import { defaultInstructionForm, useInstructionForm } from '~/form/instruction'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import { postOrganizationImage } from '@/api/organizations.service'
import type { InstructionForm } from '@/models/instruction.model'
import IconImage from '@/components/base/media/IconImage.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import DateField from '@/components/base/form/DateField.vue'
import Field from '~/components/base/form/Field.vue'

const props = defineProps<{
  instruction?: Partial<InstructionForm>
}>()

const defaultLocalForm = () => {
  const newForm = defaultInstructionForm()
  if (props.instruction) {
    newForm.id = props.instruction.id
    newForm.title = props.instruction.title || newForm.title
    newForm.content = props.instruction.content || newForm.content
    newForm.visible_by_all = props.instruction.visible_by_all ?? newForm.visible_by_all
    newForm.publication_date = props.instruction.publication_date || newForm.publication_date
    newForm.has_to_be_notified = props.instruction.has_to_be_notified || newForm.has_to_be_notified
  }
  return newForm
}

const model = defineModel<InstructionForm>({ default: defaultInstructionForm() })

const { form, isValid, errors, cleanedData, reset } = useInstructionForm({ lazy: true })
watch(
  () => props.instruction,
  () => reset(defaultLocalForm()),
  { immediate: true, deep: true }
)
watchEffect(() => (model.value = cleanedData.value))

const emit = defineEmits<{
  invalid: [boolean]
}>()
watchEffect(() => emit('invalid', !isValid.value))
const organizationCode = useOrganizationCode()

const toggleNotify = () => {
  form.value.has_to_be_notified = !form.value.has_to_be_notified
}

const saveOrganizationImage = (file) => {
  const formData = new FormData()
  formData.append('file', file, file.name)
  return postOrganizationImage({
    orgCode: organizationCode,
    body: formData,
  })
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
