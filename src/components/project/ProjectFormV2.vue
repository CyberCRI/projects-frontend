<script setup lang="ts">
import type { ProjectForm, TranslatedProject } from '~/models/project.model'
import { defaultProjectForm, useProjectForm } from '~/form/project'
import { pictureApiToImageSizes } from '~/functs/imageSizesUtils'
import LpiButton from '~/components/base/button/LpiButton.vue'
import useOrganizationsStore from '~/stores/useOrganizations'
import TagsDrawer from '~/components/tags/TagsDrawer.vue'
import { getFirstTextNotEmpty } from '~/functs/string'
import Field from '~/components/base/form/Field.vue'
import { isEqual, isNil } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    project?: Partial<TranslatedProject>
    loading?: boolean
  }>(),
  {
    project: null,
    loading: false,
  }
)

const emit = defineEmits<{
  close: []
  submit: [ProjectForm]
}>()

const organizationCode = useOrganizationCode()
const { stateModals, closeModals, openModals } = useModals({ tags: false, saveChange: false })

const organizationsStore = useOrganizationsStore()

// const toaster = useToasterStore()
const { t, locale } = useNuxtI18n()

const defaultLocalForm = () => {
  const newForm = defaultProjectForm()

  const project = props.project

  if (project) {
    newForm.title =
      getFirstTextNotEmpty([
        project.$t?.title,
        project.title,
        project.template?.$t.project_title,
      ]) || newForm.title
    newForm.purpose =
      getFirstTextNotEmpty([
        project.$t?.purpose,
        project.purpose,
        project.template?.$t.project_purpose,
      ]) || newForm.purpose
    newForm.imageSizes = pictureApiToImageSizes(project.header_image) || newForm.imageSizes
    newForm.file = project.header_image || newForm.file
    newForm.language = project.language || locale.value || newForm.language
    newForm.template = project.template || newForm.template

    newForm.categories = [...(project.categories || []), newForm.categories]
      .filter((v) => !isNil(v))
      .find((cat) => cat.organization === organizationCode)

    newForm.tags = [...(project.tags || project.template?.project_tags || newForm.tags)]
  }

  return newForm
}

const { form, errors, isValid, cleanedData, reset } = useProjectForm({ lazy: true })
watch(
  () => props.project,
  () => reset(defaultLocalForm()),
  { immediate: true }
)

const languageOptions = computed(() => {
  return organizationsStore.languages.map((language) => {
    return {
      value: language,
      label: t(`language.label-${language}`),
      dataTest: `project-form-${language}`,
    }
  })
})

const isFormEqual = computed(() => isEqual(form.value, defaultLocalForm()))
// onBeforeRouteLeave((to, from, next) => {
//   console.log(to, from, next)
// })

const onClose = () => {
  if (isFormEqual.value) {
    emit('close')
  } else {
    openModals('saveChange')
  }
}

const onSubmit = () => emit('submit', cleanedData.value)
</script>

<template>
  <FormPanel
    :confirm-action-disabled="!isValid || isFormEqual"
    :asyncing="loading"
    @close="onClose"
    @confirm="onSubmit"
  >
    <div class="list-container">
      <TextInput
        v-model="form.title"
        :label="$t('project.form.title-label')"
        required
        :placeholder="$t('project.form.title-placeholder')"
        space-below-label="large-space"
        data-test="title-input"
        :errors="errors.title"
      />
      <TextInput
        v-model="form.purpose"
        :label="$t('project.form.purpose-label')"
        :placeholder="$t('project.form.project-purpose')"
        required
        data-test="purpose-input"
        space-below-label="large-space"
        :errors="errors.purpose"
      />

      <Field :errors="errors.tags" :label="$t('tag.title')">
        <template #in-label>
          <LpiButton
            btn-icon="Plus"
            :label="$t('project.form.add-tags')"
            @click="openModals('tags')"
          />
        </template>
        <TagsFilterSummary v-model="form.tags" />
      </Field>

      <Field :label="$t('project.image-header')">
        <ImageEditor
          v-model:image-sizes="form.imageSizes"
          v-model:picture="form.file"
          :contain="true"
          :max-size-mb="Infinity"
          :default-picture="DEFAULT_PROJECT_PATATOID"
        />
      </Field>

      <Field v-if="!organizationsStore.isAutoTranslate" :label="$t('project.language')">
        <LpiSelect
          v-model="form.language"
          :value="form.language"
          :options="languageOptions"
          class="category-select"
          data-test="select-language"
        />
      </Field>
    </div>
  </FormPanel>

  <!-- drawer -->
  <TagsDrawer v-model="form.tags" :is-opened="stateModals.tags" @close="closeModals('tags')" />

  <ConfirmModal
    v-if="stateModals.saveChange"
    :title="$t('form.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="closeModals('saveChange')"
    @confirm="emit('close')"
  />
</template>
