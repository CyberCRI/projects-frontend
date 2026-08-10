<script setup lang="ts">
import type { TranslatedProject, ProjectTabForm } from 'shared-projects-frontend/models'
import { defaultProjectTabForm, useProjectTabForm } from '~/form/project-tabs'
import TabFormRaw from '~/components/tabs/TabFormRaw.vue'
import FormPanel from '~/components/base/FormPanel.vue'
import { safeProjectIconTab } from '~/functs/projects'
import { getFirstTextNotEmpty } from '~/functs/tiptap'
import { formEqual } from '~/form/base'

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

const defaultLocalForm = () => {
  const newForm = defaultProjectTabForm()

  const tab = props.tab
  if (tab) {
    newForm.id = tab.id
    newForm.title = tab.title || newForm.title
    newForm.description = getFirstTextNotEmpty([tab.description]) || newForm.description
    newForm.type = tab.type || newForm.type
    newForm.icon = safeProjectIconTab(tab.icon, newForm.type)
    // not or || for boolean
    newForm.show_preview = tab.show_preview ?? newForm.show_preview
  }

  return newForm
}

const { form, isValid, cleanedData, reset } = useProjectTabForm({
  default: defaultLocalForm(),
})

const isFormEqual = useBlockNavigation(() =>
  formEqual(form.value, defaultLocalForm(), {
    html: ['description'],
  })
)
watch(
  () => [props.project, props.tab],
  () => reset(defaultLocalForm()),
  { immediate: true, deep: true }
)

const onConfirm = () => emit('submit', cleanedData.value)
</script>

<template>
  <FormPanel
    :asyncing="asyncing"
    :confirm-action-disabled="!isValid || isFormEqual"
    :confirm-action-name="$t('common.save')"
    :show-cancel="false"
    @confirm="onConfirm"
  >
    <TabFormRaw v-model="form" />
    <template #footer:extra>
      <slot name="footer" />
    </template>
  </FormPanel>
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
