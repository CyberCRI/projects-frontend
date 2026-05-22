<template>
  <AdminBlock :block-title="blockTitle">
    <template #default>
      <FetchLoader :status="status" only-error skeleton>
        <FeaturedProjectAdminListItem
          v-for="featuredProject in featuredProjects"
          :key="featuredProject.id"
          :project="featuredProject"
        />
        <EmptyLabel v-if="featuredProjects.length === 0" />
      </FetchLoader>
    </template>
    <template #footer>
      <LpiButton
        :btn-icon="featuredProjects.length ? 'Pen' : 'Plus'"
        :label="featuredProjects.length ? $t('common.edit') : $t('common.add')"
        @click="openModal"
      />
    </template>
  </AdminBlock>
  <ProjectSelectDrawer
    :is-opened="stateModal"
    :selected-projects="featuredProjects"
    :max-selected="LIMIT_PROJECTS"
    :title="$t('featured-projects.drawer.title')"
    @close="closeModal"
    @submit="onPickProjects"
  />
</template>
<script setup lang="ts">
import { addFeaturedProject, removeFeaturedProject } from '~/api/organizations.service'
import { getFeaturedProjects } from '~/api/v2/organizations.service'
import { projectSkeleton } from '~/skeletons/project.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'
import FetchLoader from '~/components/base/FetchLoader.vue'

import ProjectSelectDrawer from '~/components/drawer/Project/ProjectSelectDrawer.vue'
import useToasterStore from '~/stores/useToaster'

const { t } = useNuxtI18n()
const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const { stateModal, openModal, closeModal } = useModal()
const LIMIT_PROJECTS = 3

const blockTitle = computed(
  () =>
    `${t('admin.portal.featured-projects')} (${featuredProjects.value.length} ${t('common.of')} ${LIMIT_PROJECTS})`
)

const {
  status,
  data: featuredProjects,
  refresh,
} = getFeaturedProjects(organizationCode, {
  default: () => factoryPagination(projectSkeleton, LIMIT_PROJECTS),
})

const onPickProjects = async (projects) => {
  try {
    const current = featuredProjects.value.map((p) => p.id)
    const picked = projects.map((p) => p.id)

    const toAdd = picked.filter((p) => !current.includes(p))
    const toRemove = current.filter((p) => !picked.includes(p))

    await addFeaturedProject(organizationCode, { featured_projects_ids: toAdd })
    await removeFeaturedProject(organizationCode, {
      featured_projects_ids: toRemove,
    })
    toaster.pushSuccess(t('featured-projects.save.success'))

    refresh()
  } catch (err) {
    toaster.pushError(`${t('featured-projects.save.error')} (${err})`)
    console.error(err)
  } finally {
    closeModal()
  }
}
</script>
