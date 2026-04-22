<script setup lang="ts">
import { getProjectLocations } from '@/api/v2/project.service'
import LocationList from '@/components/map/LocationList.vue'
import MapRecap from '@/components/map/MapRecap.vue'
import ProjectLocationDrawer from '@/components/project/map/ProjectLocationDrawer.vue'
import { TranslatedProject } from '@/models/project.model'
import { factoriesSkeleton } from '@/skeletons/base.skeletons'
import { locationSkeleton } from '@/skeletons/location.skeleton'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    editable?: boolean
    preview?: boolean
  }>(),
  {
    editable: false,
    preview: false,
  }
)

const isEdit = computed(() => props.editable && !props.preview)
const opened = ref(false)
const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)

const mapRef = useTemplateRef('map')
const onFocus = (location) => mapRef.value?.map?.flyTo(location)

const {
  status,
  data: locations,
  refresh,
} = getProjectLocations(organizationCode, projectId, {
  default: () => factoriesSkeleton(locationSkeleton, props.project.modules.locations),
})
</script>

<template>
  <FetchLoader :status="status" skeleton only-error>
    <MapRecap ref="map" :locations="locations" expand :editable="isEdit" @expand="opened = true" />
    <ProjectLocationDrawer
      :project="project"
      :is-opened="opened"
      :editable="isEdit"
      :locations="locations"
      :use-cluster="true"
      @close="opened = false"
      @reload="refresh"
    />
    <LocationList
      v-if="!props.preview"
      focus
      :editable="isEdit"
      :locations="locations"
      @focus="onFocus"
    />
    <!-- TODO edit locations -->
  </FetchLoader>
</template>
