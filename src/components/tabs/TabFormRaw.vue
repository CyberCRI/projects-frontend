<script setup lang="ts">
import type { ProjectTabForm, ProjectTabType } from 'shared-projects-frontend/models'
import { defaultProjectTabForm, useProjectTabForm } from '~/form/project-tabs'
import type { GroupOption } from '~/components/base/button/GroupButton.vue'
import GroupButton from '~/components/base/button/GroupButton.vue'
import IconDrawer from '~/components/drawer/Icon/IconDrawer.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import HelpField from '~/components/base/form/HelpField.vue'
import type { IconTabImageChoice } from '~/functs/IconImage'
import { DEFAULT_ICONS_TABS } from '~/functs/constants'
import { ICONS_TABS } from '~/functs/IconImage'

const model = defineModel<ProjectTabForm>({ default: defaultProjectTabForm })

const { stateModals, closeModals, toggleModals } = useModals({
  editIcon: false,
})

const { form, errors } = useProjectTabForm({ model })

const optionsType = computed<GroupOption[]>(
  () =>
    [
      {
        label: $t('tab.form.type.text.label'),
        value: 'text',
        title: $t('tab.form.type.text.help'),
      },
      {
        label: $t('tab.form.type.blog.label'),
        value: 'blog',
        title: $t('tab.form.type.blog.help'),
      },
    ] satisfies Array<Omit<GroupOption, 'value'> & { value: ProjectTabType }>
)

const selectedTypeDescription = computed(
  () => optionsType.value.find((option) => option.value === form.value.type)?.title
)

// reset icons is we change tab type
const onChangeType = (type: ProjectTabForm['type']) => {
  form.value.icon = DEFAULT_ICONS_TABS[type]
}

const icons = Object.keys(ICONS_TABS).toSorted((a, b) =>
  a.toLowerCase().localeCompare(b)
) as IconTabImageChoice[]
</script>

<template>
  <div class="list-container">
    <!-- hide choices type if already created (you can't change type after create it) -->
    <Field v-if="!form.id" :label="$t('tab.form.type.label')" required>
      <GroupButton v-model="form.type" :options="optionsType" @update:model-value="onChangeType" />
      <HelpField :description="selectedTypeDescription" />
    </Field>

    <div class="inline-field">
      <TextInput
        v-model="form.title"
        class="inline-title"
        :label="$t('tab.form.title.label')"
        required
        :errors="errors.title"
      />
      <Field :label="$t('tab.form.icon.label')" required>
        <!-- <TipTapEditor -->
        <IconImage
          class="tab-icon shadow-drop"
          :name="form.icon"
          :title="$t('common.select')"
          @click="toggleModals('editIcon')"
        />
        <FieldErrors :errors="errors.icon" />

        <IconDrawer
          v-model="form.icon"
          :is-opened="stateModals.editIcon"
          :icons="icons"
          @close="closeModals('editIcon')"
        />
      </Field>
    </div>

    <Field :label="$t('tab.form.show_preview.label')" :errors="errors.show_preview">
      <SwitchInput v-model="form.show_preview" />
    </Field>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.tab-icon {
  display: inline-block;
  width: 3rem;
  height: 3em;
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
  grid-template-columns: 1fr auto;
  gap: 0.25rem;
}
</style>
