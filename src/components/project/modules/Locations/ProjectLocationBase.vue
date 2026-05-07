<script setup lang="ts">
import ProjectLocationDrawer from '@/components/project/map/ProjectLocationDrawer.vue'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { locationSkeleton } from '@/skeletons/location.skeleton'
import type { TranslatedProject } from '@/models/project.model'
import { factoriesSkeleton } from '@/skeletons/base.skeletons'
import { getProjectLocations } from '@/api/v2/project.service'
import LocationForm from '~/components/map/LocationForm.vue'
import LocationList from '@/components/map/LocationList.vue'

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

const cancel = () => {
  selectedLocation.value = null
  closeAllModals()
}

const fullRefresh = () => {
  refreshProjectData(props.project)
  refresh()
  cancel()
}

const onDelete = (location) => {
  selectedLocation.value = location
  openModals('delete')
}

const onEdit = (location) => {
  selectedLocation.value = location
  openModals('edit')
}

const onConfirmEdit = () => drawerRef.value.onSubmit(selectedLocation.value)
const onConFirmDelete = () => drawerRef.value.onDelete(selectedLocation.value)
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
      @cancel="cancel"
      @confirm="onConFirmDelete"
    >
      <MapRecap :locations="[selectedLocation]" :expand="false" />
    </ConfirmModal>

    <LocationForm
      v-if="stateModals.edit"
      v-model="selectedLocation"
      :location-types="['address', 'team', 'impact']"
      @delete="onConFirmDelete"
      @close="closeAllModals"
      @submit="onConfirmEdit"
    />
  </FetchLoader>
</template>
