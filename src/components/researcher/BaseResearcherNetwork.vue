<template>
  <div v-if="user.researcher" class="researcher-network">
    <div class="network-map">
      <GeneralMap
        ref="map"
        class="map-recap"
        :locations="locations"
        :editable="isEdit"
        @edit="onEdit"
        @expand="onExpand"
      />
    </div>
    <div class="top-collaborations">
      <h3 class="collaboration-title">{{ $t('researcher.top-collaborations') }}</h3>
      <RouterLink
        v-for="collaboration in topCollaborations"
        :key="collaboration.id"
        :to="collaboration.url"
        class="collaboration-link"
      >
        <div class="collaboration-label">
          <div class="cropped">{{ collaboration.label }}</div>
        </div>
        <IconImage class="collaboration-icon" name="ChevronRight" />
      </RouterLink>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()

const isEdit = ref(false)
const onEdit = () => console.log('Editing')
const onExpand = () => console.log('Expending')

const locations = ref([])

const topCollaborations = ref([
  { id: 1, label: 'Center for Research on Interdisciplinary', url: 'https://google.com' },
  { id: 2, label: 'University College London', url: 'https://google.com' },
  { id: 3, label: 'Massachusetts Institute of Technology', url: 'https://google.com' },
  { id: 4, label: 'Max Planck Institute for Demographic Research', url: 'https://google.com' },
  { id: 5, label: 'Michigan State University', url: 'https://google.com' },
])
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.researcher-network {
  display: flex;
  gap: 1rem;
  align-items: stretch;
  justify-content: stretch;
}

.network-map,
.top-collaborations {
  flex: 1 1 50%;
  min-height: 10rem;
}

.top-collaborations {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
}

.collaboration-link {
  display: inline-flex;
  gap: 1rem;

  .collaboration-label {
    flex-grow: 1;
    flex-shrink: 1;
    position: relative;

    .cropped {
      // trick needed to limit the label size
      position: absolute;
      inset: 0;
    }
  }

  .collaboration-icon {
    flex-shrink: 0;
    width: 1.2em;
    height: 1.2em;
    fill: variables.$primary;
  }
}

.cropped {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.map-recap {
  height: 250px;
}
</style>
