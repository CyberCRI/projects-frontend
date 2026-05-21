<script setup lang="ts">
import ProjectLocationDrawer from '~/components/project/modules/Locations/ProjectLocationDrawer.vue'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { locationSkeleton } from '@/skeletons/location.skeleton'
import type { TranslatedProject } from '@/models/project.model'
import { factoriesSkeleton } from '@/skeletons/base.skeletons'
import { getProjectLocations } from '@/api/v2/project.service'
import LocationForm from '~/components/map/LocationForm.vue'
import LocationList from '@/components/map/LocationList.vue'
import { PROJECT_LOCATIONS_TYPES } from '~/functs/constants'

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

const asyncing = ref(false)
const drawerRef = useTemplateRef('drawer')
const { stateModals, openModals, closeModals, closeAllModals } = useModals({
  edit: false,
  delete: false,
  map: false,
})
const isEdit = computed(() => props.editable && !props.preview)
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

const selectedLocation = ref()

const clear = () => {
  asyncing.value = false
  selectedLocation.value = null
  closeAllModals()
}

const fullRefresh = () => {
  refreshProjectData(props.project)
  refresh()
  clear()
}

const onDelete = (location) => {
  selectedLocation.value = location
  openModals('delete')
}

const onEdit = (location) => {
  selectedLocation.value = location
  openModals('edit')
}

const onConfirmEdit = () => {
  asyncing.value = true
  drawerRef.value.onSubmit(selectedLocation.value).finally(() => (asyncing.value = false))
}
const onConFirmDelete = () => {
  asyncing.value = true
  drawerRef.value.onDelete(selectedLocation.value).finally(() => (asyncing.value = false))
}
</script>

<template>
  <FetchLoader :status="status" skeleton only-error>
    <BaseModuleHeader v-if="!preview" :editable="editable" @add="openModals('map')" />
    <MapRecap
      ref="map"
      :locations="locations"
      expand
      :editable="isEdit"
      @edit="onEdit"
      @expand="openModals('map')"
    />
    <ProjectLocationDrawer
      ref="drawer"
      :project="project"
      :is-opened="stateModals.map"
      :editable="isEdit"
      :locations="locations"
      :use-cluster="true"
      @close="closeModals('map')"
      @reload="fullRefresh"
    />
    <LocationList
      v-if="!props.preview"
      focus
      :editable="isEdit"
      :locations="locations"
      @delete="onDelete"
      @edit="onEdit"
      @focus="onFocus"
    />

    <ConfirmModal
      v-if="stateModals.delete"
      :title="$t('geocoding.confirm-delete-location')"
      :asyncing="asyncing"
      @clear="clear"
      @confirm="onConFirmDelete"
    >
      <MapRecap :locations="[selectedLocation]" :expand="false" />
    </ConfirmModal>

    <LocationForm
      v-if="stateModals.edit"
      v-model="selectedLocation"
      :location-types="PROJECT_LOCATIONS_TYPES"
      @delete="onConFirmDelete"
      @close="closeAllModals"
      @submit="onConfirmEdit"
    />
  </FetchLoader>
</template>
