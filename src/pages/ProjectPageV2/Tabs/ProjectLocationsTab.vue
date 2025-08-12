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
      <LazyMapRecap v-if="locations.length" class="unboxed" :locations="locations" />
    </div>

    <div class="location-lists">
      <div v-if="teamLocations.length" class="location-list-wrapper">
        <h3 class="list-title">Team</h3>
        <ul class="location-list">
          <li v-for="location in teamLocations" :key="location.id" class="location">
            {{ location.title }}
          </li>
        </ul>
      </div>
      <div v-if="impactLocations.length" class="location-list-wrapper">
        <h3 class="list-title">Impact</h3>
        <ul class="location-list">
          <li v-for="location in impactLocations" :key="location.id" class="location">
            {{ location.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
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

  setup() {
    const { canEditProject } = usePermissions()
    return {
      canEditProject,
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
}
</script>
<style scoped lang="scss">
.project-locations {
  margin-top: 2rem;
}

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
  font-weight: 400;
}

.location-list {
  margin-top: 1rem;
  margin-left: 1rem;
  list-style-type: disc;
  list-style-position: inside;
  columns: 3;
  font-weight: 600;
}
</style>
