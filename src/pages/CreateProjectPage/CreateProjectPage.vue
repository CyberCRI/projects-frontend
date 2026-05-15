<script setup lang="ts">
import type { TranslatedProjectCategory } from '~/models/project-category.model'
import { postProject, postProjectHeader } from '~/api/projects.service'
import ProjectFormV2 from '~/components/project/ProjectFormV2.vue'
import { imageSizesFormData } from '~/functs/imageSizesUtils'
import type { TemplateModel } from '~/models/template.model'
import type { ProjectForm } from '~/models/project.model'
import { useProjectTemplatesForm } from '~/form/project'
import BasePage from '~/components/pages/BasePage.vue'
import { getTemplate } from '~/api/templates.service'
import Field from '~/components/base/form/Field.vue'
import useToasterStore from '~/stores/useToaster'
import { useOrganizationCode } from '#imports'
import useUsersStore from '~/stores/useUsers'
import analytics from '~/analytics'

const { t, locale } = useNuxtI18n()
const router = useRouter()
const loading = ref(false)
const organizationCode = useOrganizationCode()
const usersStore = useUsersStore()
const { onboardingTrap } = useOnboardingStatus()

const projectCategoriesStore = useProjectCategories()
onMounted(async () => {
  await projectCategoriesStore.getAllProjectCategories()
})

const { form, isValid } = useProjectTemplatesForm()
const { translateTemplate } = useAutoTranslate()

const toaster = useToasterStore()
const categoryDropdownRef = useTemplateRef('categoryDropdown')

const onSubmit = (form: ProjectForm) => {
  loading.value = true

  // add organizationsCode in form
  form.organizations_codes = [organizationCode]

  postProject(form)
    .then(async (project) => {
      // post image
      if (form.file) {
        const file = form.file as File
        const formData = new FormData()
        formData.append('file', file, file.name)
        imageSizesFormData(formData, form.imageSizes)
        await postProjectHeader(project.id, formData).catch(() =>
          toaster.pushError(t('toasts.project-header-create.error'))
        )
      }
      // fetch updated project list from user so permissions as set correctly
      await usersStore.refreshUser()

      analytics.project.create({ id: project.id, title: project.title })

      await onboardingTrap('create_project', false)

      router.push({
        name: 'ProjectSnapshot',
        params: { slugOrId: project.slug || project.id },
      })
      toaster.pushSuccess(t('toasts.project-create.success'))
    })
    .catch((err) => {
      toaster.pushError(t('toasts.project-create.error'))
      console.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}

const haveMultipleCategories = computed(() => {
  return form.value.categorie?.templates.length > 1
})

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

// create default "project" with template selected (or null if categories are not template)
const project = computed(() => ({
  language: locale.value,
  template: form.value.template,
  tags: form.value.categorie.tags,
  categories: [form.value.categorie],
}))
</script>

<template>
  <BasePage :title="$t('project.create.title')" :notice="$t('project.create.notice')">
    <template #notice>
      <NuxtLink :to="{ name: 'Help' }" class="help-link">
        {{ $t('project.create.help-link') }}
      </NuxtLink>
    </template>

    <div class="list-container">
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

      <Field v-if="haveMultipleCategories" :label="$t('project.form.project-templates')">
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

      <ProjectFormV2
        v-if="isValid || (form.categorie && !haveMultipleCategories)"
        :project="project"
        :loading="loading"
        @submit="onSubmit"
      />
    </div>
  </BasePage>
</template>

<style lang="scss" scoped>
.help-link {
  color: $primary-dark;
}
</style>
