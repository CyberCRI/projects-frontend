<template>
  <FetchLoader :status="status" skeleton only-error>
    <MapRecap ref="map" :locations="locations" expand :editable="isEdit" @expand="opened = true">
      <template #tooltip="{ location }">
        <ProjectLocationTooltip
          :location="location as TranslatedLocation"
          :project="location.project"
        />
      </template>
    </MapRecap>
    <LocationDrawer
      :is-opened="opened"
      :editable="isEdit"
      :locations="locations"
      :use-cluster="true"
      @close="opened = false"
    />
    <LocationList
      v-if="!props.preview"
      :editable="isEdit"
      :locations="locations"
      @focus="onFocus"
    />
  </FetchLoader>
</template>

<script setup lang="ts">
import { getGroupLocation } from '@/api/v2/group.service'
import LocationDrawer from '@/components/map/LocationDrawer.vue'
import LocationList from '@/components/map/LocationList.vue'
import MapRecap from '@/components/map/MapRecap.vue'
import ProjectLocationTooltip from '@/components/project/map/ProjectLocationTooltip.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { TranslatedLocation } from '@/models/location.model'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
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
const groupId = computed(() => props.group.id)

const mapRef = useTemplateRef('map')
const onFocus = (location) => mapRef.value?.map?.flyTo(location)

const { status, data: locations } = getGroupLocation(organizationCode, groupId, {
  default: () => [],
})
</script>
