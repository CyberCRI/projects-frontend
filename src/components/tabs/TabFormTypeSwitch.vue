<script lang="ts" setup>
import type { GroupOption } from '~/components/base/button/GroupButton.vue'
import type { ProjectTabForm } from 'shared-projects-frontend/models'
import GroupButton from '~/components/base/button/GroupButton.vue'
import HelpField from '~/components/base/form/HelpField.vue'
import { DEFAULT_ICONS_TABS } from '~/functs/constants'

const form = defineModel<ProjectTabForm>()
defineEmits(['type-changed'])

const selectedTypeDescription = computed(
  () => optionsType.value.find((option) => option.value === form.value.type)?.title
)

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
    ] satisfies Array<Omit<GroupOption, 'value'> & { value: ProjectTabForm['type'] }>
)

watch(
  () => form.value.type,
  (neo, old) => {
    if (neo && neo !== old) {
      form.value.icon = DEFAULT_ICONS_TABS[neo]
    }
  }
)
</script>

<template>
  <Field :label="$t('tab.form.type.label')" required>
    <GroupButton v-model="form.type" :options="optionsType" />
    <HelpField :description="selectedTypeDescription" />
  </Field>
</template>
