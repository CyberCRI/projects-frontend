<template>
  <div class="similar-profile">
    <CroppedApiImage
      :alt="`${structure.name} image`"
      class="picture picture-user skeletons-background"
      :picture-data="structure.people_group.profile_picture"
      picture-size="medium"
      :default-picture="DEFAULT_USER_PATATOID"
    />
    <div class="card-title skeletons-text cropped">
      {{ structure.name }}
    </div>
    <div class="card-description skeletons-text cropped">
      {{ structure.$t.main_mission }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedStructure } from 'shared-projects-frontend/models'
import { DEFAULT_USER_PATATOID } from '~/composables/usePatatoids'

defineProps<{ structure: TranslatedStructure }>()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.similar-profile {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.card-title {
  font-weight: 600;
  font-size: 1rem;
}

.card-description {
  font-size: 1rem;
}

.picture {
  border-radius: 100%;
  height: variables.pxtorem(60px);
  width: variables.pxtorem(60px);
}

.cropped {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
</style>
