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
        class="unboxed"
        :locations="locations"
        :focused-location="focusedLocation"
        @map-moved="focusedLocation = null"
      />
    </div>

    <div class="location-lists">
      <div v-if="teamLocations.length" class="location-list-wrapper">
        <h3 class="list-title">Team</h3>
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
        <h3 class="list-title">Impact</h3>
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
    </div>

    <LocationForm
      v-if="formVisible"
      :project-id="projectId"
      :address="newLocationAddress"
      :location-to-be-edited="locationToBeEdited"
      :new-coordinates="newCoordinates"
      @close="closeLocationForm"
      @center-map="centerMap"
      @location-edited="$emit('reload-locations')"
      @location-created="onLocationCreated"
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
<script>
import useToasterStore from '@/stores/useToaster'
import analytics from '@/analytics'
import { deleteLocation } from '@/api/locations.services'

export default {
  name: 'ProjectLocationsTab',

  inject: ['projectLayoutToggleAddModal'],

  props: {
    locations: {
      type: Array,
      default: () => [],
    },
    isInEditingMode: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['reload-locations'],

  setup() {
    const { canEditProject } = usePermissions()
    const toaster = useToasterStore()
    return {
      canEditProject,
      toaster,
    }
  },
  data() {
    return {
      formVisible: false,
      locationToBeEdited: null,
      locationToDelete: null,
      deleteAsyncing: false,
      focusedLocation: null,
    }
  },

  computed: {
    teamLocations() {
      return this.locations.filter((l) => l.type === 'team')
    },
    impactLocations() {
      return this.locations.filter((l) => l.type === 'impact')
    },
  },

  methods: {
    async onConfirmDeleteLocation() {
      try {
        this.deleteAsyncing = true
        await deleteLocation(this.locationToDelete)

        analytics.location.deleteLocationMapPoint({
          project: {
            id: this.projectId,
          },
          location: this.locationToDelete,
        })

        this.toaster.pushSuccess(this.$t('toasts.location-delete.success'))

        this.$emit('reload-locations')
        this.$nextTick(() => this.centerMap())
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.location-delete.error')} (${error})`)
        console.error(error)
      } finally {
        this.deleteAsyncing = false
        this.locationToDelete = null
      }
    },

    openEditModal(location) {
      if (this.isInEditingMode) {
        // restart from source locations because the map ones are not reactive
        this.locationToBeEdited = location
        this.formVisible = true
      }
    },

    closeLocationForm() {
      this.locationToBeEdited = null
      this.formVisible = false
    },
  },
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
