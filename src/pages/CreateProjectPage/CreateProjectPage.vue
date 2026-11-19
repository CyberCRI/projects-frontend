<script setup lang="ts">
import type { ProjectForm as ProjectFormType } from 'shared-projects-frontend/models'
import ProjectTemplateForm from '~/components/project/ProjectTemplateForm.vue'
import { postProject, postProjectHeader } from 'shared-projects-frontend/apis'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import ProjectForm from '~/components/project/ProjectForm.vue'
import { imageSizesFormData } from '~/functs/imageSizesUtils'
import { useProjectTemplatesForm } from '~/form/project'
import BasePage from '~/components/pages/BasePage.vue'
import useToasterStore from '~/stores/useToaster'
import { useOrganizationCode } from '#imports'
import useUsersStore from '~/stores/useUsers'
import analytics from '~/analytics'
import { pick } from 'es-toolkit'

const { t, locale } = useNuxtI18n()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const organizationCode = useOrganizationCode()
const usersStore = useUsersStore()
const { onboardingTrap } = useOnboardingStatus()

const isConnected = computed(() => usersStore.isConnected)

const { form, isValid } = useProjectTemplatesForm({})

// pre add category from queryparams
const forcedCategory = ref(
  route.query.category ? parseInt(route.query.category.toString(), 10) : null
)

const toaster = useToasterStore()

const global = useGlobals()

const onSubmit = (form: ProjectFormType) => {
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

      global.hasUnsavedEdit = false

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

const login = () => {
  goToKeycloakLoginPage()
}
</script>

<template>
  <BasePage
    :title="$t('project.create.title')"
    :notice="isConnected ? $t('project.create.notice') : undefined"
  >
    <div v-if="!isConnected">
      <p class="login-notice centered">
        {{ $t('common.need-login') }}
      </p>
      <div class="login-button centered">
        <LpiButton :label="$t('common.login')" @click="login" />
      </div>
    </div>

    <template #notice>
      <NuxtLink v-if="isConnected" :to="{ name: 'Help' }" class="help-link">
        {{ $t('project.create.help-link') }}
      </NuxtLink>
    </template>

    <div v-if="isConnected" class="list-container">
      <ProjectTemplateForm
        :forced-category="forcedCategory"
        :model-value="pick(form, ['template', 'categorie'])"
        @update:model-value="updateForm"
      />
      <ProjectForm
        v-if="isValid || (form.categorie && !haveMultipleTemplates)"
        :project="project"
        :loading="loading"
        @submit="onSubmit"
      />
    </div>
  </BasePage>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.help-link {
  color: variables.$primary-dark;
}

.centered {
  display: flex;
  justify-content: center;
}

.login-notice {
  font-size: 1.3rem;
  margin-bottom: 2rem;
}
</style>
