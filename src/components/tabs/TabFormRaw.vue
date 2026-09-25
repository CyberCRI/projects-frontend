<script setup lang="ts">
import { defaultProjectTabForm, useProjectTabForm } from '~/form/project-tabs'
import type { ProjectTabForm } from 'shared-projects-frontend/models'
import IconDrawer from '~/components/drawer/Icon/IconDrawer.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import type { IconTabImageChoice } from '~/functs/IconImage'
import type { UseFormResult } from '~/composables/useForm'
import { safeProjectIconTab } from '~/functs/projects'
import { ICONS_TABS } from '~/functs/IconImage'

const model = defineModel<ProjectTabForm>({ default: defaultProjectTabForm })

type TabFormFiledTargets = UseFormResult<
  ProjectTabForm,
  ProjectTabForm
>['formFieldTargetIds']['value']
type TabFormError = UseFormResult<ProjectTabForm, ProjectTabForm>['errors']['value']

withDefaults(
  defineProps<{
    formFieldTargetIds?: TabFormFiledTargets
    errors?: TabFormError
  }>(),
  { formFieldTargetIds: () => ({}) as TabFormFiledTargets, errors: () => ({}) as TabFormError }
)

const { stateModals, closeModals, toggleModals } = useModals({
  editIcon: false,
})

const { form } = useProjectTabForm({ model })

onBeforeMount(() => {
  form.value.icon = safeProjectIconTab(form.value.icon, form.value.type)
})

const icons = Object.keys(ICONS_TABS).toSorted((a, b) =>
  a.toLowerCase().localeCompare(b)
) as IconTabImageChoice[]
</script>

<template>
  <div class="list-container">
    <div class="inline-field">
      <Field
        :label="$t('tab.form.icon.label')"
        required
        :data-field-target="formFieldTargetIds?.icon"
      >
        <!-- <TipTapEditor -->
        <IconImage
          class="tab-icon shadow-drop"
          :name="safeProjectIconTab(form.icon, form.type)"
          :title="$t('common.select')"
          :data-field-target="formFieldTargetIds.icon"
          @click="toggleModals('editIcon')"
        />
        <FieldErrors :errors="errors?.icon" />

        <IconDrawer
          v-model="form.icon"
          :is-opened="stateModals.editIcon"
          :icons="icons"
          @close="closeModals('editIcon')"
        />
      </Field>
      <TextInput
        v-model="form.title"
        class="inline-title"
        :label="$t('tab.form.title.label')"
        required
        :errors="errors.title"
        :data-field-target="formFieldTargetIds.title"
      />
    </div>

    <Field
      :label="$t('tab.form.show_preview.label')"
      :errors="errors?.show_preview"
      :data-field-target="formFieldTargetIds?.show_preview"
    >
      <SwitchInput v-model="form.show_preview" />
    </Field>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.tab-icon {
  display: inline-block;
  width: 2rem;
  height: 2em;
  cursor: pointer;
  padding: 0.25rem;
  border: 1px solid var(--primary-dark);
  border-radius: 10px;
  position: relative;
}

.inline-title {
  justify-content: space-between;
}

.inline-field {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
}
</style>
