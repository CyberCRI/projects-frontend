<template>
  <FetchLoader :status="status" skeleton only-error>
    <GeneralMap
      ref="map"
      class="map-recap"
      :locations="locations"
      :editable="editable"
      :loading="false"
      @expand="openModal"
    />

    <LocationDrawer
      :is-opened="stateModal"
      :locations="locations"
      :editable="editable"
      @close="closeModal"
    />
    <LocationList
      v-if="!props.preview"
      focus
      :locations="locations"
      :editable="editable"
      @focus="onFocus"
    />
  </FetchLoader>
</template>

<script setup lang="ts">
import { getGroupAllLocations } from '@/api/v2/group.service'
import GeneralMap from '@/components/map/GeneralMap.vue'
import LocationDrawer from '@/components/map/LocationDrawer.vue'
import LocationList from '@/components/map/LocationList.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { factoriesSkeleton } from '@/skeletons/base.skeletons'
import { locationSkeleton } from '@/skeletons/location.skeleton'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    preview?: boolean
    editable?: boolean
  }>(),
  {
    preview: false,
    editable: false,
  }
)

const { stateModal, openModal, closeModal } = useModal()
const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group.id)

const mapRef = useTemplateRef('map')
const onFocus = (location) => mapRef.value.map.flyTo(location, 10, { duration: 1.5 })

const { status, data: locations } = getGroupAllLocations(organizationCode, groupId, {
  default: () => factoriesSkeleton(locationSkeleton, props.group.modules.locations),
})
</script>
