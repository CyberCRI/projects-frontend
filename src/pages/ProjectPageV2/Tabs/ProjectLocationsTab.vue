<template>
  <div class="project-locations">
    <div v-if="isInEditingMode && canEditProject" class="actions">
      <LpiButton
        btn-icon="Plus"
        class="edit-btn"
        :label="$t('project.add-location')"
        @click="projectLayoutToggleAddModal('location')"
      />
    </div>

    <div class="main-ctn">
      <LazyMapRecap
        v-if="locations.length"
        ref="map"
        class="unboxed"
        expand
        :locations="locations"
        :focused-location="focusedLocation"
        @map-moved="focusedLocation = null"
        @expand="projectLayoutToggleAddModal('location')"
      />
    </div>

    <div class="location-lists">
      <div v-if="teamLocations.length" class="location-list-wrapper">
        <h3 class="list-title">{{ $t('team.team') }}</h3>
        <ul class="location-list">
          <li v-for="location in teamLocations" :key="location.id" class="location">
            <LocationListItem
              :location="location"
              :is-editable="isInEditingMode"
              @focus-location="focusedLocation = $event"
              @delete-location="locationToDelete = $event"
              @edit-location="openEditModal"
            />
          </li>
        </ul>
      </div>
      <div v-if="impactLocations.length" class="location-list-wrapper">
        <h3 class="list-title">{{ $t('project.impact') }}</h3>
        <ul class="location-list">
          <li v-for="location in impactLocations" :key="location.id" class="location">
            <LocationListItem
              :location="location"
              :is-editable="isInEditingMode"
              @focus-location="focusedLocation = $event"
              @delete-location="locationToDelete = $event"
              @edit-location="openEditModal"
            />
          </li>
        </ul>
      </div>
      <div v-if="addressLocations.length" class="location-list-wrapper">
        <h3 class="list-title">{{ $t('geocoding.address') }}</h3>
        <ul class="location-list">
          <li v-for="location in addressLocations" :key="location.id" class="location">
            <LocationListItem
              :location="location"
              :is-editable="isInEditingMode"
              @focus-location="focusedLocation = $event"
              @delete-location="locationToDelete = $event"
              @edit-location="openEditModal"
            />
          </li>
        </ul>
      </div>
    </div>

    <LocationForm
      v-if="formVisible"
      :project-id="project.id"
      :location-to-be-edited="locationToBeEdited"
      @close="closeLocationForm"
      @center-map="centerMap"
      @location-edited="$emit('reload-locations')"
      @location-created="$emit('reload-locations')"
      @location-deleted="$emit('reload-locations')"
    />

    <ConfirmModal
      v-if="locationToDelete"
      :asyncing="deleteAsyncing"
      :title="$t('geocoding.delete-location')"
      :content="$t('geocoding.confirm-delete-location')"
      @cancel="locationToDelete = null"
      @confirm="onConfirmDeleteLocation"
    />
  </div>
</template>

<script setup lang="ts">
import useToasterStore from '@/stores/useToaster'
import analytics from '@/analytics'
import { deleteLocation } from '@/api/locations.services'
import { TranslatedLocation } from '@/models/location.model'
import { TranslatedProject } from '@/models/project.model'
import LocationForm from '@/components/project/map/LocationForm.vue'
import LocationListItem from '@/components/map/LocationListItem.vue'

const projectLayoutToggleAddModal: any = inject('projectLayoutToggleAddModal')

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    locations?: TranslatedLocation[]
    isInEditingMode?: boolean
  }>(),
  {
    locations: () => [],
    isInEditingMode: false,
  }
)
const emit = defineEmits(['reload-locations'])
const { canEditProject } = usePermissions()
const { t } = useNuxtI18n()
const toaster = useToasterStore()
const formVisible = ref(false)
const locationToBeEdited = ref(null)
const locationToDelete = ref<TranslatedLocation>(null)
const deleteAsyncing = ref(false)
const focusedLocation = ref(null)

const teamLocations = computed(() => props.locations.filter((l) => l.type === 'team'))
const impactLocations = computed(() => props.locations.filter((l) => l.type === 'impact'))
const addressLocations = computed(() => props.locations.filter((l) => l.type === 'address'))

const mapRef = useTemplateRef('map')
const centerMap = () => mapRef.value?.map?.centerMap()

const onConfirmDeleteLocation = async () => {
  try {
    deleteAsyncing.value = true
    await deleteLocation(props.project.id, locationToDelete.value.id)

    analytics.location.deleteLocationMapPoint({
      project: {
        id: props.project.id,
      },
      // @ts-expect-error wrong type (translatedLocation !== Location)
      location: locationToDelete.value,
    })

    toaster.pushSuccess(t('toasts.location-delete.success'))

    emit('reload-locations')
    nextTick(() => centerMap())
  } catch (error) {
    toaster.pushError(`${t('toasts.location-delete.error')} (${error})`)
    console.error(error)
  } finally {
    deleteAsyncing.value = false
    locationToDelete.value = null
  }
}

const openEditModal = (location) => {
  if (props.isInEditingMode) {
    // restart from source locations because the map ones are not reactive
    locationToBeEdited.value = location
    formVisible.value = true
  }
}

const closeLocationForm = () => {
  locationToBeEdited.value = null
  formVisible.value = false
}
</script>
<style scoped lang="scss">
.actions {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.location-list-wrapper {
  margin-top: 2rem;
}

.list-title {
  text-transform: uppercase;
  font-size: $font-size-l;
  color: $primary-dark;
  font-weight: 700;
}

.location-list {
  list-style: none;
  display: grid;
  margin-top: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;

  @media screen and (max-width: $max-tablet) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: $min-tablet) {
    grid-template-columns: 1fr;
  }
}
</style>
