<script setup lang="ts">
import { defualtProjectTabForm, useProjectTabForm } from '~/form/project-tabs'
import type { ProjectTabForm } from '~/models/projects-tabs.model'
import type { TranslatedProject } from '~/models/project.model'
import IconImage from '~/components/base/media/IconImage.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import LpiSelect from '~/components/base/form/LpiSelect.vue'
import type { IconImageChoice } from '~/functs/IconImage'
import FormPanel from '~/components/base/FormPanel.vue'
import { getFirstTextNotEmpty } from '~/functs/string'
import { ICONS } from '~/functs/IconImage'
import { isEqual } from 'es-toolkit'

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
  close: []
  submit: [ProjectTabForm]
}>()

const optionIcons = computed(() => {
  return Object.keys(ICONS).map((name) => ({
    label: name,
    value: name,
  }))
})

const defaultLocalForm = () => {
  const newForm = defualtProjectTabForm()

  const tab = props.tab
  if (tab) {
    newForm.title = tab.title || newForm.title
    newForm.description = getFirstTextNotEmpty([tab.description]) || newForm.description
    newForm.icon = tab.icon || newForm.icon
  }

  return newForm
}

const { form, isValid, errors, cleanedData, reset } = useProjectTabForm({ lazy: true })

const isFormEqual = useBlockNavigation(() => isEqual(form.value, defaultLocalForm()))
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
    :show-cancel="false"
    @confirm="onConfirm"
  >
    <div class="list-container">
      <TextInput
        v-model="form.title"
        :label="$t('tab.form.title.label')"
        required
        :errors="errors.title"
      />

      <Field :label="$t('tab.form.description.label')" required>
        <!-- <TipTapEditor -->
        <TextInput
          v-model="form.description"
          class="input-field content-editor no-max-height"
          mode="simple"
          :errors="errors.description"
        />
      </Field>

      <Field :label="$t('tab.form.description.label')" required>
        <!-- <TipTapEditor -->
        <LpiSelect
          v-model="form.icon"
          class="select-icon"
          :options="optionIcons"
          max-height="200px"
        >
          <template #content="option">
            <div>
              <IconImage class="icon" :name="option.value as IconImageChoice" />
            </div>
          </template>
        </LpiSelect>
        <FieldErrors :errors="errors.icon" />
      </Field>
    </div>
    <template #footer:extra>
      <slot name="footer" />
    </template>
  </FormPanel>
</template>

<style lang="scss" module>
.select-icon {
  width: 140px !important;
}
</style>
