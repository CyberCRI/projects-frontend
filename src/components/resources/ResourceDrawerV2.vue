<script setup lang="ts" generic="T extends AttachmentFileModel | AttachmentLinkModel">
import { defaultAttachmentForm, useAttachmentForm } from '~/form/attachement'
import type { AttachmentLinkModel } from '~/models/attachment-link.model'
import type { AttachmentFileModel } from '~/models/attachment-file.model'
import ResourceCard from '~/components/resources/ResourceCard.vue'
import { isEqual } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    resource?: T
    asyncing?: boolean
    formType: 'file' | 'link'
  }>(),
  {
    isOpened: false,
    resource: null,
    label: null,
    asyncing: false,
  }
)

const { stateModals, openModals, closeModals, closeAllModals } = useModals({
  saveChange: false,
})

const defaultForm = () => {
  const newForm = defaultAttachmentForm()

  if (props.resource) {
    newForm.id = props.resource.id
    newForm.title = props.resource.title ?? newForm.title
    newForm.description = props.resource.description ?? newForm.description

    if (props.formType === 'link') {
      const resource = props.resource as AttachmentLinkModel
      newForm.site_url = resource.site_url ?? newForm.site_url
    } else if (props.formType === 'file') {
      const resource = props.resource as AttachmentFileModel

      if (resource.file) {
        const file = new File([], resource.file.split('/').at(-1), {
          type: resource.mime,
        })
        newForm.file = file ?? newForm.file
      }
    }
  }

  return newForm
}

const { isValid, form, errors, cleanedData, reset } = useAttachmentForm(
  computed(() => props.formType),
  { lazy: true, default: defaultForm() }
)

const emit = defineEmits<{
  close: []
  submit: [(typeof cleanedData)['value']]
}>()

watch(
  () => [props.resource, props.isOpened],
  () => reset(defaultForm()),
  { immediate: true }
)

const cancel = () => {
  closeAllModals()
  emit('close')
}

const onConfirm = () => {
  if (isValid) {
    emit('submit', cleanedData.value)
  } else {
    console.error('tyring to confirm with form not valid', errors)
  }
}

const onClose = () => {
  const actualForm = { ...form.value }
  const originalForm = defaultForm()
  if (actualForm.id && props.formType === 'file') {
    actualForm.file = originalForm.file = null
  }
  if (isEqual(actualForm, originalForm)) {
    cancel()
  } else {
    openModals('saveChange')
  }
}
</script>

<template>
  <BaseDrawer
    :confirm-action-disabled="!isValid"
    :confirm-action-name="$t('common.save')"
    :is-opened="isOpened"
    :title="form.id ? $t(`resource.${formType}.edit`) : $t(`resource.${formType}.add`)"
    class="resource-modal small"
    :asyncing="asyncing"
    @close="onClose"
    @confirm="onConfirm"
  >
    {{ JSON.stringify(errors) }}
    <div class="list-container">
      <TextInput
        v-model="form.title"
        :label="$t('form.title')"
        required
        :placeholder="$t('form.title')"
        class="text-input"
        data-test="input-link-title"
        :errors="errors.title"
      />

      <TextInput
        v-model="form.description"
        :label="$t('form.description')"
        required
        :placeholder="$t('form.description')"
        class="text-input"
        data-test="input-link-description"
        :errors="errors.description"
      />

      <TextInput
        v-if="formType === 'link'"
        v-model="form.site_url"
        :label="$t('resource.link.label')"
        required
        class="text-input"
        data-test="input-link-adress"
        placeholder="https://..."
        :errors="errors.site_url"
      />
      <div v-else-if="formType === 'file'" class="file-form">
        <ResourceCard v-if="form.file" :mime="form.file.type" :title="form.file.name" />
        <!-- hide input if is editable
          add "Infinity" to maxSize to avoid check size in compoenents
          use vulidate to check fileSize
        -->
        <ImageInput
          v-if="!form.id"
          id="add-file-input"
          :label="$t('resource.file.add')"
          required
          class="text-input"
          file-types="*/*"
          :max-size-mb="Infinity"
          :errors="errors.file"
          @upload-image="form.file = $event"
        />
      </div>
    </div>
  </BaseDrawer>

  <!-- modal -->
  <ConfirmModal
    v-if="stateModals.saveChange"
    content=""
    :title="$t('form.quit-without-saving-title')"
    @cancel="closeModals('saveChange')"
    @confirm="cancel"
  />
</template>

<style lang="scss" scoped>
.file-form {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-direction: column;
}
</style>
