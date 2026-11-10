<template>
  <RouterLink
    class="user-row"
    :to="toLink"
    :title="researcher.display_name"
    :data-test="`project-row-${researcher.user.id}`"
  >
    <!-- picture -->
    <div class="card-image">
      <CroppedApiImage
        :alt="`${researcher.display_name} image`"
        class="picture picture-user skeletons-background"
        :picture-data="researcher.user.profile_picture"
        picture-size="medium"
        :default-picture="DEFAULT_USER_PATATOID"
      />
    </div>
    <!-- header row -->
    <h2 class="card-title skeletons-text">{{ researcher.display_name }}</h2>
    <p class="card-job skeletons-text">
      {{ researcher.user.$t.job }}
    </p>
    <p class="card-bio skeletons-text">
      {{ researcher.$t.short_bio || researcher.user.$t.short_description }}
    </p>
  </RouterLink>
</template>

<script setup lang="ts">
import type CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'
import type { TranslatedResearcher } from 'shared-projects-frontend/models'

import { DEFAULT_USER_PATATOID } from '~/composables/usePatatoids'

const props = defineProps<{
  researcher: TranslatedResearcher
}>()

const toLink = computed(() => {
  return {
    name: 'ProfileUser',
    params: {
      userIdOrSlug: props.researcher.user.slug || props.researcher.user.id,
    },
  }
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

$picture-size: 6rem;

.user-row {
  min-height: $picture-size;
  display: grid;
  grid-template: min-content min-content min-content / $picture-size 1fr;
  grid-template-areas:
    'pict title'
    'pict job'
    'pict bio';
  gap: 1rem;
  align-items: stretch;

  // border: 1px solid variables.$primary;
  // border-radius: 1rem;
  // padding: 1rem;

  @media screen and (max-width: variables.$min-tablet) {
    grid-template: min-content $picture-size min-content min-content / 1fr;
    grid-template-areas:
      'title'
      'pict '
      'job'
      'bio';
  }
}

.card-image {
  grid-area: pict;
  align-content: center;

  @media screen and (max-width: variables.$min-tablet) {
    justify-self: center;
  }
}

.picture-user {
  width: $picture-size;
  height: $picture-size;
  border-radius: 100%;
  border: 1px solid variables.$light-gray;
}

.card-title {
  grid-area: title;
}

.card-job {
  grid-area: job;
}

.card-bio {
  grid-area: bio;
  justify-self: flex-end;
}

.card-title {
  font-weight: 700;
  font-size: 1.2rem;
}
</style>
