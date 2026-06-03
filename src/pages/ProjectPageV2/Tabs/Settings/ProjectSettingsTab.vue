<script setup lang="ts">
import ProjectTemplateForm from '~/components/project/ProjectTemplateForm.vue'
import { refreshProjectData } from '~/composables/project/refreshProject'
import { deleteProjectMembersSelf } from '~/api/project-members.service'
import type { Options } from '~/components/base/button/GroupButton.vue'
import { useBlockNavigation } from '~/composables/useBlockNavigation'
import { deleteProject, patchProject } from '~/api/projects.service'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { getOrganizations } from '~/api/v2/organizations.service'
import LpiCheckbox from '~/components/base/form/LpiCheckbox.vue'
import type { TranslatedProject } from '~/models/project.model'
import LpiButton from '~/components/base/button/LpiButton.vue'
import { factoryPagination } from '~/skeletons/base.skeletons'
import { DEFAULT_ORGANIZATION_CODE } from '~/functs/constants'
import FormPanel from '~/components/base/FormPanel.vue'
import { useProjectSettingForm } from '~/form/project'
import Section from '~/components/base/Section.vue'
import useUsersStore from '~/stores/useUsers'
import { isEqual, pick } from 'es-toolkit'
import analytics from '~/analytics'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
  }>(),
  {}
)

const { t } = useNuxtI18n()
const toaster = useToaster()
const router = useRouter()
const usersStore = useUsersStore()
const { stateModals, openModals, closeModals } = useModals({
  delete: false,
  memberQuit: false,
  review: false,
  report: false,
  saveChange: false,
})
const { canDestroyProject, canEditProject, isMember, isOwner, isOrgAdmin, isAdmin, canAddReview } =
  usePermissions()

const { isMobile } = useViewportWidth()

const projectOrganizationCodes = computed(() => props.project.organizations.map((org) => org.code))
const organizationCode = useOrganizationCode()

// form
const defaultLocalForm = () => {
  return {
    publication_status: props.project.publication_status,
    life_status: props.project.life_status,
    is_locked: props.project.is_locked,
    organizations_codes: projectOrganizationCodes.value || [],
    categorie: (props.project.categories || []).find(
      (cat) => cat.organization === organizationCode
    ),
    template: props.project.template,
  }
}
const { form, reset, cleanedData, isValid } = useProjectSettingForm({
  default: defaultLocalForm(),
  lazy: true,
})

const updateFormTemplates = (templateForm) => {
  form.value = {
    ...form.value,
    template: null,
    categorie: null,
    ...(templateForm || {}),
  }
}
watch(
  () => props.project,
  () => reset(defaultLocalForm()),
  { immediate: true, deep: true }
)
const isFormEqual = useBlockNavigation(() => {
  const compareForm = form.value
  const orginalForm = defaultLocalForm()
  // change categorie/template with id (to avoid compare element memoryCheck)
  return isEqual(
    {
      ...compareForm,
      categorie: compareForm.categorie?.id,
      template: compareForm.template?.id,
    },
    {
      ...orginalForm,
      categorie: orginalForm.categorie?.id,
      template: orginalForm.template?.id,
    }
  )
})
// removeOrganization
const updateOrganisation = (orgCode: string, state: boolean) => {
  if (state) {
    form.value.organizations_codes.push(orgCode)
  } else {
    form.value.organizations_codes = form.value.organizations_codes.filter((c) => c !== orgCode)
  }
}

const asyncing = ref(false)

const visibilityOptions = computed(
  () =>
    [
      {
        value: 'public',
        label: t('status.public'),
        iconName: 'Eye',
        condition: true,
      },
      {
        value: 'org',
        label: t('common.org'),
        iconName: 'PeopleGroup',
        condition: !projectOrganizationCodes.value.includes(DEFAULT_ORGANIZATION_CODE),
      },
      {
        value: 'private',
        label: t('status.private'),
        iconName: 'EyeSlash',
        condition: true,
      },
    ].filter((status) => status.condition) as Options[]
)

const lifeStatusOptions = computed(
  () =>
    [
      {
        value: 'running',
        label: t('status.ongoing'),
        iconName: 'Spinner',
        condition: true,
      },
      {
        value: 'toreview',
        label: t('project.reviewable'),
        iconName: 'ListCheck',
        condition:
          props.project.modules.members > 0 &&
          (isOwner.value || isOrgAdmin.value || isAdmin.value || canAddReview.value),
      },
      {
        value: 'completed',
        label: t('status.completed'),
        iconName: 'Check',
        condition: true,
      },
    ].filter((status) => status.condition) as Options[]
)

const selectedPublicationDescription = computed(() => {
  switch (form.value.publication_status) {
    case 'private':
      return t('visibility.private')
    case 'org':
      return t('visibility.community')
    case 'public':
      return t('visibility.public')
    default:
      return ''
  }
})

// TODO change limit to get only organizations ?
const { data: organizations } = getOrganizations({
  paginationConfig: { limit: 999 },
  default: () => factoryPagination(() => []),
})

const disableLastOrg = (org) =>
  projectOrganizationCodes.value.length === 1 && projectOrganizationCodes.value[0] === org.code

const selectedOrgLinks = computed(() => {
  return organizations.value
    .filter((org) => projectOrganizationCodes.value.includes(org.code))
    .map((org) => ({
      ...org,
      website_url: `${org.website_url}/projects/${props.project.slug}/project-settings`,
    }))
})

// callback
const refresh = () => refreshProjectData(props.project)

const redirect = () => {
  router.push({
    name: 'ProjectSnapshot',
    params: {
      slugOrId: props.project.slug || props.project.id,
    },
  })
}

const onUpdate = () => {
  asyncing.value = true
  const body = { ...cleanedData.value }

  patchProject(props.project.id, body)
    .then(() => {
      toaster.pushSuccess(t('toasts.project-edit.success'))
      refresh()
    })
    .catch(() => toaster.pushError(t('toasts.project-edit.error')))
    .finally(() => (asyncing.value = false))
}

const onDeleteProject = () => {
  asyncing.value = true
  deleteProject(props.project.id)
    .then(() => {
      analytics.project.delete({ id: props.project.id })
      toaster.pushSuccess(t('toasts.project-destroy.success'))
      router.push({ name: 'HomeRoot' })
    })
    .catch(() => toaster.pushError(t('toasts.project-destroy.error')))
    .finally(() => (asyncing.value = false))
}

const onQuitProject = () => {
  asyncing.value = true
  deleteProjectMembersSelf(props.project.id)
    .then(() => {
      analytics.project.removeTeamMember({
        project: {
          id: props.project.id,
        },
        members: {
          users: [usersStore.id],
        },
      })
      toaster.pushSuccess(t('toasts.project-quit.success'))
      if (props.project.publication_status == 'private') {
        router.push({ name: 'HomeRoot' })
      } else {
        redirect()
      }
      refresh()
    })
    .catch(() => toaster.pushError(t('toasts.project-quit.error')))
    .finally(() => (asyncing.value = false))
}
</script>

<template>
  <BaseModuleTab :title="project.$t.title">
    <!-- actions -->
    <FormPanel
      :asyncing="asyncing"
      :confirm-action-disabled="!isValid || isFormEqual"
      @confirm="onUpdate"
      @close="redirect"
    >
      <div class="list-container">
        <template v-if="canEditProject">
          <Section class="skeletons-background" :title="$t('project.visibility')">
            <GroupButton
              v-model="form.publication_status"
              :has-icon="true"
              :is-vertical="isMobile"
              :options="visibilityOptions"
              class="setting"
            />
            <p class="publication-visibility">
              <IconImage name="HelpCircle" class="icon" />
              {{ selectedPublicationDescription }}
            </p>
          </Section>
          <Section class="skeletons-background" :title="$t('project.life-status')">
            <GroupButton
              v-model="form.life_status"
              :has-icon="true"
              :is-vertical="isMobile"
              :options="lifeStatusOptions"
            />
          </Section>
          <Section
            v-if="canAddReview && project.life_status === 'toreview'"
            class="skeletons-background"
            :title="$t('project.reviews')"
          >
            <LpiButton
              :label="$t('project.review')"
              :secondary="true"
              @click="openModals('review')"
            />
          </Section>

          <Section
            v-if="organizations?.length"
            class="skeletons-background"
            :title="$t('project.org-settings.title')"
          >
            <p class="org-description">
              {{ $t('project.org-settings.description') }}
            </p>

            <div class="organization-ctn">
              <LpiCheckbox
                v-for="org in organizations"
                :key="org.code"
                :model-value="form.organizations_codes.includes(org.code)"
                as-button
                :label="org.$t.name"
                :disabled="disableLastOrg(org)"
                @update:model-value="updateOrganisation(org.code, $event)"
              />
            </div>
          </Section>

          <Section :title="$t('project.form.project-category')" class="skeletons-background">
            <template v-if="form.organizations_codes.length === 0">
              <LpiSnackbar class="completed-form-snackbar" icon="QuestionMark" type="error">
                <p>{{ $t('project.org-settings.warning') }}</p>
              </LpiSnackbar>
              <ul class="links-list">
                <li v-for="link in selectedOrgLinks" :key="link.id">
                  <a :href="link.website_url" class="link" target="_blank">
                    {{ link.website_url }}
                  </a>
                </li>
              </ul>
            </template>
            <ProjectTemplateForm
              :model-value="pick(form, ['template', 'categorie'])"
              @update:model-value="updateFormTemplates"
            />
          </Section>
        </template>

        <Section class="section-red skeletons-background" title="">
          <template #label>
            <span class="actions-title">
              {{ $t('project.actions') }}
            </span>
          </template>
          <div class="list-container">
            <LpiButton
              v-if="canDestroyProject"
              :label="$t('project.destroy')"
              class="button"
              color="red"
              text-color="white"
              btn-icon="TrashCanOutline"
              data-test="destroy-project"
              @click="openModals('delete')"
            />
            <LpiButton
              v-if="isMember"
              :label="$t('project.quit')"
              class="button"
              btn-icon="Logout"
              color="red"
              text-color="white"
              @click="openModals('memberQuit')"
            />
          </div>
        </Section>
      </div>
    </FormPanel>
  </BaseModuleTab>

  <!-- Drawer/modal -->
  <ConfirmModal
    v-if="stateModals.delete"
    :content="$t('common.destroy-confirm')"
    :title="$t('project.destroy')"
    :asyncing="asyncing"
    @cancel="closeModals('delete')"
    @confirm="onDeleteProject"
  />

  <ConfirmModal
    v-if="stateModals.memberQuit"
    :content="$t('common.quit-project')"
    :title="$t('project.quit')"
    :asyncing="asyncing"
    @cancel="closeModals('memberQuit')"
    @confirm="onQuitProject"
  />

  <ReviewDrawer
    :is-opened="stateModals.review"
    :project="project"
    @reload="refresh"
    @close="closeModals('review')"
  />
</template>

<style lang="scss" scoped>
.section-red {
  background-color: var(--gray);
  border: none;
}

.actions-title {
  color: var(--white);
}

.organization-ctn {
  flex-wrap: wrap;
  gap: $space-m;
  margin: 1rem 0;
}

.categories-ctn {
  position: relative;
  display: flex;
  justify-content: stretch;

  > ul {
    flex-grow: 1;
  }
}

.organization-ctn,
.categories-ctn {
  position: relative;
  display: flex;
}

.publication-visibility {
  opacity: 0.7;
  padding: 1rem 0;
}
</style>
