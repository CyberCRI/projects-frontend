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

import type { PropsDefinitions } from '~/components/base/form/TextEditor/useTipTap'
import TemplateFormSection from '~/components/templates/TemplateFormSection.vue'
import { defaultTemplateForm, useTemplateForm } from '~/form/template'
import type { TemplateForm } from '~/models/template.model'
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
  }
}
const model = defineModel<TemplateForm>()
const { form, errors, isValid, cleanedData, reset } = useTemplateForm()
const isFormEqual = useBlockNavigation(() => isEqual(form.value, localeDefaultForm()))
watch(
  () => props.template,
  () => {
    console.log('watch templates', props.template)
    reset(localeDefaultForm())
  },
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
</script>

<style lang="scss" scoped>
.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: $space-s;
}
</style>
