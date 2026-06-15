<script setup lang="ts">
import TipTapCollaborativeEditor from '~/components/base/form/TextEditor/TipTapCollaborativeEditor.vue'
import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'

import type {
  ProjectTabItemForm,
  TranslatedProjectTab,
  TranslatedProjectTabItem,
} from '~/models/projects-tabs.model'
import {
  createProjectTabItem,
  createProjectTabItemImage,
  updateProjectTabItem,
} from '~/api/project-tabs.service'
import { defualtProjectTabItemForm, useProjectTabItemForm } from '~/form/project-tabs'
import { useBlockNavigation } from '~/composables/useBlockNavigation'
import type { TranslatedProject } from '~/models/project.model'
import type { ImageModel } from '~/models/image.model'
import { getFirstTextNotEmpty } from '~/functs/string'
import { isEqual, isNil } from 'es-toolkit'
import analytics from '~/analytics'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    tab: TranslatedProjectTab
    item?: TranslatedProjectTabItem
    isOpened?: boolean
  }>(),
  {
    isOpened: false,
    item: null,
  }
)

const emit = defineEmits<{
  close: []
  reload: []
}>()

const defaultLocalForm = () => {
  const baseForm = defualtProjectTabItemForm()
  const newForm = {
    ...baseForm,
  }

  const item = props.item
  if (item) {
    newForm.id = item.id
    newForm.title = item.title || newForm.title
    newForm.content = getFirstTextNotEmpty([item.content]) || newForm.content
  }

  return newForm
}

const { t } = useNuxtI18n()
const { stateModals, closeModals, closeAllModals, openModals } = useModals({
  saveSolo: false,
  saveChange: false,
})
const close = () => {
  emit('close')
  closeAllModals()
}

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const { form, isValid, errors, cleanedData, reset } = useProjectTabItemForm({
  default: defaultLocalForm(),
})
watch(
  () => [props.item, props.isOpened, props.project],
  () => reset(defaultLocalForm()),
  { immediate: true, deep: true }
)
const isFormEqual = useBlockNavigation(
  () => !props.isOpened || isEqual(form.value, defaultLocalForm())
)

const asyncing = ref(false)

const providerParams = computed(() => ({
  itemId: props.item?.id ?? null,
  tabId: props.tab.id,
  projectId: props.project.id,
  organizationId: organizationsStore.current.id,
}))

const inOfflineMode = ref(false)

const isCreated = computed(() => isNil(props.item?.id) || inOfflineMode.value)

const room = computed(() => (props.item?.id ? `blog_${props.item.id}` : null))

const handleImage = (img: ImageModel) => {
  form.value.images_ids.push(img.id)
}

const saveItemImage = (file: File) => {
  const body = new FormData()
  body.append('file', file, file.name)

  return createProjectTabItemImage(props.project.id, props.tab.id, body, {
    query: {
      tab_item_id: props.item?.id,
    },
  }).then((image) => {
    analytics.track('create_project_tab_item_image', {
      project: props.project.id,
      tab: props.tab.id,
      image: image.id,
    })
    return image
  })
}

const patchTabItem = (body: ProjectTabItemForm) => {
  return updateProjectTabItem(props.project.id, props.tab.id, props.item.id, body)
    .then(() => {
      analytics.track('update_project_tab_item', {
        project: props.project.id,
        tab: props.tab.id,
        item: props.item.id,
      })
      toaster.pushSuccess(t('tab.toasts.item-update.success'))
      emit('reload')
      emit('close')
    })
    .catch(() => toaster.pushError(t('tab.toasts.item-update.error')))
    .finally(() => (asyncing.value = false))
}

const postTabItem = (body: ProjectTabItemForm) => {
  return createProjectTabItem(props.project.id, props.tab.id, body)
    .then((result) => {
      analytics.track('create_project_tab_item', {
        project: props.project.id,
        tab: props.tab.id,
        item: result.id,
      })
      toaster.pushSuccess(t('tab.toasts.item-create.success'))
      emit('reload')
      emit('close')
    })
    .catch(() => toaster.pushError(t('tab.toasts.item-create.error')))
    .finally(() => (asyncing.value = false))
}

const save = () => {
  if (!isValid.value) {
    return
  }

  asyncing.value = true
  const body = cleanedData.value

  if (props.item?.id) {
    patchTabItem(body)
  } else {
    postTabItem(body)
  }
}

const checkClose = () => {
  if (isFormEqual.value) {
    close()
  } else {
    openModals('saveChange')
  }
}
</script>

<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="!isValid || isFormEqual"
    :is-opened="isOpened"
    :title="$t('tab.item.title')"
    class="blog-drawer"
    :asyncing="asyncing"
    @close="checkClose"
    @confirm="save"
  >
    <div class="list-container">
      <TextInput
        v-model="form.title"
        :label="$t('tab.form.title.label')"
        :placeholder="$t('tab.form.title.label')"
        class="input-field"
        required
        :errors="errors.title"
      />
      <Field :label="$t('tab.form.description.label')" required class="editor-section">
        <TipTapEditor
          v-if="isCreated"
          ref="tiptapEditor"
          v-model="form.content"
          class="input-field content-editor w-full"
          mode="full"
          :save-image-callback="saveItemImage"
          :errors="errors.content"
          @image="handleImage"
        />
        <TipTapCollaborativeEditor
          v-else
          ref="tiptapEditor"
          v-model="form.content"
          class="w-full"
          :room="room"
          :provider-params="providerParams"
          mode="full"
          save-icon-visible
          :save-image-callback="saveItemImage"
          :disable-save="asyncing"
          :errors="errors.content"
          @unauthorized="close"
          @image="handleImage"
          @saved="save"
          @falled-back-to-solo-edit="inOfflineMode = true"
        />
      </Field>
    </div>

    <!-- drawer/modal -->
    <ConfirmModal
      v-if="stateModals.saveChange"
      :title="$t('form.quit-without-saving-title')"
      :content="$t('common.confirm-close')"
      @cancel="closeModals('saveChange')"
      @confirm="close"
    />

    <ConfirmModal
      v-if="stateModals.saveSolo"
      :title="$t(`multieditor.server-unconnectable.confirm-save-title`)"
      :content="$t(`multieditor.server-unconnectable.confirm-save-text`)"
      :confirm-button-label="$t('common.save')"
      :cancel-button-label="$t('common.cancel')"
      :asyncing="asyncing"
      @cancel="closeModals('saveSolo')"
      @confirm="save"
    />
  </BaseDrawer>
</template>

<style lang="scss" scoped>
.blog-drawer {
  height: 100%;

  :deep(.drawer__main) {
    gap: $space-unit;
  }

  .content-editor {
    flex-grow: 1;
    min-height: pxToRem(300px);
  }
}

.editor-section {
  display: flex;
  flex-direction: column;
}
</style>
