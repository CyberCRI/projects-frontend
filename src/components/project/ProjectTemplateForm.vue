<script setup lang="ts">
import type { TranslatedProjectCategory } from '~/models/project-category.model'
import type { TemplateModel } from '~/models/template.model'
import type { ProjectForm } from '~/models/project.model'
import { useProjectTemplatesForm } from '~/form/project'
import { getTemplate } from '~/api/templates.service'
import Field from '~/components/base/form/Field.vue'
import useToasterStore from '~/stores/useToaster'
import { useOrganizationCode } from '#imports'

const { t } = useNuxtI18n()
const organizationCode = useOrganizationCode()

const projectCategoriesStore = useProjectCategories()
onMounted(async () => {
  await projectCategoriesStore.getAllProjectCategories()
})

const model = defineModel<Pick<ProjectForm, 'categories' | 'template'>>()

const { form } = useProjectTemplatesForm({ model })
const { translateTemplate } = useAutoTranslate()

const toaster = useToasterStore()
const categoryDropdownRef = useTemplateRef('categoryDropdown')

// change form categories with store categories + templaes
watchEffect(() => {
  if (form.value.categorie) {
    form.value.categorie = projectCategoriesStore.all.find((el) => {
      return form.value.categorie.id == el.id
    })
  }
})

const haveMultipleTemplates = computed(() => form.value.categorie?.templates?.length > 1)

const onSelectTemplate = (template: TemplateModel) => {
  return getTemplate(organizationCode, template.id)
    .then((template) => (form.value.template = unref(translateTemplate(template))))
    .catch(() => toaster.pushError(t('template-get.error')))
}

const onChangeCategories = async (categorie: TranslatedProjectCategory) => {
  categoryDropdownRef.value.close()
  form.value.categorie = categorie
  if (categorie.templates.length === 1) {
    await onSelectTemplate(categorie.templates[0])
  } else {
    form.value.template = null
  }
}
</script>

<template>
  <Field :label="$t('project.form.project-category')">
    <ProjectCategoriesDropdown
      ref="categoryDropdown"
      class="w-full"
      data-test="select-project-category"
      :dropdown-label="form.categorie?.name || $t('project.form.select-category')"
    >
      <template #default="{ category }">
        <ProjectCategoriesDropdownElementButton
          :category="category"
          @choose-category="onChangeCategories(category)"
        />
      </template>
    </ProjectCategoriesDropdown>
  </Field>

  <Field v-if="haveMultipleTemplates" :label="$t('project.form.project-templates')">
    <LpiDropDown
      v-model="form.template"
      class="w-full"
      :options="form.categorie.templates"
      data-test="select-project-template"
      :default-label="$t('project.form.project-templates')"
    >
      <template #default="{ option, selected }">
        <LpiDropDownElementButton
          :option="option"
          :selected="selected"
          @click="onSelectTemplate(option)"
        />
      </template>
    </LpiDropDown>
  </Field>
</template>
