<script setup lang="ts">
import { getProjectMembers } from '@/api/v2/project.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { TranslatedProject } from '@/models/project.model'

const props = withDefaults(defineProps<{ project: TranslatedProject; limit?: number }>(), {
  limit: null,
})

const projectId = computed(() => props.project.id)
const organizationCode = useOrganizationCode()

const { status, data: members } = getProjectMembers(organizationCode, projectId, {
  prginationConfig: {
    limit: props.limit,
  },
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
