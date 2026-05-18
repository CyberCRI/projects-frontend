<script setup lang="ts">
import ProjectTemplateForm from '~/components/project/ProjectTemplateForm.vue'
import { postProject, postProjectHeader } from '~/api/projects.service'
import ProjectFormV2 from '~/components/project/ProjectFormV2.vue'
import { imageSizesFormData } from '~/functs/imageSizesUtils'
import type { ProjectForm } from '~/models/project.model'
import { useProjectTemplatesForm } from '~/form/project'
import BasePage from '~/components/pages/BasePage.vue'
import useToasterStore from '~/stores/useToaster'
import { useOrganizationCode } from '#imports'
import useUsersStore from '~/stores/useUsers'
import analytics from '~/analytics'
import { pick } from 'es-toolkit'

const { t, locale } = useNuxtI18n()
const router = useRouter()
const loading = ref(false)
const organizationCode = useOrganizationCode()
const usersStore = useUsersStore()
const { onboardingTrap } = useOnboardingStatus()

const { form, isValid } = useProjectTemplatesForm()

const toaster = useToasterStore()

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

const haveMultipleTemplates = computed(() => form.value.categorie?.templates.length > 1)

// create default "project" with template selected (or null if categories are not template)
const project = computed(() => ({
  language: locale.value,
  template: form.value.template,
  tags: form.value.categorie.tags,
  categories: [form.value.categorie],
}))

const updateForm = (f) => {
  form.value = {
    ...form.value,
    template: null,
    categorie: null,
    ...(f || {}),
  }
}
</script>

<template>
  <BasePage :title="$t('project.create.title')" :notice="$t('project.create.notice')">
    <template #notice>
      <NuxtLink :to="{ name: 'Help' }" class="help-link">
        {{ $t('project.create.help-link') }}
      </NuxtLink>
    </template>

    <div class="list-container">
      <ProjectTemplateForm
        :model-value="pick(form, ['template', 'categorie'])"
        @update:model-value="updateForm"
      />
      <ProjectFormV2
        v-if="isValid || (form.categorie && !haveMultipleTemplates)"
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
