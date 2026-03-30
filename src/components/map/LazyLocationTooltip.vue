<script setup lang="ts">
import { getGroup } from '@/api/v2/group.service'
import { getProject } from '@/api/v2/projects.service'
import ProjectLocationTooltip from '@/components/project/map/ProjectLocationTooltip.vue'
import { LocationGeneral } from '@/interfaces/maps'
import { groupSkeleton } from '@/skeletons/group.skeletons'
import { projectSkeleton } from '@/skeletons/project.skeletons'

const props = defineProps<{
  location: LocationGeneral
}>()

const organizationCode = useOrganizationCode()
const contentId = computed(() => props.location.content_id)

const {
  status: statusGroup,
  data: group,
  refresh: refreshGroup,
} = getGroup(organizationCode, contentId, {
  default: () => groupSkeleton(),
  immediate: false,
})

const {
  status: statusProject,
  data: project,
  refresh: refreshProject,
} = getProject(organizationCode, contentId, {
  default: () => projectSkeleton(),
  immediate: false,
})

const status = computed(() => {
  switch (props.location.content_type) {
    case 'people_group':
      return statusGroup.value
    case 'project':
      return statusProject.value
  }
})

const data = computed(() => {
  switch (props.location.content_type) {
    case 'people_group':
      return group.value
    case 'project':
      return project.value
  }
})

watchEffect(() => {
  switch (props.location.content_type) {
    case 'people_group':
      return refreshGroup()
    case 'project':
      return refreshProject()
  }
})
</script>

<template>
  <div class="location-popup">
    <FetchLoader :status="status" only-error skeleton>
      <GroupLocationToolTip
        v-if="location.content_type === 'people_group'"
        :location="location"
        :group="data"
      />
      <ProjectLocationTooltip
        v-else-if="location.content_type === 'project'"
        :location="location"
        :project="data"
      />
    </FetchLoader>
  </div>
</template>

<style lang="scss" scoped>
.location-popup {
  width: pxToRem(300px);
  margin: -63px;
}
</style>
