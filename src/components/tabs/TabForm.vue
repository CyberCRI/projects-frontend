<script setup lang="ts">
import { defualtProjectTabForm, useProjectTabForm } from '~/form/project-tabs'
import type { GroupOption } from '~/components/base/button/GroupButton.vue'
import GroupButton from '~/components/base/button/GroupButton.vue'
import type { ProjectTabForm } from '~/models/projects-tabs.model'
import { createProjectTabImage } from '~/api/project-tabs.service'
import IconDrawer from '~/components/drawer/Icon/IconDrawer.vue'
import type { TranslatedProject } from '~/models/project.model'
import IconImage from '~/components/base/media/IconImage.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import HelpField from '~/components/base/form/HelpField.vue'
import type { IconTabImageChoice } from '~/functs/IconImage'
import FormPanel from '~/components/base/FormPanel.vue'
import { DEFAULT_ICONS_TABS } from '~/functs/constants'
import type { ImageModel } from '~/models/image.model'
import { getFirstTextNotEmpty } from '~/functs/string'
import type { ProjectTabType } from '~/models/types'
import { ICONS_TABS } from '~/functs/IconImage'
import { isEqual } from 'es-toolkit'
import analytics from '~/analytics'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    tab?: ProjectTabForm
    asyncing?: boolean
  }>(),
  {
    asyncing: false,
    tab: null,
  }
)

const emit = defineEmits<{
  submit: [ProjectTabForm]
}>()

const { stateModals, closeModals, toggleModals } = useModals({
  editIcon: false,
})

const defaultLocalForm = () => {
  const newForm = defualtProjectTabForm()

  const tab = props.tab
  if (tab) {
    newForm.id = tab.id
    newForm.title = tab.title || newForm.title
    newForm.description = getFirstTextNotEmpty([tab.description]) || newForm.description
    newForm.icon = tab.icon || newForm.icon
    newForm.type = tab.type || newForm.type
  }

  return newForm
}

const { form, isValid, errors, cleanedData, reset } = useProjectTabForm({ lazy: true })

const optionsType = computed<GroupOption[]>(() => [
  {
    label: $t('tab.form.type.text.label'),
    value: 'text' satisfies ProjectTabType,
    title: $t('tab.form.type.text.help'),
  },
  {
    label: $t('tab.form.type.blog.label'),
    value: 'blog' satisfies ProjectTabType,
    title: $t('tab.form.type.blog.help'),
  },
])

const selectedTypeDescription = computed(
  () => optionsType.value.find((option) => option.value === form.value.type).title
)

const isFormEqual = useBlockNavigation(() => isEqual(form.value, defaultLocalForm()))
watch(
  () => [props.project, props.tab],
  () => reset(defaultLocalForm()),
  { immediate: true, deep: true }
)

// if type is changed , change defualt icons
watch(
  () => form.value.type,
  () => {
    form.value.icon = DEFAULT_ICONS_TABS[form.value.type]
  },
  { immediate: true }
)

const onConfirm = () => emit('submit', cleanedData.value)

const onSaveImage = (image: File) => {
  const body = new FormData()
  body.append('file', image, image.name)

  return createProjectTabImage(props.project.id, body, {
    query: {
      tab_id: props.tab?.id,
    },
  }).then((image) => {
    analytics.track('create_project_tab_image', {
      project: props.project.id,
      tab: props.tab?.id,
      image: image.id,
    })
    return image
  })
}

const addImage = (image: ImageModel) => {
  form.value.images_ids.push(image.id)
}
</script>

<template>
  <FormPanel
    :asyncing="asyncing"
    :confirm-action-disabled="!isValid || isFormEqual"
    :confirm-action-name="$t('common.save')"
    :show-cancel="false"
    @confirm="onConfirm"
  >
    <div class="list-container">
      <!-- hide choices type if already created (you can't change type after create it) -->
      <Field v-if="!form.id" :label="$t('tab.form.type.label')" required>
        <GroupButton v-model="form.type" :options="optionsType" />
        <HelpField :description="selectedTypeDescription" />
      </Field>

      <TextInput
        v-model="form.title"
        :label="$t('tab.form.title.label')"
        required
        :errors="errors.title"
      />

      <Field :label="$t('tab.form.description.label')">
        <!-- <TipTapEditor -->
        <TipTapEditor
          ref="tiptapEditor"
          v-model="form.description"
          class="input-field content-editor w-full"
          mode="full"
          :save-image-callback="onSaveImage"
          :errors="errors.description"
          @image="addImage"
        />
      </Field>

      <Field :label="$t('tab.form.icon.label')" required>
        <!-- <TipTapEditor -->
        <IconImage
          class="tab-icon shadow-drop"
          :name="form.icon"
          :title="$t('icon.select')"
          @click="toggleModals('editIcon')"
        />
        <FieldErrors :errors="errors.icon" />

        <IconDrawer
          v-model="form.icon"
          :is-opened="stateModals.editIcon"
          :icons="Object.keys(ICONS_TABS) as IconTabImageChoice[]"
          @close="closeModals('editIcon')"
        />
      </Field>
    </div>
    <template #footer:extra>
      <slot name="footer" />
    </template>
  </FormPanel>
</template>

<style lang="scss" scoped>
.tab-icon {
  display: inline-block;
  width: 3rem;
  height: 3em;
  cursor: pointer;
  padding: 1rem;
  border: 1px solid var(--primary-dark);
  border-radius: 10px;
  position: relative;
}
</style>
