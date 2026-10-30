<template>
  <RouterLink class="user-row" :to="toLink" :data-test="`project-row-${user.id}`">
    <!-- picture -->
    <div class="card-image">
      <CroppedApiImage
        :alt="`${user.given_name} ${user.family_name} image`"
        class="picture picture-user skeletons-background"
        :picture-data="user.profile_picture"
        picture-size="medium"
        :default-picture="DEFAULT_USER_PATATOID"
      />
    </div>
    <!-- header row -->
    <h2 class="card-title skeletons-text">{{ user.given_name }} {{ user.family_name }}</h2>
    <p class="card-job skeletons-text">
      {{ translatedJob }}
    </p>
    <p class="card-bio skeletons-text">
      {{ translatedShortBio }}
    </p>
  </RouterLink>
</template>

<script setup lang="ts">
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'

import { DEFAULT_USER_PATATOID } from '~/composables/usePatatoids'
import type { UserModel } from 'shared-projects-frontend/models'

const props = defineProps<{
  user: UserModel
}>()

const { getTranslatableField } = useAutoTranslate()
const translatedJob = getTranslatableField(
  computed(() => props.user),
  'job'
)
const translatedShortBio = getTranslatableField(
  computed(() => props.user),
  'short_bio'
)

const toLink = computed(() => {
  return {
    name: 'ProfileUser',
    params: {
      userIdOrSlug: props.user.slug || props.user.id,
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
