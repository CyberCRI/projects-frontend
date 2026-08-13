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
    // if tab exist and project have template for this tab, get it and set it
    if (props.project.template) {
      const templateTab = props.project.template.tabs.find((t) => t.uuid === props.tab.uuid)
      if (templateTab) {
        newForm.title = templateTab.title || newForm.title
        newForm.description = getFirstTextNotEmpty([templateTab.description]) || newForm.description
        newForm.type = templateTab.type || newForm.type
        newForm.icon = templateTab.icon || newForm.icon
        newForm.show_preview = templateTab.show_preview || newForm.show_preview
      }
    }

    newForm.id = tab.id
    newForm.uuid = tab.uuid
    newForm.title = tab.title || newForm.title
    newForm.description = getFirstTextNotEmpty([tab.description]) || newForm.description
    newForm.type = tab.type || newForm.type
    newForm.icon = safeProjectIconTab(tab.icon, newForm.type)
    // not or || for boolean
    newForm.show_preview = tab.show_preview ?? newForm.show_preview
  }

  return newForm
}

const model = defineModel<ProjectTabForm>({ default: defaultProjectTabForm })

const { form, isValid, cleanedData, reset } = useProjectTabForm({
  model,
  default: defaultLocalForm(),
})

const isFormEqual = useBlockNavigation(() =>
  formEqual(form.value, defaultLocalForm(), {
    exclude: ['uuid'],
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
    <slot />
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
