<script setup lang="ts">
import { getEvent } from '@/api/v2/event.service'
import { getGroup } from '@/api/v2/group.service'
import { getNews } from '@/api/v2/news.service'
import { getProject } from '@/api/v2/projects.service'
import LocationEventPopUp from '@/components/event/map/LocationEventPopUp.vue'
import GroupLocationPopUp from '@/components/group/Map/GroupLocationPopUp.vue'
import LocationPopUp from '@/components/map/LocationPopUp.vue'
import LocationNewsPopUp from '@/components/news/map/LocationNewsPopUp.vue'
import ProjectLocationPopUp from '@/components/project/map/ProjectLocationPopUp.vue'
import { LocationGeneral } from '@/interfaces/maps'
import { TranslatedEventModel } from '@/models/event.model'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { TranslatedNews } from '@/models/news.model'
import { TranslatedProject } from '@/models/project.model'
import { eventSkeleton } from '@/skeletons/event.skeletons'
import { groupSkeleton } from '@/skeletons/group.skeletons'
import { newsSkeleton } from '@/skeletons/news.skeletons'
import { projectSkeleton } from '@/skeletons/project.skeletons'

const props = defineProps<{
  location: LocationGeneral
}>()

const organizationCode = useOrganizationCode()
const contentIdString = computed(() => props.location.content_id)
const contentIdInt = computed(() => parseInt(contentIdString.value, 10))

const {
  status: statusGroup,
  data: group,
  refresh: refreshGroup,
} = getGroup(organizationCode, contentIdString, {
  default: () => groupSkeleton(),
  query: {
    modules: 'none',
    serializer: 'superlight',
  },
  immediate: false,
})

const {
  status: statusProject,
  data: project,
  refresh: refreshProject,
} = getProject(organizationCode, contentIdString, {
  default: () => projectSkeleton(),
  query: {
    info_details: 'summary',
    serializer: 'superlight',
  },
  immediate: false,
})

const {
  status: statusNews,
  data: news,
  refresh: refreshNews,
} = getNews(organizationCode, contentIdInt, {
  default: () => newsSkeleton(),
  query: {
    serializer: 'light',
  },
  immediate: false,
})

const {
  status: statusEvent,
  data: event,
  refresh: refreshEvent,
} = getEvent(organizationCode, contentIdInt, {
  default: () => eventSkeleton(),
  query: {
    serializer: 'light',
  },
  immediate: false,
})

const status = computed(() => {
  switch (props.location.content_type) {
    case 'people_group':
      return statusGroup.value
    case 'project':
      return statusProject.value
    case 'news':
      return statusNews.value
    case 'event':
      return statusEvent.value
    default:
      return 'success'
  }
})

const data = computed(() => {
  switch (props.location.content_type) {
    case 'people_group':
      return group.value
    case 'project':
      return project.value
    case 'news':
      return news.value
    case 'event':
      return event.value
    default:
      return
  }
})

watch(
  () => [props.location.content_type, props.location.content_id],
  () => {
    switch (props.location.content_type) {
      case 'people_group':
        return refreshGroup()
      case 'project':
        return refreshProject()
      case 'news':
        return refreshNews()
      case 'event':
        return refreshEvent()
      default:
        return
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="location-popup">
    <FetchLoader :status="status" only-error skeleton>
      <GroupLocationPopUp
        v-if="location.content_type === 'people_group'"
        :location="location"
        :group="data as TranslatedPeopleGroupModel"
      />
      <ProjectLocationPopUp
        v-else-if="location.content_type === 'project'"
        :location="location"
        :project="data as TranslatedProject"
      />
      <LocationEventPopUp
        v-else-if="location.content_type === 'event'"
        :location="location"
        :event="data as TranslatedEventModel"
      />
      <LocationNewsPopUp
        v-else-if="location.content_type === 'news'"
        :location="location"
        :news="data as TranslatedNews"
      />
      <LocationPopUp v-else :location="location" />
    </FetchLoader>
  </div>
</template>
