<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="!isValid"
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
        @unauthorized="clear"
        @image="handleImage"
        @saved="save"
        @falled-back-to-solo-edit="inOfflineMode = true"
      />

      <FieldErrors :errors="errors.content" />
    </div>

    <DateField v-model="form.created_at" :label="$t('common.date')" />
  </BaseDrawer>

  <ConfirmModal
    v-if="stateModals.saveChange"
    content=""
    :title="$t('description.quit-without-saving-title')"
    @cancel="closeModals('saveChange')"
    @confirm="clear"
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
</template>

<script setup lang="ts">
import { patchBlogEntry, postBlogEntry, postBlogEntryImage } from '~/api/blogentries.service'

import TipTapCollaborativeEditor from '~/components/base/form/TextEditor/TipTapCollaborativeEditor.vue'
import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import FieldErrors from '~/components/base/form/FieldErrors.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import DateField from '~/components/base/form/DateField.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'

import type { BlogEntryForm, BlogEntryModel } from '~/models/blog-entry.model'
import type { TranslatedProject } from '~/models/project.model'
import { defaultForm, useBlogEntryForm } from '~/form/blog'
import type { ImageModel } from '~/models/image.model'
import { textIsEmpty } from '~/functs/string'
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

const defaultBlogForm = () => {
  const baseForm = defaultForm()
  const newForm = {
    ...baseForm,
  }
  const blog = props.blog
  if (blog) {
    newForm.id = blog.id
    newForm.title = blog.title
    newForm.content = blog.content
    newForm.created_at = blog.created_at
    newForm.images_ids = [...blog.images]
  }

  // add projectId in form
  newForm.project_id = props.project.id

  // set default content from template
  const template = props.project.template
  if (template) {
    if (textIsEmpty(newForm.title)) {
      newForm.title = template.blogentry_title
    }
    if (textIsEmpty(newForm.content)) {
      newForm.content = template.blogentry_content
    }
  }

  newForm.title ??= baseForm.title
  newForm.content ??= baseForm.content
  return newForm
}

const { t } = useNuxtI18n()
const { stateModals, closeModals, openModals } = useModals({ saveChange: false, saveSolo: false })

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const { form, isValid, errors, cleanedData, v$ } = useBlogEntryForm({ lazy: true })
const asyncing = ref(false)

const providerParams = computed(() => ({
  blogId: props.blog?.id ?? null,
  projectId: props.project.id,
  organizationId: organizationsStore.current.id,
}))

const inOfflineMode = ref(false)

const isCreated = computed(() => isNil(props.blog?.id) || inOfflineMode.value)

watch(
  () => [props.blog, props.isOpened],
  () => {
    form.value = defaultBlogForm()
    v$.value.$reset()
  },
  { immediate: true }
)

const room = computed(() => (props.blog?.id ? `blog_${props.blog.id}` : null))

const clear = () => {
  asyncing.value = false
  closeModals('saveChange')
  emit('close')
}

const checkClose = () => {
  // if form is not changed , ignore and close
  if (isEqual(form.value, defaultBlogForm())) {
    clear()
    // else open modal
  } else {
    openModals('saveChange')
  }
}

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
      clear()
    })
    .catch(() => toaster.pushError(t('toasts.blog-create.error')))
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
      clear()
    })
    .catch(() => toaster.pushError(t('toasts.blog-update.error')))
}

const save = () => {
  if (!isValid.value) {
    return
  }

  asyncing.value = true
  const body = cleanedData.value

  if (props.blog?.id) {
    patchBlog(body).finally(() => (asyncing.value = false))
  } else {
    postBlog(body).finally(() => (asyncing.value = false))
  }
}
</script>

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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
