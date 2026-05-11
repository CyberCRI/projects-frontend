<script setup lang="ts">
import { defaultProjectForm, useProjectDescriptionForm } from '~/form/project'
import { refreshProjectData } from '~/composables/project/refreshProject'
import { patchProject, postProjectImage } from '~/api/projects.service'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import type { TranslatedProject } from '~/models/project.model'
import useOrganizationsStore from '~/stores/useOrganizations'
import FormPanel from '~/components/base/FormPanel.vue'
import { textIsEmpty } from '~/functs/string'
import { isEqual, pick } from 'es-toolkit'

const props = defineProps<{ project: TranslatedProject }>()

const toaster = useToaster()
const { t } = useNuxtI18n()
const asyncing = ref(false)
const inSoloMode = ref(false)
const socketReady = ref(false)
const router = useRouter()
const organizationsStore = useOrganizationsStore()

const editorRef = useTemplateRef('tiptapEditor')

const room = computed(() => `description_${props.project.id}`)
const providerParams = computed(() => {
  return {
    projectId: props.project.id,
    organizationId: organizationsStore.current.id,
  }
})

const defaultLocalForm = () => {
  const defaultForm = pick(defaultProjectForm(), ['description'])
  const newForm = { ...defaultForm }
  if (textIsEmpty(props.project.description)) {
    if (props.project.template?.project_description) {
      newForm.description = props.project.template.project_description
    }
  } else {
    newForm.description = props.project.description
  }
  return newForm
}

const { isValid, form, errors, reset } = useProjectDescriptionForm()

watch(
  () => props.project.description,
  () => reset(defaultLocalForm()),
  { immediate: true }
)

const { stateModals, openModals, closeModals } = useModals({
  saveChange: false,
  saveSolo: false,
  unauthorized: false,
})

// callback

const saveDescriptionImage = (file) => {
  const formData = new FormData()
  formData.append('file', file, file.name)
  return postProjectImage(props.project.id, formData)
}

const redirect = () => {
  router.push({
    name: 'projectDescription',
    params: {
      slugOrId: props.project.slug || props.project.id,
    },
  })
}

const onSubmit = () => {
  if (!isValid.value) {
    return
  }

  asyncing.value = true

  const body = {
    description: form.value.description,
  }

  patchProject(props.project.id, body)
    .then(() => {
      // TODO notify + analytics
      toaster.pushSuccess(t('toasts.description-update.success'))
      refreshProjectData(props.project)
      redirect()
    })
    .catch(() => {
      toaster.pushSuccess(t('toasts.description-update.error'))
    })
    .then(() => {
      asyncing.value = false
    })
}

const checkClose = () => {
  const numberEditor = inSoloMode.value
    ? 1
    : editorRef.value.editor?.storage?.collaborationCursor?.users?.length || 0

  // if form is same or your are in multiple user editor
  if (isEqual(form.value, defaultLocalForm()) || numberEditor !== 1) {
    redirect()
  } else {
    openModals('saveChange')
  }
}

const checkSubmit = () => {
  if (inSoloMode.value) {
    openModals('saveSolo')
  } else {
    onSubmit()
  }
}
</script>

<template>
  <BaseModuleTab :title="project.$t.title">
    <FormPanel
      :confirm-action-disabled="!isValid || (!inSoloMode && !socketReady)"
      @close="checkClose"
      @confirm="checkSubmit"
    >
      <ClientOnly>
        <TipTapCollaborativeEditor
          ref="tiptapEditor"
          v-model="form.description"
          :room="room"
          save-icon-visible
          :provider-params="providerParams"
          :save-image-callback="saveDescriptionImage"
          mode="full"
          :disable-save="asyncing"
          :errors="errors.description"
          @unauthorized="openModals('unauthorized')"
          @saved="checkSubmit"
          @socket-ready="socketReady = $event"
          @falled-back-to-solo-edit="inSoloMode = true"
        />
      </ClientOnly>
    </FormPanel>
  </BaseModuleTab>
  <!-- drawer -->

  <ConfirmModal
    v-if="stateModals.unauthorized"
    :title="$t('multieditor.unauthorized')"
    :content="$t('message.error-default')"
    :cancel-button-label="$t('common.ok')"
    no-second-button
    @cancel="redirect"
  />

  <ConfirmModal
    v-if="stateModals.saveChange"
    :title="$t('form.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="closeModals('saveChange')"
    @confirm="redirect"
  />

  <ConfirmModal
    v-if="stateModals.saveSolo"
    :title="$t(`multieditor.server-unconnectable.confirm-save-title`)"
    :content="$t(`multieditor.server-unconnectable.confirm-save-text`)"
    :confirm-button-label="$t('common.save')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="asyncing"
    @cancel="closeModals('saveSolo')"
    @confirm="onSubmit"
  />
</template>
