<template>
  <div class="list-container template-form">
    <div class="list-container m4">
      <TextInput
        v-model="form.name"
        data-test="name"
        required
        :label="$t('template.template')"
        :help="$t('template.tips-template')"
        :placeholder="$t('project.form.project-templates')"
        :errors="errors.name"
        :data-field-target="formFieldTargetIds.name"
      />

      <Field
        :label="$t('template.description')"
        :help="$t('template.tips-template')"
        :data-field-target="formFieldTargetIds.description"
      >
        <TipTapEditor
          v-model="form.description"
          class="w-full"
          :save-image-callback="saveImageCallback"
          mode="full"
        />
      </Field>

      <Field :label="$t('template.category')" :data-field-target="formFieldTargetIds.categories">
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

      <Field
        :label="$t('template.enable-tab.label')"
        :help="$t('template.enable-tab.help')"
        :data-field-target="formFieldTargetIds.enable_tab"
      >
        <SwitchInput v-model="form.enable_tab" />
      </Field>
    </div>

    <TemplateFormSection
      :title="$t('template.title-project')"
      :errors="haveError(errors.project_title, errors.project_purpose)"
    >
      <TextInput
        v-model="form.project_title"
        :label="$t('template.project-title')"
        :errors="errors.project_title"
        :data-field-target="formFieldTargetIds.project_title"
      />
      <TextInput
        v-model="form.project_purpose"
        :label="$t('template.project-purpose')"
        :errors="errors.project_purpose"
        :data-field-target="formFieldTargetIds.project_purpose"
      />
    </TemplateFormSection>

    <Sortable
      :list="[...(form.tabs || [])]"
      :options="DRAG_OPTIONS"
      group="category-children"
      tag="transition-group"
      :item-key="(tab) => tab.id || tab.uuid"
      @end="onDrag"
    >
      <template #item="{ element: tab, index }">
        <TemplateFormSection
          v-if="tab"
          :key="tab.id || tab.uuid"
          v-model:visibility="tab.show_tab"
          :can-delete="isCustomTab(tab.type)"
          :can-visibility="true"
          :title="tab.title"
          :errors="!!errors.tabs[0]?.$message?.[index]?.length"
          :icon="tab.icon"
          class="sortable"
          :class="{
            'visibility-hide': !tab.show_tab,
          }"
          @delete="onDeleteTab(index)"
        >
          <template #left>
            <IconImage class="icon skeletons-background sortable-icon" name="DotsGrid" />
          </template>
          <TabFormRaw
            show-type
            :model-value="form.tabs[index]"
            :errors="errors.tabs[0]?.$message?.[index]"
            :data-field-target="formFieldTargetIds.tabs[index]"
            @update:model-value="updateTab(index, $event)"
          />
          <template v-if="tabHaveTemplate(form.tabs[index].type)">
            <br />
            <h2 class="title-template">
              {{ $t('tab.form.template.title') }}
            </h2>
            <TabItemFormRaw
              :show-title="tabHaveTemplateTitle(form.tabs[index].type)"
              :model-value="{
                title: form.tabs[index].title_item,
                content: form.tabs[index].content_item,
              }"
              @update:model-value="onUpdateTemplate(index, $event)"
            />
          </template>
        </TemplateFormSection>
      </template>
    </Sortable>

    <LpiButton btn-icon="Plus" class="my4 tab-add" :label="$t('tab.tab.add')" @click="addNewTab" />

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
import { Sortable } from 'sortablejs-vue3'

import {
  getTab,
  isCustomTab,
  sanitizeTabsTemplate,
  tabHaveTemplate,
  tabHaveTemplateTitle,
} from '~/functs/tabs'
import type {
  ProjectTabItemForm,
  TemplateForm,
  TemplateTabForm,
} from 'shared-projects-frontend/models'
import { defaultTemplateForm, defaultTemplateTabForm, useTemplateForm } from '~/form/template'
import TemplateFormSection from '~/components/templates/TemplateFormSection.vue'
import TabItemFormRaw from '~/components/tabs/TabItemFormRaw.vue'
import SwitchInput from '~/components/base/form/SwitchInput.vue'
import type { PropsDefinitions } from '~/composables/tiptap'
import TabFormRaw from '~/components/tabs/TabFormRaw.vue'
import { isEqual, isNil, omit, sortBy } from 'es-toolkit'
import Field from '~/components/base/form/Field.vue'
import type { ErrorObject } from '@vuelidate/core'
import { deepToRaw } from '~/functs/utils'

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

// sortable
const DRAG_OPTIONS = {
  animation: 200,
  disabled: false,
  ghostClass: 'child-ghost',
}

const { stateModals, openModals, closeModals } = useModals({ category: false })

// form utils
const localeDefaultForm = () => {
  const localForm = {
    ...defaultTemplateForm(),
    ...(props.template || {}),
    tabs: [...(props?.template?.tabs || [])],
  }

  localForm.tabs = sortBy(
    sanitizeTabsTemplate(localForm.tabs).map((tab) => (isNil(tab.id) ? omit(tab, ['id']) : tab)),
    ['order']
  )

  const blogsTemplate = getTab(localForm.tabs, 'blogs')
  blogsTemplate.title_item = localForm.blogentry_title
  blogsTemplate.content_item = localForm.blogentry_content

  const commentTemplate = getTab(localForm.tabs, 'comments')
  commentTemplate.content_item = localForm.comment_content

  const goalsTemplate = getTab(localForm.tabs, 'goals')
  goalsTemplate.content_item = localForm.goal_description
  goalsTemplate.title_item = localForm.goal_title

  const descriptionTemplate = getTab(localForm.tabs, 'description')
  descriptionTemplate.content_item = localForm.project_description

  return structuredClone(deepToRaw(localForm))
}
const model = defineModel<TemplateForm>()
const { form, errors, isValid, validate, cleanedData, reset, formFieldTargetIds } = useTemplateForm(
  { $scope: true }
)

const isFormEqual = useBlockNavigation(() => isEqual(form.value, localeDefaultForm()))

watch(
  () => props.template,
  () => reset(localeDefaultForm()),
  { deep: true, immediate: true }
)
watchEffect(() => emit('isValid', isValid.value))
watchEffect(() => (model.value = cleanedData.value))
watchEffect(() => emit('isFormEqual', isFormEqual.value))
defineExpose({
  validate,
})

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

const updateTab = (idx: number, tab: TemplateTabForm) => {
  const orginalTab = form.value.tabs[idx]

  if (tab) {
    form.value.tabs[idx] = {
      uuid: orginalTab.uuid,
      ...tab,
    }
  }
}

const onUpdateTemplate = <Item extends ProjectTabItemForm>(idx: number, item: Item | null) => {
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

const onDrag = (ev) => {
  const { oldIndex, newIndex } = ev

  // // move old index element to new positions
  const localForm: TemplateForm = deepToRaw(form.value)
  const tabs = localForm.tabs
  const [element] = tabs.splice(oldIndex, 1)
  tabs.splice(newIndex, 0, element)

  tabs.forEach((tab, idx) => (tab.order = idx))

  reset(localForm)
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.template-form {
  gap: 1.5rem;
}

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: variables.$space-s;
}

.title-template {
  font-size: 2rem;
}

.tab-add {
  width: fit-content;
}

.sortable {
  margin: 1rem 0;

  &.visibility-hide {
    opacity: 0.7;
  }

  .sortable-icon {
    cursor: grab !important;
  }
}
</style>
