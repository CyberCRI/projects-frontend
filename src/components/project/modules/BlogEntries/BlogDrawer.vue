<script setup lang="ts">
import { patchBlogEntry, postBlogEntry, postBlogEntryImage } from '~/api/blogentries.service'

import TipTapCollaborativeEditor from '~/components/base/form/TextEditor/TipTapCollaborativeEditor.vue'
import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import DateField from '~/components/base/form/DateField.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'

import type { BlogEntryForm, BlogEntryModel } from '~/models/blog-entry.model'
import { useBlockNavigation } from '~/composables/useBlockNavigation'
import type { TranslatedProject } from '~/models/project.model'
import { defaultBlogForm, useBlogEntryForm } from '~/form/blog'
import type { ImageModel } from '~/models/image.model'
import { getFirstTextNotEmpty } from '~/functs/string'
import { isEqual, isNil } from 'es-toolkit'
import analytics from '~/analytics'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    isOpened?: boolean
    blog?: BlogEntryModel
  }>(),
  {
    isOpened: false,
    blog: null,
  }
)

const emit = defineEmits<{
  close: []
  reload: []
}>()

const defaultLocalForm = () => {
  const baseForm = defaultBlogForm()
  const newForm = {
    ...baseForm,
  }
  const blog = props.blog
  const template = props.project.template
  if (blog) {
    newForm.id = blog.id
    newForm.created_at = blog.created_at
    newForm.images_ids = [...blog.images]
  }

  // add projectId in form
  newForm.project_id = props.project.id

  // set default content from template
  newForm.title =
    getFirstTextNotEmpty([blog?.title, template?.$t.blogentry_title, template?.blogentry_title]) ||
    newForm.title
  newForm.content =
    getFirstTextNotEmpty([
      blog?.content,
      template?.$t.blogentry_content,
      template?.blogentry_title,
    ]) || newForm.content
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
const { form, isValid, errors, cleanedData, reset } = useBlogEntryForm({ lazy: true })
watch(
  () => [props.blog, props.isOpened],
  () => reset(defaultLocalForm()),
  { immediate: true }
)
const isFormEqual = useBlockNavigation(() => isEqual(form.value, defaultLocalForm()))

const asyncing = ref(false)

const providerParams = computed(() => ({
  blogId: props.blog?.id ?? null,
  projectId: props.project.id,
  organizationId: organizationsStore.current.id,
}))

const inOfflineMode = ref(false)

const isCreated = computed(() => isNil(props.blog?.id) || inOfflineMode.value)

const room = computed(() => (props.blog?.id ? `blog_${props.blog.id}` : null))

const handleImage = (img: ImageModel) => {
  console.log(img)
  form.value.images_ids.push(img.id)
}

const saveBlogImage = (file: File) => {
  const body = new FormData()
  body.append('file', file, file.name)

  return postBlogEntryImage(props.project.id, body, {
    query: {
      blog_entry_id: props.blog?.id,
    },
  })
}

const patchBlog = (body: BlogEntryForm) => {
  return patchBlogEntry(props.project.id, props.blog.id, body)
    .then((result) => {
      analytics.blog.updateBlog({
        project: {
          id: props.project.id,
        },
        blogEntry: result,
      })
      toaster.pushSuccess(t('toasts.blog-create.success'))
      emit('reload')
      emit('close')
    })
    .catch(() => toaster.pushError(t('toasts.blog-create.error')))
    .finally(() => (asyncing.value = false))
}

const postBlog = (body: BlogEntryForm) => {
  return postBlogEntry(props.project.id, body)
    .then((result) => {
      analytics.blog.addBlog({
        project: {
          id: props.project.id,
        },
        blogEntry: result,
      })
      toaster.pushSuccess(t('toasts.blog-update.success'))
      emit('reload')
      emit('close')
    })
    .catch(() => toaster.pushError(t('toasts.blog-update.error')))
    .finally(() => (asyncing.value = false))
}

const save = () => {
  if (!isValid.value) {
    return
  }

  asyncing.value = true
  const body = cleanedData.value

  if (props.blog?.id) {
    patchBlog(body)
  } else {
    postBlog(body)
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
    :title="$t('blog.entry')"
    class="blog-drawer"
    :asyncing="asyncing"
    @close="checkClose"
    @confirm="save"
  >
    <div>
      <TextInput
        v-model="form.title"
        :label="$t('common.title')"
        :placeholder="$t('common.title')"
        class="input-field"
        :errors="errors.title"
      />
    </div>

    <div class="editor-section">
      <TipTapEditor
        v-if="isCreated"
        ref="tiptapEditor"
        v-model="form.content"
        class="input-field content-editor"
        mode="full"
        :save-image-callback="saveBlogImage"
        :errors="errors.content"
        @image="handleImage"
      />
      <TipTapCollaborativeEditor
        v-else
        ref="tiptapEditor"
        v-model="form.content"
        :room="room"
        :provider-params="providerParams"
        mode="full"
        save-icon-visible
        :save-image-callback="saveBlogImage"
        :disable-save="asyncing"
        :errors="errors.content"
        @unauthorized="close"
        @image="handleImage"
        @saved="save"
        @falled-back-to-solo-edit="inOfflineMode = true"
      />
    </div>

    <DateField v-model="form.created_at" :label="$t('common.date')" :errors="errors.created_at" />

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
