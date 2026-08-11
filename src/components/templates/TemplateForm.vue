<template>
  <div class="">
    <div class="list-container m4">
      <TextInput
        v-model="form.name"
        data-test="name"
        required
        :label="$t('template.template')"
        :help="$t('template.tips-template')"
        :placeholder="$t('project.form.project-templates')"
        :erorrs="errors.name"
      />

      <Field :label="$t('template.description')" :help="$t('template.tips-template')">
        <TipTapEditor
          v-model="form.description"
          class="w-full"
          :save-image-callback="saveImageCallback"
          mode="full"
        />
      </Field>

      <Field :label="$t('template.category')">
        <template #in-label>
          <LpiButton :label="$t('category.edit')" @click="openModals('category')" />
        </template>
        <div v-if="form.categories.length" class="tag-grid">
          <FilterValue
            v-for="category in form.categories"
            :key="category.id"
            :label="category.name"
          />
        </div>
        <span v-else class="description">
          {{ $t('template.no-category-set') }}
        </span>
      </Field>
    </div>

    <TemplateFormSection
      :title="$t('template.title-project')"
      :errors="haveError(errors.project_title, errors.project_purpose, errors.project_description)"
    >
      <TextInput
        v-model="form.project_title"
        :label="$t('template.project-title')"
        :errors="errors.project_title"
      />
      <TextInput
        v-model="form.project_purpose"
        :label="$t('template.project-purpose')"
        :errors="errors.project_purpose"
      />

      <Field :label="$t('template.project-description')">
        <TipTapEditor
          v-model="form.project_description"
          :save-image-callback="saveImageCallback"
          mode="full"
          class="w-full"
          :errors="errors.project_description"
        />
      </Field>
    </TemplateFormSection>

    <TemplateFormSection
      :title="$t('template.title-blog')"
      :errors="haveError(errors.blogentry_title, errors.blogentry_content)"
    >
      <TextInput v-model="form.blogentry_title" :label="$t('template.blog-title')" />

      <Field :label="$t('template.blog-content')">
        <TipTapEditor
          v-model="form.blogentry_content"
          :save-image-callback="saveImageCallback"
          mode="full"
          class="w-full"
          :errors="errors.blogentry_content"
        />
      </Field>
    </TemplateFormSection>

    <TemplateFormSection
      :title="$t('template.title-goal')"
      :errors="haveError(errors.goal_title, errors.goal_description)"
    >
      <TextInput
        v-model="form.goal_title"
        :label="$t('template.advancement-goal-title')"
        :errors="errors.goal_title"
      />

      <Field :label="$t('template.advancement-goal-content')">
        <TipTapEditor
          v-model="form.goal_description"
          :save-image-callback="saveImageCallback"
          data-test="template-advancement-goal-content-editor"
          class="w-full"
          mode="full"
          :errors="errors.goal_description"
        />
      </Field>
    </TemplateFormSection>

    <TemplateFormSection
      :title="$t('template.title-comment')"
      :errors="haveError(errors.comment_content)"
    >
      <Field :label="$t('template.comment')">
        <TipTapEditor
          v-model="form.comment_content"
          :save-image-callback="saveImageCallback"
          class="comment-description w-full"
          mode="full"
          data-test="template-comment-editor"
          :errors="errors.comment_content"
        />
      </Field>
    </TemplateFormSection>

    <template v-for="(tab, idx) in form.tabs || []">
      <TemplateFormSection
        v-if="tab"
        :key="tab.id || tab.uuid"
        can-delete
        :opened="!tab.id"
        :title="tab.title"
        @delete="onDeleteTab(idx)"
      >
        <TabFormRaw :model-value="form.tabs[idx]" @update:model-value="updateTab(idx, $event)" />
        <br />
        <h2 class="title-template">
          {{ $t('tab.form.template.title') }}
        </h2>
        <TabItemFormRaw
          :model-value="{
            title: form.tabs[idx].title_item,
            content: form.tabs[idx].content_item,
          }"
          @update:model-value="onUpdateTemplate(idx, $event)"
        />
      </TemplateFormSection>
    </template>

    <LpiButton btn-icon="Plus" :label="$t('tab.tab.add')" @click="addNewTab" />

    <!-- drawer / modal -->
    <BaseDrawer
      :confirm-action-name="$t('common.confirm')"
      :is-opened="stateModals.category"
      :title="$t('template.edit-category')"
      class="small"
      @close="closeModals('category')"
      @confirm="confirmCategory"
    >
      <CategoriesFilterEditor v-model="tmpCategories" />
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import type {
  ProjectTabForm,
  ProjectTabItemForm,
  TemplateForm,
} from 'shared-projects-frontend/models'
import { defaultTemplateForm, defaultTemplateTabForm, useTemplateForm } from '~/form/template'
import TemplateFormSection from '~/components/templates/TemplateFormSection.vue'
import TabItemFormRaw from '~/components/tabs/TabItemFormRaw.vue'
import type { PropsDefinitions } from '~/composables/tiptap'
import TabFormRaw from '~/components/tabs/TabFormRaw.vue'
import type { ErrorObject } from '@vuelidate/core'
import { isEqual } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    template?: TemplateForm
    saveImageCallback: PropsDefinitions['saveImageCallback']
  }>(),
  {
    template: null,
  }
)

const emit = defineEmits<{
  isValid: [boolean]
  isFormEqual: [boolean]
}>()

const { stateModals, openModals, closeModals } = useModals({ category: false })

// form utils
const localeDefaultForm = () => {
  return {
    ...defaultTemplateForm(),
    ...(props.template || {}),
    tabs: [...(props?.template?.tabs || [])],
  }
}
const model = defineModel<TemplateForm>()
const { form, errors, isValid, cleanedData, reset } = useTemplateForm({ $scope: true })

const isFormEqual = useBlockNavigation(() => isEqual(form.value, localeDefaultForm()))

watchEffect(() => {
  console.log(isFormEqual.value, form.value.tabs, localeDefaultForm().tabs)
})

watch(
  () => props.template,
  () => reset(localeDefaultForm()),
  { deep: true, immediate: true }
)
watchEffect(() => emit('isValid', isValid.value))
watchEffect(() => (model.value = cleanedData.value))
watchEffect(() => emit('isFormEqual', isFormEqual.value))

// temp categories select in drawer
const tmpCategories = ref([])
watch(
  () => stateModals.value.category,
  () => (tmpCategories.value = [...form.value.categories])
)
const confirmCategory = () => {
  form.value.categories = [...tmpCategories.value]
  closeModals('category')
}

const haveError = (...errors: ErrorObject[][]): boolean => {
  return errors.filter((err) => err.length !== 0).length !== 0
}

const addNewTab = () => {
  const tab = defaultTemplateTabForm()
  form.value.tabs.push(tab)
}

const updateTab = (idx: number, tab: ProjectTabForm) => {
  const orginalTab = form.value.tabs[idx]

  console.log('update tab', tab)

  if (tab) {
    form.value.tabs[idx] = {
      uuid: orginalTab.uuid,
      ...tab,
    }
  }
}

const onUpdateTemplate = (idx: number, item: ProjectTabItemForm | null) => {
  if (item) {
    form.value.tabs[idx] = {
      ...form.value.tabs[idx],
      title_item: item.title,
      content_item: item.content,
    }
  }
}

const onDeleteTab = (idx: number) => {
  const tabs = [...form.value.tabs]
  tabs.splice(idx, 1)
  form.value.tabs = tabs
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: variables.$space-s;
}

.title-template {
  font-size: 2rem;
}
</style>
