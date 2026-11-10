<script setup lang="ts">
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { projectSkeleton } from '~/skeletons/project.skeletons'
import { getUserProjectsMember } from '~/api/v2/user.service'

const props = withDefaults(
  defineProps<{
    profile: TranslatedUserModel
    limit?: number
    preview?: boolean
  }>(),
  {
    limit: null,
    preview: false,
  }
)

const profileId = computed(() => props.profile.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.profile.modules.projects, props.limit))
const {
  status,
  data: projects,
  pagination,
  isLoading,
} = getUserProjectsMember(organizationCode, profileId, {
  paginationConfig: {
    limit: props.limit,
  },
  keyFixed: computed(() => props.preview),
  checkArgs: true,
  default: () => factoryPagination(projectSkeleton, limitSkeletons.value),
})
</script>

<template>
  <ProfileProjectsList
    :status="status"
    :projects="projects"
    :pagination="pagination"
    :is-loading="isLoading"
    :preview="preview"
    :empty-label="$t('me.no-project-participate')"
  />
</template>
