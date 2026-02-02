<template>
  <FetchLoader :status="status" skeleton only-error>
    <MapRecap :locations="locations" expand :editable="isEdit" @expand="opened = true">
      <template #tooltip="{ location }">
        <ProjectLocationTooltip :location="location" :project="location.project" />
      </template>
    </MapRecap>
    <LocationDrawer
      :is-opened="opened"
      :editable="isEdit"
      :locations="locations"
      @close="opened = false"
    />
  </FetchLoader>
</template>

<script setup lang="ts">
import { getGroupLocation } from '@/api/v2/group.service'
import LocationDrawer from '@/components/map/LocationDrawer.vue'
import MapRecap from '@/components/map/MapRecap.vue'
import ProjectLocationTooltip from '@/components/project/map/ProjectLocationTooltip.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

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

const { status, data: locations } = getGroupLocation(organizationCode, groupId, {
  default: () => [],
})
</script>
