<script setup lang="ts">
import { getProjectMembers } from '@/api/v2/project.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { TranslatedProject } from '@/models/project.model'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { userSkeleton } from '@/skeletons/user.skeletons'

const props = withDefaults(
  defineProps<{ project: TranslatedProject; limit?: number; preview?: false }>(),
  {
    limit: null,
    preview: false,
  }
)

const projectId = computed(() => props.project.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.members, props.limit))

const {
  status,
  data: members,
  pagination,
} = getProjectMembers(organizationCode, projectId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(userSkeleton, limitSkeletons.value),
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="team-ctn">
      <ProjectMemberItem
        v-for="member in members"
        :key="member.id"
        :user="member"
        class="project-member shadow-drop"
      />
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
      <!-- @user-click="emit('user-click', $event)" -->
    </div>
  </FetchLoader>
</template>

<style lang="scss" scoped>
.team-ctn {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  gap: $space-m;
  justify-content: space-between;

  .project-member {
    width: 100%;
    max-width: 200px;
  }
}
</style>
