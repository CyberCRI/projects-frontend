<script setup lang="ts">
import TipTapCollaborativeEditor from '~/components/base/form/TextEditor/TipTapCollaborativeEditor.vue'
import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'
import TextInput from '~/components/base/form/TextInput.vue'

import { defaultProjectTabItemForm, useProjectTabItemForm } from '~/form/project-tabs'
import type { ProjectTabItemForm, ImageModel } from 'shared-projects-frontend/models'
import type { ProviderParams } from 'shared-projects-frontend/interfaces'
import type { PropsDefinitions } from '~/composables/tiptap'
import { isNil } from 'es-toolkit'

withDefaults(
  defineProps<{
    asyncing?: boolean
    providerParams?: ProviderParams
    room?: string
    saveImageCallback?: PropsDefinitions['saveImageCallback']
  }>(),
  {
    asyncing: false,
    providerParams: null,
    saveImageCallback: null,
    room: null,
  }
)

defineEmits<{
  unauthorized: []
  save: []
}>()

const inOfflineMode = ref(false)

const model = defineModel<ProjectTabItemForm>({ default: defaultProjectTabItemForm })
const isCreated = computed(() => isNil(model.value?.id) || inOfflineMode.value)

const { form, errors } = useProjectTabItemForm({ model })

const handleImage = (img: ImageModel) => {
  form.value.images_ids.push(img.id)
}
</script>

<template>
  <div class="list-container">
    <TextInput
      v-model="form.title"
      :label="$t('tab.form.title-content.label')"
      :placeholder="$t('tab.form.title-content.label')"
      class="input-field"
      required
      :errors="errors.title"
    />
    <Field :label="$t('tab.form.content.label')" required class="editor-section">
      <TipTapEditor
        v-if="isCreated"
        ref="tiptapEditor"
        v-model="form.content"
        class="input-field content-editor w-full"
        mode="full"
        :save-image-callback="saveImageCallback"
        :errors="errors.content"
        @image="handleImage"
      />
      <TipTapCollaborativeEditor
        v-else-if="room"
        ref="tiptapEditor"
        v-model="form.content"
        class="w-full"
        :room="room"
        :provider-params="providerParams"
        mode="full"
        save-icon-visible
        :save-image-callback="saveImageCallback"
        :disable-save="asyncing"
        :errors="errors.content"
        @unauthorized="$emit('unauthorized')"
        @image="handleImage"
        @saved="$emit('save')"
        @falled-back-to-solo-edit="inOfflineMode = true"
      />
    </Field>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.blog-drawer {
  height: 100%;

  :deep(.drawer__main) {
    gap: variables.$space-unit;
  }

  .content-editor {
    flex-grow: 1;
    min-height: variables.pxtorem(300px);
  }
}

.editor-section {
  display: flex;
  flex-direction: column;
}
</style>
